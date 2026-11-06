import "server-only";

import { getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {};
}

function asList(value: unknown): JsonRecord[] {
  const record = asRecord(value);
  return Array.isArray(record.data) ? record.data.map(asRecord) : [];
}

function safeText(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function safeAmount(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
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
      "Api-Version-Date": "2026-11-05-1",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Whop read failed with HTTP ${response.status}`);
  return response.json() as Promise<unknown>;
}

/**
 * Read-only account financial snapshot using documented Whop endpoints.
 * No create, update, cancel, withdraw, transfer, deposit, or swap methods exist here.
 */
export async function getWhopPayoutAudit() {
  const companyId = getWhopCompanyId();
  const query = new URLSearchParams({ account_id: companyId });
  const [reportRaw, activityRaw, payoutsRaw] = await Promise.all([
    whopGet(`/financial_reports?${new URLSearchParams({ account_id: companyId, report_type: "balance_summary" })}`),
    whopGet(`/financial_activity?${new URLSearchParams({ ...Object.fromEntries(query), limit: "50", include_resource: "false" })}`),
    whopGet(`/payouts?${new URLSearchParams({ ...Object.fromEntries(query), first: "50" })}`),
  ]);

  const report = asRecord(reportRaw);
  const rows = asList({ data: report.rows }).map((row) => ({
    accountName: safeText(row.account_name),
    accountPath: safeText(row.account_ik_path),
    accountType: safeText(row.account_type),
    amount: safeAmount(row.amount),
    currency: safeText(row.currency),
    grouping: safeText(row.grouping),
    lineCategory: safeText(row.line_category),
  }));

  const activityEnvelope = asRecord(activityRaw);
  const activity = asList(activityRaw).map((row) => ({
    id: safeText(row.id),
    amount: safeAmount(row.amount),
    currency: safeText(asRecord(row.currency).code),
    lineType: safeText(row.line_type),
    postedAt: safeText(row.posted_at),
    availableAt: safeText(row.available_at),
    paymentId: safeText(row.payment_id),
  }));

  const payouts = asList(payoutsRaw).map((row) => ({
    id: safeText(row.id),
    status: safeText(row.status),
    amount: safeAmount(row.amount),
    currency: safeText(row.currency),
    createdAt: safeText(row.created_at),
    estimatedArrival: safeText(row.estimated_arrival),
    // Deliberately omit bank, wallet, and payout-method details.
  }));

  return {
    environment: getWhopEnvironment(),
    companyId,
    balanceSummary: {
      total: safeAmount(report.total),
      beginningBalance: safeAmount(report.beginning_balance),
      endingBalance: safeAmount(report.ending_balance),
      currencies: Array.isArray(report.currencies) ? report.currencies.filter((v): v is string => typeof v === "string") : [],
      rows,
    },
    recentActivity: activity,
    activityPageInfo: asRecord(activityEnvelope.page_info),
    payouts,
    payoutPageInfo: asRecord(asRecord(payoutsRaw).page_info),
    generatedAt: new Date().toISOString(),
    readOnly: true as const,
  };
}
