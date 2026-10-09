import { notFound } from "next/navigation";
import { elementConfig } from "@/lib/payment-element-server";
import { WhopPaymentForm } from "@/components/whop-payment-form";
export const dynamic = "force-dynamic";
export default function PaymentElementPage() {
  try { elementConfig(); } catch { notFound(); }
  return <section className="mx-auto max-w-lg px-6 py-16">
    <h1 className="text-2xl mb-3">Kattassie payment form</h1>
    <p className="text-sm mb-8">Sandbox test only. This form does not purchase or deliver a kit. Use the shop to buy on Whop.</p>
    <WhopPaymentForm />
  </section>;
}
