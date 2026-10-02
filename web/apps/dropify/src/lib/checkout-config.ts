export type WhopEnvironment = "sandbox" | "production";

export function getWhopEnvironment(): WhopEnvironment {
  const value = process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT;
  if (value !== "sandbox" && value !== "production") {
    throw new Error("Set NEXT_PUBLIC_WHOP_ENVIRONMENT to sandbox or production");
  }
  if (process.env.VERCEL_ENV === "preview" && value !== "sandbox") {
    throw new Error("Preview checkouts must use sandbox");
  }
  return value;
}

export function getWhopCompanyId() {
  const value = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
  if (!value || !/^biz_[a-zA-Z0-9]+$/.test(value) || value.includes("xxxxx")) {
    throw new Error("Configure the Whop company for this environment");
  }
  return value;
}

export function getAppOrigin(requestUrl: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const origin = new URL(configured || requestUrl);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  if (origin.username || origin.password || origin.search || origin.hash ||
      (configured && origin.pathname !== "/") ||
      (origin.protocol !== "https:" && !(origin.protocol === "http:" && loopback)) ||
      (process.env.VERCEL_ENV === "production" && loopback)) {
    throw new Error("App URL must be an HTTPS origin (loopback allowed locally)");
  }
  if (!configured && !loopback) {
    const allowed = (process.env.CHECKOUT_ALLOWED_ORIGINS || "").split(",").map(v => v.trim());
    if (process.env.VERCEL_URL) allowed.push(`https://${process.env.VERCEL_URL}`);
    if (!allowed.includes(origin.origin)) throw new Error("Request origin is not allowed");
  }
  if (configured && origin.origin !== new URL(requestUrl).origin) {
    throw new Error("Configured app origin does not match the checkout host");
  }
  return origin.origin;
}
