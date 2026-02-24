import { notFound } from "next/navigation";
import FallbackImage from "@/components/FallbackImage";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import SizeSelector from "@/components/SizeSelector";
import BidAskSpread from "@/components/BidAskSpread";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const isPositive = product.priceChange >= 0;
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="font-body text-sm text-purple-400 mb-8">
          <span className="hover:text-sockx-primary cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-sockx-primary cursor-pointer">
            {product.category}
          </span>
          <span className="mx-2">/</span>
          <span className="text-sockx-text">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Product Image */}
          <div className="bg-white rounded-2xl border border-purple-100 p-8 aspect-square relative">
            <FallbackImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover p-4"
            />

            {/* Price Change Badge */}
            <div
              className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-body font-semibold ${
                isPositive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
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

          {/* Right - Product Info */}
          <div className="flex flex-col gap-6">
            {/* Brand & Name */}
            <div>
              <p className="font-body text-sm text-purple-400 uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl text-sockx-text uppercase">
                {product.name}
              </h1>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="font-body text-xs text-purple-400 uppercase">
                  Colorway
                </p>
                <p className="font-body font-semibold text-sm text-sockx-text">
                  {product.colorway}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="font-body text-xs text-purple-400 uppercase">
                  Condition
                </p>
                <p className="font-body font-semibold text-sm text-sockx-text">
                  {product.condition}
                </p>
              </div>
            </div>

            {/* Bid/Ask Spread */}
            <BidAskSpread
              lowestAsk={product.lowestAsk}
              highestBid={product.highestBid}
              lastSale={product.lastSale}
            />

            {/* Size Selector */}
            <SizeSelector sizes={product.sizes} />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button className="py-4 px-6 bg-sockx-cta text-white font-body font-bold text-base rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                Place Bid
                <span className="block text-sm font-normal opacity-80 mt-0.5">
                  ${product.highestBid} or higher
                </span>
              </button>
              <button className="py-4 px-6 bg-sockx-primary text-white font-body font-bold text-base rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
                Buy Now
                <span className="block text-sm font-normal opacity-80 mt-0.5">
                  ${product.lowestAsk}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Price History Chart Placeholder */}
        <div className="bg-white rounded-2xl border border-purple-100 p-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl text-sockx-text uppercase">
              Price History
            </h2>
            <div className="flex gap-3">
              {["1M", "3M", "6M", "1Y", "All"].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 rounded-md font-body text-xs font-semibold text-purple-400 hover:bg-purple-100 hover:text-sockx-primary transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-gradient-to-br from-purple-50 to-green-50 rounded-xl flex items-center justify-center border border-purple-100">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-sockx-secondary mx-auto mb-3" />
              <p className="font-body text-sm text-purple-400">
                Price history chart
              </p>
              <p className="font-body text-xs text-purple-300 mt-1">
                Last sale: ${product.lastSale}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl text-sockx-text uppercase mb-8">
            Related Products
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-sockx-text py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-heading text-3xl text-white">SockX</span>
              <p className="font-body text-sm text-purple-300 mt-1">
                The Sock Market
              </p>
            </div>

            <div className="flex gap-8">
              <a
                href="#"
                className="font-body text-sm text-purple-300 hover:text-white transition-colors"
              >
                Browse
              </a>
              <a
                href="#"
                className="font-body text-sm text-purple-300 hover:text-white transition-colors"
              >
                Sell
              </a>
              <a
                href="#"
                className="font-body text-sm text-purple-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="font-body text-sm text-purple-300 hover:text-white transition-colors"
              >
                Help
              </a>
            </div>

            <p className="font-body text-xs text-purple-400">
              &copy; 2026 SockX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
