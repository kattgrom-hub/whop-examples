import Link from "next/link";
import { mockListings, getActiveListings, getDraftListings, getSoldListings } from "@/lib/seller-data";
import { formatCurrency, getTimeRemaining } from "@/lib/data";

function TimeDisplay({ endTime }: { endTime: string }) {
  const time = getTimeRemaining(endTime);

  if (time.isEnded) return <span className="text-gray-500">Ended</span>;

  if (time.days > 0) return <span>{time.days}d {time.hours}h left</span>;
  if (time.hours > 0) return <span className="text-amber-400">{time.hours}h {time.minutes}m left</span>;
  return <span className="text-red-400">{time.minutes}m left</span>;
}

export default function ListingsPage() {
  const activeListings = getActiveListings();
  const draftListings = getDraftListings();
  const soldListings = getSoldListings();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          href="/dashboard/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Create Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Active Listings</p>
          <p className="text-3xl font-bold text-green-500">{activeListings.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Drafts</p>
          <p className="text-3xl font-bold">{draftListings.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Sold Items</p>
          <p className="text-3xl font-bold text-amber-500">{soldListings.length}</p>
        </div>
      </div>

      {/* Active Listings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Listings</h2>
        {activeListings.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            <p>No active listings</p>
            <Link href="/dashboard/create" className="text-purple-500 hover:text-purple-400 mt-2 inline-block">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg bg-gray-700 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {listing.category} | <TimeDisplay endTime={listing.endTime} />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Current Bid</p>
                      <p className="text-xl font-bold text-amber-500">
                        {formatCurrency(listing.currentBid || listing.startingBid)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Bids</p>
                      <p className="text-xl font-bold">{listing.bidCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Watchers</p>
                      <p className="text-xl font-bold">{listing.watchers}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                        Edit
                      </button>
                      <Link
                        href={`/auction/${listing.id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drafts */}
      {draftListings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Drafts</h2>
          <div className="space-y-4">
            {draftListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-800 rounded-xl border border-gray-700 border-dashed p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg bg-gray-700 object-cover opacity-50"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-300">{listing.title}</h3>
                      <p className="text-gray-500 text-sm">{listing.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Starting Bid</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(listing.startingBid)}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Edit & Publish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sold Items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sold Items</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Item</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Category</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Final Price</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Total Bids</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {soldListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-10 h-10 rounded-lg bg-gray-700 object-cover"
                      />
                      <span className="line-clamp-1">{listing.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{listing.category}</td>
                  <td className="px-6 py-4 text-amber-500 font-semibold">
                    {formatCurrency(listing.currentBid)}
                  </td>
                  <td className="px-6 py-4">{listing.bidCount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      Sold
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
