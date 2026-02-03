import Link from "next/link";
import type { Listing } from "@/lib/data";
import { conditionLabels } from "@/lib/data";

export function ListingCard({ listing }: { listing: Listing }) {
  const condition = conditionLabels[listing.condition];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold">
              SOLD
            </span>
          </div>
        )}
        {listing.originalPrice && listing.status !== "sold" && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs rounded font-medium">
            {Math.round((1 - listing.price / listing.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white line-clamp-2 text-sm flex-1">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${condition.color}`}>
            {condition.label}
          </span>
          <span className="text-xs text-gray-500">{listing.campus}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">${listing.price}</span>
            {listing.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${listing.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
          <img
            src={listing.sellerAvatar}
            alt={listing.sellerName}
            className="w-6 h-6 rounded-full bg-gray-700"
          />
          <span className="text-xs text-gray-400">{listing.sellerName}</span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-yellow-500 text-xs">star</span>
            <span className="text-xs text-gray-400">{listing.sellerRating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
