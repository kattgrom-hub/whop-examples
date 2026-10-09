-- Apply after orders.sql in a SANDBOX database only. No live delivery or orders.
begin;
create table public.dropify_element_sessions (
  id uuid primary key,
  access_hash text not null check (access_hash ~ '^[0-9a-f]{64}$'),
  company_id text not null,
  plan_id text not null,
  reserved boolean not null default false,
  payment_id text unique,
  created_at timestamptz not null default now()
);
alter table public.dropify_element_sessions enable row level security;
revoke all on public.dropify_element_sessions from public, anon, authenticated;
grant select, insert, update on public.dropify_element_sessions to service_role;
create function public.dropify_create_element_session(p_id uuid, p_access_hash text,
  p_company_id text, p_plan_id text, p_client_key text)
returns public.dropify_element_sessions language plpgsql security invoker set search_path = '' as $$
declare attempt_count integer; new_session public.dropify_element_sessions;
begin
  if p_client_key !~ '^[0-9a-f]{64}$' then raise exception 'Invalid client'; end if;
  insert into public.dropify_checkout_limits as limits (client_key, window_start, attempts)
  values (p_client_key, now(), 1)
  on conflict (client_key) do update set
    attempts = case when limits.window_start < now() - interval '1 minute' then 1 else limits.attempts + 1 end,
    window_start = case when limits.window_start < now() - interval '1 minute' then now() else limits.window_start end
  returning attempts into attempt_count;
  if attempt_count > 5 then return null; end if;
  insert into public.dropify_element_sessions(id, access_hash, company_id, plan_id)
  values (p_id, p_access_hash, p_company_id, p_plan_id) returning * into new_session;
  return new_session;
end $$;
revoke all on function public.dropify_create_element_session(uuid,text,text,text,text) from public, anon, authenticated;
grant execute on function public.dropify_create_element_session(uuid,text,text,text,text) to service_role;
commit;
