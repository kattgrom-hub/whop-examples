import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
export default function Home() {
 return <><Hero/><div className="values-strip"><span>Made for creators</span><span>Digital tools, real possibilities</span><span>A$29.99 per kit · One-time</span></div><section className="section" id="collection"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Pick your creative direction.</h2></div><p>From a coastal content rhythm to a sharper short-form video strategy. Start with the kit that fits your next idea.</p></div><div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div></section><section id="about" className="story-section"><div><p className="eyebrow">A NOTE FROM KATTASSIE</p><h2>Ideas are better<br/>with a little <em>direction.</em></h2></div><div><p>Kattassie brings together digital creator kits for two different creative paths: coastal lifestyle content and short-form video.</p><p>Choose the templates and workflows that suit your style. Keep your own voice at the centre of what you create.</p><Link href="/shop" className="text-link">Explore the collection ↗</Link></div></section><section id="faq" className="section faq-section"><p className="eyebrow">GOOD TO KNOW</p><h2>A few things before you start.</h2><div className="faq-grid">{[
 ["Are these physical products?","No. Both are digital creator kits. There is no physical shipment or delivery address to enter."],
 ["Is this a subscription?","Both kits are priced at A$29.99 each as a one-time purchase. Buying both is A$59.98 before any applicable checkout adjustments."],
 ["Which kit should I choose?","Coastal Creator Toolkit focuses on lifestyle content, templates and workflows. Viral Gold Video Kit focuses on hooks, editing and short-form platform strategy."],
 ["Can I buy right now?","Sales are currently paused while product delivery is completed. You can browse the kits and build your cart; payments will open once access is ready."],
 ["Does Viral Gold guarantee viral results?","No. Reach and engagement depend on your content, audience and platform. The kit provides creative resources, not guaranteed views or income."],
 ["How will I receive my kit?","The product access and delivery instructions will be confirmed here before sales open. We will not take payment before delivery is ready."]
 ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section></>;
}
