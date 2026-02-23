import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isPositive = product.priceChange >= 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-square bg-purple-50 p-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-body text-purple-400 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          <h3 className="font-body font-semibold text-sockx-text text-sm leading-tight mb-3 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-body text-gray-400">Lowest Ask</p>
              <p className="font-body font-bold text-lg text-sockx-text">
                ${product.lowestAsk}
              </p>
            </div>

            <div
              className={`flex items-center gap-0.5 text-sm font-body font-semibold ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" />
              )}
              {Math.abs(product.priceChange)}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
