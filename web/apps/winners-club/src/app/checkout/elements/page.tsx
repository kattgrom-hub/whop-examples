import { WhopEmbeddedCheckout } from "@/components/whop-checkout";

export const metadata = {
  title: "Secure checkout | Winners Club",
  description: "Complete your purchase securely with Whop.",
};

export const dynamic = "force-dynamic";

export default function ElementsCheckoutPage() {
  const enabled = process.env.WHOP_ELEMENTS_ENABLED === "true";
  const planId = process.env.WHOP_ELEMENTS_PLAN_ID ?? "";
  const environment = process.env.NEXT_PUBLIC_WHOP_ELEMENTS_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Winners Club
        </p>
        <h1 className="mb-3 text-3xl font-bold">Secure checkout</h1>
        <p className="mb-8 max-w-2xl text-sm text-gray-400">
          Your payment details are collected in Whop’s secure checkout fields.
        </p>

        {!enabled ? (
          <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
            Whop Elements checkout is disabled. Set WHOP_ELEMENTS_ENABLED=true and
            WHOP_ELEMENTS_PLAN_ID on the server to enable this route.
          </p>
        ) : !/^plan_[A-Za-z0-9]+$/.test(planId) ? (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-5 text-red-200">
            Checkout is enabled, but WHOP_ELEMENTS_PLAN_ID is missing or invalid.
          </p>
        ) : (
          <WhopEmbeddedCheckout planId={planId} environment={environment} />
        )}
      </div>
    </main>
  );
}
