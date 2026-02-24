"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/components/CartContext";

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-normal tracking-wide text-primary">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-secondary transition-transform duration-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <div className="text-sm font-light leading-[1.8] text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <h1 className="text-2xl font-extralight text-primary">
          Product not found
        </h1>
        <Link
          href="/shop"
          className="mt-6 text-sm font-light text-secondary transition-colors duration-400 hover:text-primary underline underline-offset-4"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-light text-secondary">
          <Link
            href="/"
            className="transition-colors duration-400 hover:text-primary"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/shop"
            className="transition-colors duration-400 hover:text-primary"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
          {/* Image — 60% */}
          <div className="md:col-span-3">
            <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info — 40% */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <p className="text-xs font-light tracking-widest text-secondary uppercase">
                {product.scent}
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extralight tracking-tight text-primary leading-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-lg font-light text-primary">
                ${product.price}
              </p>

              <p className="mt-6 text-sm font-light leading-[1.8] text-secondary">
                {product.description}
              </p>

              {/* Scent Notes */}
              <div className="mt-6 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium tracking-wide text-primary w-14">
                    Top
                  </span>
                  <span className="text-xs font-light text-secondary">
                    {product.notes.top}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium tracking-wide text-primary w-14">
                    Middle
                  </span>
                  <span className="text-xs font-light text-secondary">
                    {product.notes.middle}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium tracking-wide text-primary w-14">
                    Base
                  </span>
                  <span className="text-xs font-light text-secondary">
                    {product.notes.base}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-xs font-light tracking-wide text-secondary">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center border border-neutral-200 rounded-sm text-secondary transition-colors duration-400 hover:border-primary hover:text-primary"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="text-sm font-light text-primary w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center border border-neutral-200 rounded-sm text-secondary transition-colors duration-400 hover:border-primary hover:text-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addItem(product, quantity)}
                className="mt-6 w-full bg-gold py-3.5 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover"
              >
                Add to Cart &mdash; Pay with Whop
              </button>

              {/* Accordion */}
              <div className="mt-10">
                <AccordionItem title="Description" defaultOpen>
                  <p>{product.description}</p>
                  <p className="mt-3">
                    {product.weight} &middot; {product.burnTime} burn time
                  </p>
                </AccordionItem>

                <AccordionItem title="Ingredients">
                  <p>
                    100% pure sustainable beeswax, natural essential oil blend,
                    cotton wick. Free from paraffin, synthetic fragrances, and
                    dyes. Hand-poured in small batches in our California
                    atelier.
                  </p>
                </AccordionItem>

                <AccordionItem title="Shipping">
                  <p>
                    Complimentary shipping on orders over $150. Standard
                    shipping (3-5 business days) is $8. Express shipping (1-2
                    business days) is $15. We ship worldwide.
                  </p>
                </AccordionItem>
              </div>

              {/* Badge */}
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <p className="text-[11px] font-light text-neutral-400 text-center">
                  Payments powered by Whop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
