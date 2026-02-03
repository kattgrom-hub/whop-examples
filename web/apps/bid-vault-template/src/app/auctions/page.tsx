import { AuctionCard } from "@/components/auction-card";
import { auctions, categories } from "@/lib/data";
import Link from "next/link";

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; featured?: string }>;
}) {
  const { category, sort, featured } = await searchParams;
  const selectedCategory = category || "all";

  let filteredAuctions = selectedCategory === "all"
    ? auctions
    : auctions.filter((a) => a.category === selectedCategory);

  // Filter featured if requested
  if (featured === "true") {
    filteredAuctions = filteredAuctions.filter((a) => a.featured);
  }

  // Sort auctions
  if (sort === "ending") {
    filteredAuctions = [...filteredAuctions].sort(
      (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
    );
  } else if (sort === "price-high") {
    filteredAuctions = [...filteredAuctions].sort(
      (a, b) => b.currentBid - a.currentBid
    );
  } else if (sort === "price-low") {
    filteredAuctions = [...filteredAuctions].sort(
      (a, b) => a.currentBid - b.currentBid
    );
  } else if (sort === "bids") {
    filteredAuctions = [...filteredAuctions].sort(
      (a, b) => b.bidCount - a.bidCount
    );
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Auctions</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/auctions"
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/auctions?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 md:ml-auto">
            <span className="text-gray-400 text-sm">Sort:</span>
            <select
              defaultValue={sort || ""}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              onChange={(e) => {
                const params = new URLSearchParams();
                if (selectedCategory !== "all") params.set("category", selectedCategory);
                if (e.target.value) params.set("sort", e.target.value);
                if (featured) params.set("featured", featured);
                window.location.href = `/auctions${params.toString() ? `?${params}` : ""}`;
              }}
            >
              <option value="">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="bids">Most Bids</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {filteredAuctions.length} auction{filteredAuctions.length !== 1 && "s"}{" "}
          {selectedCategory !== "all" &&
            `in ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No auctions found in this category.</p>
            <Link
              href="/auctions"
              className="text-purple-500 hover:text-purple-400 mt-2 inline-block"
            >
              View all auctions
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
