import { CoachCard } from "@/components/coach-card";
import { coaches, categories } from "@/lib/data";
import Link from "next/link";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category || "All";

  const filteredCoaches =
    selectedCategory === "All"
      ? coaches
      : coaches.filter((c) => c.category === selectedCategory);

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Coaches</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/browse"
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${cat}`}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {filteredCoaches.length} coach{filteredCoaches.length !== 1 && "es"}{" "}
          {selectedCategory !== "All" && `in ${selectedCategory}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>

        {filteredCoaches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No coaches found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
