import Link from "next/link";
import { AuctionCard } from "@/components/auction-card";
import { getFeaturedAuctions, getEndingSoonAuctions, categories } from "@/lib/data";

const categoryEmojis: Record<string, string> = {
  "trading-cards": "cards",
  sneakers: "sneakers",
  memorabilia: "memorabilia",
  watches: "watches",
  art: "art",
  collectibles: "collectibles",
};

const categoryDisplay: Record<string, { emoji: string; label: string }> = {
  "trading-cards": { emoji: "cards", label: "Cards" },
  sneakers: { emoji: "sneakers", label: "Sneakers" },
  memorabilia: { emoji: "memorabilia", label: "Memorabilia" },
  watches: { emoji: "watches", label: "Watches" },
  art: { emoji: "art", label: "Art" },
  collectibles: { emoji: "collectibles", label: "Collectibles" },
};

export default function Home() {
  const featuredAuctions = getFeaturedAuctions();
  const endingSoonAuctions = getEndingSoonAuctions();

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bid on <span className="text-purple-500">premium</span> collectibles
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Authenticated trading cards, sneakers, watches, art, and memorabilia.
            Secure bidding with verified sellers and guaranteed authenticity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auctions"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Browse Auctions
            </Link>
            <Link
              href="/auth/login?role=seller"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/auctions?category=${category.slug}`}
                className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-xl hover:bg-gray-750 hover:border-purple-500/50 transition-all border border-gray-700 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {category.slug === "trading-cards" && (
                    <span role="img" aria-label="Cards">&#127183;</span>
                  )}
                  {category.slug === "sneakers" && (
                    <span role="img" aria-label="Sneakers">&#128095;</span>
                  )}
                  {category.slug === "memorabilia" && (
                    <span role="img" aria-label="Memorabilia">&#127942;</span>
                  )}
                  {category.slug === "watches" && (
                    <span role="img" aria-label="Watches">&#8986;</span>
                  )}
                  {category.slug === "art" && (
                    <span role="img" aria-label="Art">&#127912;</span>
                  )}
                  {category.slug === "collectibles" && (
                    <span role="img" aria-label="Collectibles">&#128142;</span>
                  )}
                </span>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ending Soon */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">Ending Soon</h2>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg animate-pulse">
                Live
              </span>
            </div>
            <Link
              href="/auctions?sort=ending"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endingSoonAuctions.slice(0, 3).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Auctions</h2>
            <Link
              href="/auctions?featured=true"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Browse</h3>
              <p className="text-gray-400">
                Explore authenticated collectibles from verified sellers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Bid</h3>
              <p className="text-gray-400">
                Place bids on items you want. Get notified if outbid.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Win</h3>
              <p className="text-gray-400">
                Highest bidder wins when the auction ends.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Receive</h3>
              <p className="text-gray-400">
                Secure payment and insured shipping to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-500">$2M+</div>
              <div className="text-gray-400 text-sm">Total Sales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500">10K+</div>
              <div className="text-gray-400 text-sm">Items Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500">99.8%</div>
              <div className="text-gray-400 text-sm">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500">100%</div>
              <div className="text-gray-400 text-sm">Authenticity Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500">
        <p>
          Powered by{" "}
          <a
            href="#"
            className="text-purple-500 hover:text-purple-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Platform
          </a>
        </p>
      </footer>
    </main>
  );
}
