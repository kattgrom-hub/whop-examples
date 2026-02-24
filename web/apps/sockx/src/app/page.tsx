import { Search, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import TrustBar from "@/components/TrustBar";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function Home() {
  const trendingProducts = products.slice(0, 8);
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sockx-primary via-purple-600 to-sockx-text overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-20 w-60 h-60 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border-4 border-white rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white mb-4 tracking-tight uppercase">
              The Sock Market
            </h1>
            <p className="font-body text-lg md:text-xl text-purple-200 mb-10 max-w-xl mx-auto">
              Buy &amp; Sell Verified Authentic Socks. Deadstock designer pairs,
              limited drops, and grail-worthy knits.
            </p>

            {/* Hero Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search for brand, style, colorway..."
                className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-body placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-sockx-cta focus:border-transparent text-base"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-sockx-cta text-white font-body font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
                Search
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-white">
                  12K+
                </p>
                <p className="font-body text-xs text-purple-200 uppercase tracking-wide">
                  Active Listings
                </p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-white">
                  50K+
                </p>
                <p className="font-body text-xs text-purple-200 uppercase tracking-wide">
                  Verified Sales
                </p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-white">
                  100%
                </p>
                <p className="font-body text-xs text-purple-200 uppercase tracking-wide">
                  Authentic
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl md:text-4xl text-sockx-text uppercase">
              Trending Now
            </h2>
            <button className="flex items-center gap-1 font-body text-sm font-semibold text-sockx-primary hover:text-purple-700 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
            {trendingProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-56">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl text-sockx-text uppercase mb-8 text-center">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drops Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl md:text-4xl text-sockx-text uppercase">
              Featured Drops
            </h2>
            <button className="flex items-center gap-1 font-body text-sm font-semibold text-sockx-primary hover:text-purple-700 transition-colors">
              See All Drops <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

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
                href="/sell"
                className="font-body text-sm text-purple-300 hover:text-white transition-colors"
              >
                Sell
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
