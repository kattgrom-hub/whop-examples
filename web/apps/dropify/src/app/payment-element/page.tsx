import { elementConfig } from "@/lib/payment-element-server";
import { WhopPaymentForm } from "@/components/whop-payment-form";
import { products, formatPrice } from "@/data/products";
export const dynamic = "force-dynamic";
export default function PaymentElementPage() {
  let sandbox = false;
  try { elementConfig(); sandbox = true; } catch { /* Hosted purchase links need no payment credentials. */ }
  if (!sandbox) return <section className="mx-auto max-w-2xl px-6 py-16">
    <h1 className="text-3xl mb-3">Choose your creator kit</h1>
    <p className="text-sm text-secondary mb-8">Pay securely on Whop, then open your kit’s Downloads app in your Whop account.</p>
    <div className="grid gap-6 sm:grid-cols-2">
      {products.map(product => <article key={product.id} className="border border-border rounded-xl p-6">
        <h2 className="text-xl mb-2">{product.name}</h2>
        <p className="text-sm text-secondary mb-4">{product.description}</p>
        <p className="mb-4">{formatPrice(product.price)} · One-time purchase</p>
        <a className="button dark" href={product.checkoutUrl}>Buy {product.name} on Whop ↗</a>
      </article>)}
    </div>
    <p className="text-sm text-secondary mt-6">Buying both? Complete a separate checkout for each kit using the same Whop account.</p>
  </section>;
  return <section className="mx-auto max-w-lg px-6 py-16">
    <h1 className="text-2xl mb-3">Kattassie payment form</h1>
    <p className="text-sm mb-8">Sandbox test only. This form does not purchase or deliver a kit. Use the shop to buy on Whop.</p>
    <WhopPaymentForm />
  </section>;
}
