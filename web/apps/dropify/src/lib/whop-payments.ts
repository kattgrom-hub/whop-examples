import "server-only";

const API_VERSION_DATE = "2026-09-29";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT === "sandbox"
    ? "https://sandbox-api.whop.com/api/v1"
    : "https://api.whop.com/api/v1";
}

function getHeaders() {
  const apiKey = process.env.WHOP_API_KEY;

  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not configured");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Api-Version-Date": API_VERSION_DATE,
    "Content-Type": "application/json",
  };
}

async function whopRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      body && typeof body === "object" ? JSON.stringify(body) : response.statusText;
    throw new Error(`Whop API ${response.status}: ${detail}`);
  }

  return body as T;
}

export interface WhopPayment {
  id: string;
  client_secret: string | null;
  plan_id: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
}

export interface WhopPaymentStatus {
  id: string;
  status:
    | "requires_confirmation"
    | "requires_action"
    | "requires_capture"
    | "confirming"
    | "processing"
    | "succeeded"
    | "canceled";
}

export function createWhopPayment(input: {
  account_id: string;
  plan_id: string;
  confirmation_token: string;
  return_url: string;
  metadata: Record<string, string>;
}) {
  return whopRequest<WhopPayment>("/payments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function retrieveWhopPayment(paymentId: string) {
  return whopRequest<WhopPayment>(
    `/payments/${encodeURIComponent(paymentId)}`
  );
}

export function retrieveWhopPaymentStatus(paymentId: string) {
  return whopRequest<WhopPaymentStatus>(
    `/payments/${encodeURIComponent(paymentId)}/status`
  );
}
