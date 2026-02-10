"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Transfer {
  id: string;
  amount: number;
  currency: string;
  origin_ledger_account_id: string;
  destination_ledger_account_id: string;
  fee_amount: number | null;
  metadata: Record<string, string> | null;
  notes: string | null;
  created_at: string;
}

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/transfers")
      .then((r) => r.json())
      .then((data) => setTransfers(data.transfers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display italic text-2xl text-text-primary">Transfer History</h1>
        <Link
          href="/admin"
          className="group text-text-secondary hover:text-text-primary transition-colors text-sm inline-flex items-center gap-1"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Requests
        </Link>
      </div>

      {transfers.length === 0 ? (
        <p className="text-text-tertiary text-center py-12">No transfers yet.</p>
      ) : (
        <div className="space-y-3 stagger-children">
          {transfers.map((t) => (
            <div key={t.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-amber-400 font-semibold">${(t.amount / 100).toFixed(2)}</span>
                <span className="text-xs text-text-tertiary">{t.currency.toUpperCase()}</span>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>To: <span className="font-mono text-xs">{t.destination_ledger_account_id}</span></p>
                <p>From: <span className="font-mono text-xs">{t.origin_ledger_account_id}</span></p>
                {t.notes && <p>{t.notes}</p>}
                <p>{new Date(t.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
