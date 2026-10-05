"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
export default function Navbar() {
 const { openCart, totalItems } = useCart();
 return <><div className="announcement">A fresh perspective for your next creative chapter.</div><header className="site-nav"><Link className="brand" href="/">kattassie<span>THE CREATOR EDIT</span></Link><nav aria-label="Main navigation"><Link href="/shop">Shop the kits</Link><Link className="desktop-link" href="/#about">Our story</Link><Link className="desktop-link" href="/#faq">Good to know</Link><button className="bag-button" onClick={openCart} aria-label={`Open cart (${totalItems} items)`}><ShoppingBag size={20}/><span>{totalItems}</span></button></nav></header></>;
}
