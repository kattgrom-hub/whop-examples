"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "./CartContext";
import ProductArtwork from "./ProductArtwork";
export default function ProductCard({ product }: { product: Product }) {
 const { addItem }=useCart();
 return <article className="product-card"><Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}><ProductArtwork product={product}/></Link><div className="card-heading"><p className="eyebrow">{product.category}</p><span>{formatPrice(product.price)}</span></div><Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link><p className="card-description">{product.description}</p><div className="card-actions"><Link href={`/product/${product.id}`}>Explore the kit <ArrowUpRight size={16}/></Link><button onClick={()=>addItem(product)}>Add to cart</button></div><p className="price-note">One-time payment · Digital product</p></article>;
}
