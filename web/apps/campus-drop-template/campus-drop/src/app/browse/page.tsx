import { ListingCard } from "@/components/listing-card";
import { listings, categories, campuses, conditionLabels } from "@/lib/data";
import Link from "next/link";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; campus?: string; condition?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  const selectedCampus = params.campus || "all";
  const selectedCondition = params.condition || "all";
  const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;

  let filteredListings = listings.filter((l) => l.status === "active");

  if (selectedCategory !== "all") {
    filteredListings = filteredListings.filter((l) => l.category === selectedCategory);
  }

  if (selectedCampus !== "all") {
    filteredListings = filteredListings.filter((l) => l.campus === selectedCampus);
  }

  if (selectedCondition !== "all") {
    filteredListings = filteredListings.filter((l) => l.condition === selectedCondition);
  }

  if (minPrice !== undefined) {
    filteredListings = filteredListings.filter((l) => l.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filteredListings = filteredListings.filter((l) => l.price <= maxPrice);
  }

  const buildFilterUrl = (key: string, value: string) => {
    const newParams = new URLSearchParams();
    if (selectedCategory !== "all" && key !== "category") newParams.set("category", selectedCategory);
    if (selectedCampus !== "all" && key !== "campus") newParams.set("campus", selectedCampus);
    if (selectedCondition !== "all" && key !== "condition") newParams.set("condition", selectedCondition);
    if (value !== "all") newParams.set(key, value);
    return `/browse${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Listings</h1>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl("category", "all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildFilterUrl("category", cat.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Campus Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Campus</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl("campus", "all")}
              className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                selectedCampus === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Campuses
            </Link>
            {campuses.map((campus) => (
              <Link
                key={campus}
                href={buildFilterUrl("campus", campus)}
                className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                  selectedCampus === campus
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {campus}
              </Link>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Condition</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl("condition", "all")}
              className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                selectedCondition === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Any Condition
            </Link>
            {Object.entries(conditionLabels).map(([key, value]) => (
              <Link
                key={key}
                href={buildFilterUrl("condition", key)}
                className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                  selectedCondition === key
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {value.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {filteredListings.length} listing{filteredListings.length !== 1 && "s"}
          {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          {selectedCampus !== "all" && ` at ${selectedCampus}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No listings found with these filters.</p>
            <Link
              href="/browse"
              className="text-green-500 hover:text-green-400 mt-2 inline-block"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
