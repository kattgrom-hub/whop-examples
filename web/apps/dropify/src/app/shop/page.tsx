"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { products, Product } from "@/data/products";

const SCENT_FILTERS = ["All", "Floral", "Woody", "Citrus", "Spice", "Fruity"] as const;

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function ShopPage() {
  const [activeScent, setActiveScent] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredProducts = useMemo(() => {
    let filtered: Product[] =
      activeScent === "All"
        ? [...products]
        : products.filter((p) => p.scent === activeScent);

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [activeScent, sortBy]);

  return (
    <div className="px-6 lg:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-primary">
            Shop All
          </h1>
          <p className="mt-3 text-sm font-light text-secondary">
            {products.length} hand-poured luxury candles
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Scent Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {SCENT_FILTERS.map((scent) => (
              <button
                key={scent}
                onClick={() => setActiveScent(scent)}
                className={`px-4 py-1.5 text-xs font-light tracking-wide rounded-sm transition-all duration-400 ${
                  activeScent === scent
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-primary border border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {scent}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs font-light text-secondary border border-neutral-200 rounded-sm px-4 py-2 outline-none transition-colors duration-400 focus:border-neutral-400 bg-transparent appearance-none pr-8 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-secondary">
              No candles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
