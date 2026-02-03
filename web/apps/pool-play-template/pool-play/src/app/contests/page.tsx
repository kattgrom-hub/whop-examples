import { ContestCard } from "@/components/contest-card";
import { contests, sports, contestTypes } from "@/lib/data";
import Link from "next/link";

export default async function ContestsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const selectedSport = params.sport || "All";
  const selectedType = params.type || "all";
  const selectedStatus = params.status || "all";

  let filteredContests = [...contests];

  if (selectedSport !== "All") {
    filteredContests = filteredContests.filter((c) => c.sport === selectedSport);
  }
  if (selectedType !== "all") {
    filteredContests = filteredContests.filter((c) => c.type === selectedType);
  }
  if (selectedStatus !== "all") {
    filteredContests = filteredContests.filter((c) => c.status === selectedStatus);
  }

  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    if (params.sport && params.sport !== "All") searchParams.set("sport", params.sport);
    if (params.type && params.type !== "all") searchParams.set("type", params.type);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);
    const query = searchParams.toString();
    return `/contests${query ? `?${query}` : ""}`;
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Contests</h1>

        {/* Sport Filter */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Sport</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({ sport: "All", type: selectedType, status: selectedStatus })}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedSport === "All"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </Link>
            {sports.map((sport) => (
              <Link
                key={sport}
                href={buildUrl({ sport, type: selectedType, status: selectedStatus })}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSport === sport
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {sport}
              </Link>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Contest Type</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({ sport: selectedSport, type: "all", status: selectedStatus })}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedType === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Types
            </Link>
            {contestTypes.map((type) => (
              <Link
                key={type.value}
                href={buildUrl({ sport: selectedSport, type: type.value, status: selectedStatus })}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedType === type.value
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {type.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {["all", "open", "live", "completed"].map((status) => (
              <Link
                key={status}
                href={buildUrl({ sport: selectedSport, type: selectedType, status })}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedStatus === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {filteredContests.length} contest{filteredContests.length !== 1 && "s"} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>

        {filteredContests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No contests found matching your filters.</p>
            <Link
              href="/contests"
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
