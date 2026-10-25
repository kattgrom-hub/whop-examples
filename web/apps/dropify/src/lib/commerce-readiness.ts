import "server-only";

const checks = {
  whopEnvironment: () => process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT === "sandbox" || process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT === "production",
  whopCompany: () => /^biz_[a-zA-Z0-9]+$/.test(process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || ""),
  whopApiKey: () => Boolean(process.env.WHOP_API_KEY && !process.env.WHOP_API_KEY.includes("xxxxx")),
  paymentElementEnabled: () => process.env.DROPIFY_PAYMENT_ELEMENT_ENABLED === "true",
  paymentElementPlan: () => /^plan_[a-zA-Z0-9]+$/.test(process.env.DROPIFY_PAYMENT_ELEMENT_PLAN_ID || ""),
  orderDatabaseUrl: () => Boolean(process.env.DROPIFY_SUPABASE_URL),
  orderDatabaseKey: () => Boolean(process.env.DROPIFY_SUPABASE_SERVICE_ROLE_KEY && !process.env.DROPIFY_SUPABASE_SERVICE_ROLE_KEY.includes("xxxxx")),
  checkoutSigningSecret: () => Boolean(process.env.CHECKOUT_SIGNING_SECRET && process.env.CHECKOUT_SIGNING_SECRET.length >= 32),
};

export type CommerceReadiness = {
  environment: string;
  ready: boolean;
  checks: Record<keyof typeof checks, boolean>;
};

export function commerceReadiness(): CommerceReadiness {
  const result = Object.fromEntries(
    Object.entries(checks).map(([name, check]) => {
      try { return [name, Boolean(check())]; } catch { return [name, false]; }
    }),
  ) as Record<keyof typeof checks, boolean>;

  return {
    environment: process.env.VERCEL_ENV || "local",
    ready: Object.values(result).every(Boolean),
    checks: result,
  };
}
