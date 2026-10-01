-- Run on the chosen Dropify Supabase database before enabling checkout.
-- Tables and RPCs are accessible only to the server service_role, never buyers.
begin;
grant usage on schema public to service_role;
create table public.dropify_orders (
  id uuid primary key,
  access_hash text not null,
  environment text not null check (environment in ('sandbox', 'production')),
  company_id text not null,
  currency text not null,
  total_minor bigint not null check (total_minor > 0),
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  status text not null default 'pending' check (status in ('pending','paid','review')),
  plan_id text,
  checkout_configuration_id text,
  payment_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create table public.dropify_checkout_limits (
  client_key text primary key,
  window_start timestamptz not null,
  attempts integer not null
);
create table public.dropify_payments (
  payment_id text primary key,
  order_id uuid not null references public.dropify_orders(id),
  event_id text not null,
  created_at timestamptz not null default now()
);
create table public.dropify_fulfilment_queue (
  order_id uuid primary key references public.dropify_orders(id),
  payment_id text not null unique,
  status text not null check (status in ('pending','review','shipped','held')),
  shipping_address jsonb,
  customer_email text,
  created_at timestamptz not null default now(),
  shipped_at timestamptz,
  tracking_reference text
);
alter table public.dropify_orders enable row level security;
alter table public.dropify_checkout_limits enable row level security;
alter table public.dropify_payments enable row level security;
alter table public.dropify_fulfilment_queue enable row level security;
revoke all on public.dropify_orders, public.dropify_checkout_limits, public.dropify_payments, public.dropify_fulfilment_queue from public, anon, authenticated;
grant select, insert, update on public.dropify_orders, public.dropify_checkout_limits, public.dropify_payments, public.dropify_fulfilment_queue to service_role;

create function public.dropify_create_order(p_order jsonb, p_client_key text)
returns public.dropify_orders language plpgsql security invoker set search_path = '' as $$
declare
  attempt_count integer;
  new_order public.dropify_orders;
begin
  if p_client_key !~ '^[0-9a-f]{64}$' then raise exception 'Invalid client key'; end if;
  insert into public.dropify_checkout_limits as limits (client_key, window_start, attempts)
  values (p_client_key, now(), 1)
  on conflict (client_key) do update set
    attempts = case when limits.window_start < now() - interval '1 minute' then 1 else limits.attempts + 1 end,
    window_start = case when limits.window_start < now() - interval '1 minute' then now() else limits.window_start end
  returning attempts into attempt_count;
  if attempt_count > 5 then return null; end if;
  insert into public.dropify_orders(id, access_hash, environment, company_id, total_minor, currency, items)
  values ((p_order->>'id')::uuid, p_order->>'access_hash', p_order->>'environment', p_order->>'company_id',
    (p_order->>'total_minor')::bigint, p_order->>'currency', p_order->'items') returning * into new_order;
  return new_order;
end $$;

create function public.dropify_record_payment(p_order_id uuid, p_payment_id text, p_event_id text,
  p_shipping_address jsonb, p_customer_email text)
returns text language plpgsql security invoker set search_path = '' as $$
declare
  current_order public.dropify_orders;
  existing_payment public.dropify_payments;
begin
  if p_payment_id !~ '^pay_[a-zA-Z0-9]+$' or p_event_id = '' then raise exception 'Invalid payment'; end if;
  select * into current_order from public.dropify_orders where id = p_order_id for update;
  if not found then raise exception 'Unknown order'; end if;
  select * into existing_payment from public.dropify_payments where payment_id = p_payment_id;
  if found then
    if existing_payment.order_id <> p_order_id then raise exception 'Payment belongs to another order'; end if;
    return 'duplicate';
  end if;
  insert into public.dropify_payments(payment_id, order_id, event_id) values (p_payment_id, p_order_id, p_event_id);
  if current_order.payment_id is not null then
    update public.dropify_orders set status = 'review' where id = p_order_id;
    update public.dropify_fulfilment_queue set status = 'held' where order_id = p_order_id and status <> 'shipped';
    return 'extra_payment_review';
  end if;
  update public.dropify_orders set payment_id = p_payment_id, paid_at = now(),
    status = case when p_shipping_address is null or current_order.status = 'review' then 'review' else 'paid' end where id = p_order_id;
  insert into public.dropify_fulfilment_queue(order_id, payment_id, status, shipping_address, customer_email)
  values (p_order_id, p_payment_id, case when p_shipping_address is null or current_order.status = 'review' then 'review' else 'pending' end,
    p_shipping_address, p_customer_email);
  return 'recorded';
end $$;
revoke all on function public.dropify_create_order(jsonb,text) from public, anon, authenticated;
revoke all on function public.dropify_record_payment(uuid,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.dropify_create_order(jsonb,text) to service_role;
grant execute on function public.dropify_record_payment(uuid,text,text,jsonb,text) to service_role;
create function public.dropify_hold_order(p_order_id uuid)
returns text language plpgsql security invoker set search_path = '' as $$
begin
  perform 1 from public.dropify_orders where id = p_order_id for update;
  if not found then raise exception 'Unknown order'; end if;
  update public.dropify_orders set status = 'review' where id = p_order_id;
  update public.dropify_fulfilment_queue set status = 'held' where order_id = p_order_id and status <> 'shipped';
  return 'held';
end $$;
revoke all on function public.dropify_hold_order(uuid) from public, anon, authenticated;
grant execute on function public.dropify_hold_order(uuid) to service_role;
commit;
