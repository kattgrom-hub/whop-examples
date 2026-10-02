"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import ProductArtwork from "@/components/ProductArtwork";
import { useCart } from "@/components/CartContext";
export default function ProductPage() {
 const { id }=useParams(); const product=products.find(p=>p.id===id); const { addItem }=useCart();
 if(!product) return <section className="section"><h1 className="page-title">Kit not found</h1><Link href="/shop">Browse the collection</Link></section>;
 return <section className="section"><Link className="back-link" href="/shop"><ArrowLeft size={16}/> Back to the collection</Link><div className="product-detail"><ProductArtwork product={product}/><div><p className="eyebrow">{product.category}</p><h1 className="page-title">{product.name}</h1><p className="detail-price">{formatPrice(product.price)} <span>One-time · AUD</span></p><h2 className="detail-headline">{product.headline}</h2><p>{product.description}</p><h3 className="features-heading">Inside the kit</h3><ul className="feature-list">{product.features.map(feature=><li key={feature}><Check size={17}/>{feature}</li>)}</ul><a className="button dark" href={product.checkoutUrl}>Buy on Whop — {formatPrice(product.price)} ↗</a><button className="text-link" onClick={()=>addItem(product)}>Add to cart</button><p className="delivery-note">Digital download · One-time purchase. After payment, download the ZIP from your kit’s Downloads app in Whop, unzip it and start with START_HERE.txt.</p>{product.tone==="gold"&&<p className="delivery-note">Creative resources do not guarantee views, engagement or income.</p>}</div></div></section>;
}
