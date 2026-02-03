import { TalentCard } from "@/components/talent-card";
import { talents, categories } from "@/lib/data";
import Link from "next/link";

export default async function TalentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category || "All";

  const filteredTalent =
    selectedCategory === "All"
      ? talents
      : talents.filter((t) => t.category === selectedCategory);

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Talent</h1>
          <p className="text-gray-400">
            Discover skilled creators and workers for your next project
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/talent"
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
              href={`/talent?category=${encodeURIComponent(cat)}`}
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
          {filteredTalent.length} talent{filteredTalent.length !== 1 && "s"}{" "}
          {selectedCategory !== "All" && `in ${selectedCategory}`}
        </p>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalent.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {filteredTalent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No talent found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
