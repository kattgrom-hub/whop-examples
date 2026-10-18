import type { Metadata } from "next";
import { creditMasteryOffer, getCreditMasteryCheckout } from "@/lib/credit-mastery-checkout";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "AI Credit Mastery — Credit Clarity Workbook + AI Toolkit",
  description: "A practical Australian credit-education workbook and AI drafting toolkit. A$197 one-time payment. General education only.",
  keywords: ["Australian credit education", "credit report workbook", "AI drafting toolkit", "digital workbook"],
};

export default async function CreditMasteryPage() {
  let available = false;
  try { available = !!(await getCreditMasteryCheckout()); } catch { /* Fail closed. */ }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: creditMasteryOffer.name,
    description: "A practical Australian credit-education workbook and AI drafting toolkit for reviewing credit-report information, organising records and preparing questions for your own review.",
    category: "Digital credit-education workbook and AI toolkit",
    audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "Australia" } },
    offers: {
      "@type": "Offer",
      price: "197.00",
      priceCurrency: "AUD",
      availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      businessFunction: "https://purl.org/goodrelations/v1#Sell",
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, "\\u003c") }}
      />
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-700">AI Credit Mastery · Australian edition</p>
      <h1 className="mb-6 text-4xl font-semibold leading-tight">Understand your credit report. Organise the evidence. Choose your next step.</h1>
      <p className="mb-4 text-lg">A practical Australian workbook and AI drafting toolkit for reviewing credit-report information, organising records and preparing questions for your own review.</p>
      <p className="mb-10">General education only. No score change, deletion, approval or timeframe is promised.</p>
      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-8">
        <h2 className="mb-3 text-2xl font-semibold">{creditMasteryOffer.name}</h2>
        <p className="mb-2 text-xl font-semibold">{creditMasteryOffer.priceLabel}</p>
        <p className="mb-6 text-sm">Digital download · personal learning · no subscription</p>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>22-page printable Credit Clarity Workbook</li>
          <li>24 reusable AI prompts and an offline prompt builder</li>
          <li>Priority action-plan worksheet and dated Australian review sequence</li>
          <li>Three fictional worked examples</li>
          <li>Four editable sample correspondence templates and four CSV trackers</li>
        </ul>
        <p className="mb-6">Third-party AI services, future updates, videos, coaching, personalised advice and credit or lending outcomes are not included.</p>
        {available ? (
          <form method="post" action="/api/credit-mastery/checkout">
            <button className="rounded-lg bg-teal-800 px-6 py-3 font-semibold text-white" type="submit">Buy the Credit Clarity Workbook + AI Toolkit — A$197</button>
            <p className="mt-3 text-sm">Continue to Whop’s hosted checkout. Access is provided only after payment is confirmed.</p>
          </form>
        ) : (
          <div role="status">
            <button className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-600" disabled>Purchases currently unavailable</button>
            <p className="mt-3 text-sm">Payment and secure delivery are being verified. No payment is accepted from this page while verification is incomplete.</p>
          </div>
        )}
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Before you buy</h2>
        <p>You can request correction of inaccurate credit-report information for free without buying this product. Correct negative information cannot be removed merely because it is unfavourable.</p>
        <p>The toolkit does not contact a credit reporting body, submit requests, analyse a complete report, run an AI model or influence a lender’s decision.</p>
        <p>Use fictional or carefully redacted notes with AI tools. Do not share complete credit reports, identity documents, account numbers, passwords, card details or one-time codes.</p>
        <p>Rights under the Australian Consumer Law are not excluded. No additional change-of-mind refund promise is made. The applicable policy must be disclosed before purchase.</p>
      </section>
    </article>
  );
}
