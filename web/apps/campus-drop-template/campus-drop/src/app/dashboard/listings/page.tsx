import Link from "next/link";
import { mockUserListings } from "@/lib/dashboard-data";
import { conditionLabels } from "@/lib/data";

export default function ListingsPage() {
  const activeListings = mockUserListings.filter((l) => l.status === "active");
  const soldListings = mockUserListings.filter((l) => l.status === "sold");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          href="/dashboard/create"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          + Create Listing
        </Link>
      </div>

      {/* Active Listings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Active ({activeListings.length})</h2>
        </div>
        {activeListings.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No active listings. Create one to start selling!
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeListings.map((listing) => {
              const condition = conditionLabels[listing.condition];
              return (
                <div
                  key={listing.id}
                  className="p-4 flex items-center gap-4"
                >
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-1">{listing.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${condition.color}`}>
                        {condition.label}
                      </span>
                      <span className="text-xs text-gray-500">{listing.campus}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{listing.views} views</span>
                      <span>{listing.saves} saves</span>
                      <span>Listed {listing.createdAt}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold mb-2">${listing.price}</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-gray-700 text-sm rounded-lg hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sold Listings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Sold ({soldListings.length})</h2>
        </div>
        {soldListings.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No sold listings yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {soldListings.map((listing) => {
              const condition = conditionLabels[listing.condition];
              return (
                <div
                  key={listing.id}
                  className="p-4 flex items-center gap-4 opacity-75"
                >
                  <div className="relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                      <span className="text-xs font-bold text-white">SOLD</span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-1">{listing.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${condition.color}`}>
                        {condition.label}
                      </span>
                      <span className="text-xs text-gray-500">{listing.campus}</span>
                    </div>
                    <p className="text-sm text-gray-400">Sold on {listing.createdAt}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-green-500">${listing.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
