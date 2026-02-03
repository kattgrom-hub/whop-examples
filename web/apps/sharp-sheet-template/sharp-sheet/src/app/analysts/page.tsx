import { AnalystCard } from "@/components/analyst-card";
import { analysts, sports, getAnalystsBySport } from "@/lib/data";
import Link from "next/link";

export default async function AnalystsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport } = await searchParams;
  const selectedSport = sport || "All";

  const filteredAnalysts =
    selectedSport === "All"
      ? analysts
      : getAnalystsBySport(selectedSport);

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Analysts</h1>

        {/* Sport Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/analysts"
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedSport === "All"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </Link>
          {sports.map((s) => (
            <Link
              key={s.id}
              href={`/analysts?sport=${s.name}`}
              className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                selectedSport === s.name
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.name}</span>
            </Link>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {filteredAnalysts.length} analyst{filteredAnalysts.length !== 1 && "s"}{" "}
            {selectedSport !== "All" && `in ${selectedSport}`}
          </p>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-green-500">
            <option>Sort by: Win Rate</option>
            <option>Sort by: ROI</option>
            <option>Sort by: Subscribers</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalysts.map((analyst) => (
            <AnalystCard key={analyst.id} analyst={analyst} />
          ))}
        </div>

        {filteredAnalysts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No analysts found for this sport.</p>
          </div>
        )}
      </div>
    </main>
  );
}
