"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

type QueueItem = { order_id: string; status: string; customer_email: string | null; shipping_address: Record<string, string> | null; tracking_reference: string | null; dropify_orders: { items: { name: string; quantity: number }[] } };
export default function FulfilmentPage() {
  const [rows, setRows] = useState<QueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/fulfilment", { cache: "no-store" }).then(async response => {
      const data = await response.json();
      if (cancelled) return;
      if (!response.ok) setError(data.error); else { setError(null); setRows(data); }
    }).catch(() => { if (!cancelled) setError("Queue unavailable"); });
    return () => { cancelled = true; };
  }, [refresh]);
  const ship = async (event: React.FormEvent<HTMLFormElement>, orderId: string) => {
    event.preventDefault(); setBusy(true);
    const trackingReference = new FormData(event.currentTarget).get("trackingReference");
    try {
      const response = await fetch("/api/fulfilment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, trackingReference }) });
      const data = await response.json();
      if (!response.ok) setError(data.error || "Order status changed. Refresh before shipping."); else setRefresh(n => n + 1);
    } catch { setError("Unable to record shipment"); } finally { setBusy(false); }
  };
  return <main className="max-w-4xl mx-auto px-6 py-12">
    <h1 className="text-2xl mb-6">Order fulfilment</h1>
    {error && <div role="alert" className="mb-6"><p>{error}</p><button onClick={() => signIn("whop", { callbackUrl: "/fulfilment" })} className="underline mt-2">Sign in as staff</button></div>}
    <button className="underline mb-6" onClick={() => setRefresh(n => n + 1)}>Refresh queue</button>
    {!error && !rows.length && <p>No orders in the queue.</p>}
    {rows.map(row => <article key={row.order_id} className="border p-6 mb-6 rounded">
      <h2 className="font-medium">Order {row.order_id}</h2><p>Status: {row.status}</p>
      <ul className="my-3">{row.dropify_orders.items.map((item, i) => <li key={i}>{item.quantity} × {item.name}</li>)}</ul>
      {row.customer_email && <p>{row.customer_email}</p>}
      {row.shipping_address && <address className="my-3 not-italic">{["name", "line1", "line2", "city", "state", "postal_code", "country"].map(key => row.shipping_address?.[key] && <div key={key}>{row.shipping_address[key]}</div>)}</address>}
      {row.status === "pending" && <form onSubmit={event => ship(event, row.order_id)} className="mt-4">
        <label>Tracking reference<input name="trackingReference" required maxLength={200} className="border p-2 ml-3" /></label>
        <button disabled={busy} className="ml-3 underline" type="submit">Record dispatch</button>
      </form>}
      {row.tracking_reference && <p>Tracking: {row.tracking_reference}</p>}
    </article>)}
  </main>;
}
