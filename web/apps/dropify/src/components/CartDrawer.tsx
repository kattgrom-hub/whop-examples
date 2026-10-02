"use client";
import { useEffect, useRef } from "react";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/data/products";
export default function CartDrawer() {
 const { items,isOpen,closeCart,removeItem,totalPrice }=useCart();
 const panel = useRef<HTMLElement>(null);
 useEffect(() => {
   if (!isOpen) return;
   const previous = document.activeElement as HTMLElement | null;
   const oldOverflow = document.body.style.overflow;
   document.body.style.overflow = "hidden";
   panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
   const onKey = (event: KeyboardEvent) => {
     if (event.key === "Escape") closeCart();
     if (event.key !== "Tab") return;
     const controls = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
     if (!controls?.length) return;
     const first = controls[0], last = controls[controls.length - 1];
     if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
     else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
   };
   document.addEventListener("keydown", onKey);
   return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = oldOverflow; previous?.focus(); };
 }, [isOpen, closeCart]);
 if(!isOpen) return null;
 return <><div className="cart-backdrop" onClick={closeCart}/><aside ref={panel} className="cart-panel" role="dialog" aria-modal="true" aria-label="Your creator kits"><div className="cart-header"><h2>Your creator kits</h2><button aria-label="Close cart" onClick={closeCart}><X size={22}/></button></div><div className="cart-items">{items.length?items.map(item=><article key={item.product.id}><div><h3>{item.product.name}</h3><p>{formatPrice(item.product.price)} · Digital kit</p></div><button onClick={()=>removeItem(item.product.id)} aria-label={`Remove ${item.product.name}`}><X size={18}/></button></article>):<div className="empty-cart"><ShoppingBag size={32}/><p>Your next creative chapter starts here.</p><Link href="/shop" onClick={closeCart}>Explore the kits ↗</Link></div>}</div>{items.length>0&&<div className="cart-summary"><div><span>Subtotal (AUD)</span><strong>{formatPrice(totalPrice)}</strong></div><p>One copy of each digital kit. No shipping required.</p><p>Complete a separate Whop checkout for each kit. Sign in to the same Whop account to keep both downloads together.</p>{items.map(item=><a key={item.product.id} className="button dark" href={item.product.checkoutUrl}>Buy {item.product.name} — {formatPrice(item.product.price)} ↗</a>)}<p>After payment, open your kit’s Downloads app in Whop.</p><Link href="/#faq" onClick={closeCart}>Delivery details ↗</Link></div>}</aside></>;
}
