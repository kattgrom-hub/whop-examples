import "server-only";

import { getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {};
}

function asList(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) return value.map(asRecord);
  const record = asRecord(value);
  if (Array.isArray(record.data)) return record.data.map(asRecord);
  if (Array.isArray(record.results)) return record.results.map(asRecord);
  return [];
}

function safeText(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function whopGet(path: string) {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey || apiKey.includes("xxxxx")) throw new Error("Whop API key is not configured");
  const environment = getWhopEnvironment();
  const baseUrl = environment === "sandbox"
    ? "https://sandbox-api.whop.com/api/v1"
    : "https://api.whop.com/api/v1";
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Api-Version-Date": "2026-08-21",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    // Never return provider response bodies: they can contain account details.
    throw new Error(`Whop read failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

/**
 * Read-only business reconciliation snapshot. This module deliberately exposes
 * no create/update/withdraw/transfer operations and never returns payout destinations.
 */
export async function getWhopPayoutAudit() {
  const companyId = getWhopCompanyId();
  const [ledgerRaw, payoutsRaw] = await Promise.all([
    whopGet(`/ledger_accounts/${encodeURIComponent(companyId)}`),
    whopGet(`/payouts?account_id=${encodeURIComponent(companyId)}`),
  ]);

  const ledger = asRecord(ledgerRaw);
  const balances = Array.isArray(ledger.balances) ? ledger.balances.map((item) => {
    const row = asRecord(item);
    return {
      currency: safeText(row.currency),
      available: safeNumber(row.balance),
      pending: safeNumber(row.pending_balance),
      reserved: safeNumber(row.reserve_balance),
    };
  }) : [];

  const payouts = asList(payoutsRaw).slice(0, 100).map((row) => ({
    id: safeText(row.id),
    status: safeText(row.status),
    amount: safeNumber(row.amount),
    currency: safeText(row.currency),
    createdAt: safeText(row.created_at),
    updatedAt: safeText(row.updated_at),
  }));

  return {
    environment: getWhopEnvironment(),
    companyId,
    ledgerAccountId: safeText(ledger.id),
    balances,
    payouts,
    payoutCountReturned: payouts.length,
    generatedAt: new Date().toISOString(),
    readOnly: true as const,
  };
}
