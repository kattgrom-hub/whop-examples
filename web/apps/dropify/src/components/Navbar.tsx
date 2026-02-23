"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { openCart, totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-overlay border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-start"
          >
            <span className="text-lg font-light tracking-[0.3em] text-primary">
              LUMI&Egrave;RE
            </span>
            <span className="text-[10px] font-light tracking-[0.2em] text-secondary -mt-0.5">
              Artisan Candle House
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/shop"
              className="text-sm font-light tracking-wide text-secondary transition-colors duration-400 hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/"
              className="text-sm font-light tracking-wide text-secondary transition-colors duration-400 hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-sm font-light tracking-wide text-secondary transition-colors duration-400 hover:text-primary"
            >
              Journal
            </Link>
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 text-primary transition-colors duration-400 hover:text-secondary"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-primary">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
