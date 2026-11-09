import "server-only";

import { getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_INTERVALS = new Set(["hour", "day", "week", "month"]);

export type GrossRevenueQuery = {
  accountId: string;
  from: string;
  to: string;
  interval: string;
  convertTo: string;
};

function isRealDate(value: string) {
  if (!DATE_ONLY.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function parseGrossRevenueQuery(params: URLSearchParams): GrossRevenueQuery {
  const configuredCompany = getWhopCompanyId();
  const allowedAccounts = (process.env.WHOP_REVENUE_ACCOUNT_IDS || configuredCompany)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const accountId = params.get("account_id") || configuredCompany;
  const from = params.get("from") || new Date().toISOString().slice(0, 10);
  const to = params.get("to") || from;
  const interval = params.get("interval") || "hour";
  const convertTo = (params.get("convert_to") || "usd").toLowerCase();

  if (!/^biz_[a-zA-Z0-9]+$/.test(accountId) || !allowedAccounts.includes(accountId)) {
    throw new Error("The requested account is not in WHOP_REVENUE_ACCOUNT_IDS");
  }
  if (!isRealDate(from) || !isRealDate(to) || from > to) {
    throw new Error("from and to must be valid YYYY-MM-DD dates, with from on or before to");
  }
  const days = (Date.parse(`${to}T00:00:00.000Z`) - Date.parse(`${from}T00:00:00.000Z`)) / 86_400_000;
  if (days > 31) throw new Error("Date range cannot exceed 32 calendar days");
  if (!ALLOWED_INTERVALS.has(interval)) {
    throw new Error("interval must be hour, day, week, or month");
  }
  if (!/^[a-z]{3}$/.test(convertTo)) {
    throw new Error("convert_to must be a three-letter currency code");
  }

  return { accountId, from, to, interval, convertTo };
}

/** Read-only Whop gross-revenue time series. */
export async function getWhopGrossRevenue(query: GrossRevenueQuery) {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey || apiKey.includes("xxxxx")) throw new Error("Whop API key is not configured");

  const baseUrl = getWhopEnvironment() === "sandbox"
    ? "https://sandbox-api.whop.com/api/v1"
    : "https://api.whop.com/api/v1";
  const search = new URLSearchParams({
    account_id: query.accountId,
    from: query.from,
    to: query.to,
    interval: query.interval,
    convert_to: query.convertTo,
  });
  const response = await fetch(
    `${baseUrl}/stats/time_series/gross_revenue?${search.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Api-Version-Date": "2026-07-01",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    },
  );
  if (!response.ok) throw new Error(`Whop gross-revenue read failed with HTTP ${response.status}`);
  return response.json() as Promise<unknown>;
}
