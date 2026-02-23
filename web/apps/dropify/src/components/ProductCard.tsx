"use client";

import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "./CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-neutral-100 overflow-hidden rounded-sm">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-normal text-primary tracking-wide">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 text-sm font-light text-secondary">
            ${product.price}
          </p>
        </div>

        <button
          onClick={() => addItem(product)}
          className="opacity-0 group-hover:opacity-100 text-xs font-medium tracking-wide text-primary bg-gold px-4 py-2 rounded-sm transition-all duration-400 hover:bg-gold-hover"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
