import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const loaded = () => loadTs("src/lib/commerce-readiness.ts");

test("readiness reports booleans only and never exposes credential values", () => {
  Object.assign(process.env, {
    VERCEL_ENV: "preview",
    NEXT_PUBLIC_WHOP_ENVIRONMENT: "sandbox",
    NEXT_PUBLIC_WHOP_COMPANY_ID: "biz_Test123",
    WHOP_API_KEY: "secret-value",
    DROPIFY_PAYMENT_ELEMENT_ENABLED: "true",
    DROPIFY_PAYMENT_ELEMENT_PLAN_ID: "plan_Test123",
    DROPIFY_SUPABASE_URL: "https://example.supabase.co",
    DROPIFY_SUPABASE_SERVICE_ROLE_KEY: "service-secret",
    CHECKOUT_SIGNING_SECRET: "12345678901234567890123456789012",
  });

  const result = loaded().commerceReadiness();
  assert.equal(result.ready, true);
  assert.equal(result.environment, "preview");
  for (const value of Object.values(result.checks)) assert.equal(typeof value, "boolean");
  assert.doesNotMatch(JSON.stringify(result), /secret-value|service-secret/);
});

test("missing provider or delivery prerequisites fail closed", () => {
  for (const key of [
    "NEXT_PUBLIC_WHOP_COMPANY_ID",
    "WHOP_API_KEY",
    "DROPIFY_PAYMENT_ELEMENT_PLAN_ID",
    "DROPIFY_SUPABASE_SERVICE_ROLE_KEY",
    "CHECKOUT_SIGNING_SECRET",
  ]) delete process.env[key];

  process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT = "sandbox";
  process.env.DROPIFY_PAYMENT_ELEMENT_ENABLED = "true";
  process.env.DROPIFY_SUPABASE_URL = "https://example.supabase.co";

  const result = loaded().commerceReadiness();
  assert.equal(result.ready, false);
});
