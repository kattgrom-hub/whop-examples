import { GigCard } from "@/components/gig-card";
import { gigs, categories } from "@/lib/data";
import Link from "next/link";

export default async function GigsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category || "All";

  const filteredGigs =
    selectedCategory === "All"
      ? gigs
      : gigs.filter((g) => g.category === selectedCategory);

  const openGigs = filteredGigs.filter((g) => g.status === "open");

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
          <p className="text-gray-400">
            Find opportunities that match your skills and apply today
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/gigs"
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === "All"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/gigs?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-400 mb-6">
          {openGigs.length} open gig{openGigs.length !== 1 && "s"}{" "}
          {selectedCategory !== "All" && `in ${selectedCategory}`}
        </p>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>

        {openGigs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No open gigs found in this category.</p>
            <Link
              href="/gigs"
              className="text-purple-500 hover:text-purple-400 mt-2 inline-block"
            >
              View all gigs
            </Link>
          </div>
        )}

        {/* CTA for posting gigs */}
        <div className="mt-12 bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <h2 className="text-xl font-bold mb-2">Looking to hire?</h2>
          <p className="text-gray-400 mb-4">
            Post a gig and connect with talented creators ready to bring your
            vision to life.
          </p>
          <Link
            href="/dashboard/gigs"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Post a Gig
          </Link>
        </div>
      </div>
    </main>
  );
}
