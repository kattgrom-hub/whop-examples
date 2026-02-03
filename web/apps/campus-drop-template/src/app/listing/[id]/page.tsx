import { notFound } from "next/navigation";
import Link from "next/link";
import { getListing, listings, conditionLabels } from "@/lib/data";
import { BuySection } from "./buy-section";

export function generateStaticParams() {
  return listings.map((listing) => ({
    id: listing.id,
  }));
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    notFound();
  }

  const condition = conditionLabels[listing.condition];

  return (
    <main className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/browse"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          &larr; Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-800">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-800 border-2 border-transparent hover:border-green-500 cursor-pointer transition-colors"
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${condition.color}`}>
                  {condition.label}
                </span>
                <span className="text-gray-400">{listing.campus}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-500">${listing.price}</span>
                {listing.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${listing.originalPrice}</span>
                )}
                {listing.originalPrice && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                    {Math.round((1 - listing.price / listing.originalPrice) * 100)}% off
                  </span>
                )}
              </div>
            </div>

            {/* Seller */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={listing.sellerAvatar}
                  alt={listing.sellerName}
                  className="w-14 h-14 rounded-full bg-gray-700"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{listing.sellerName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">star</span>
                    <span className="text-white">{listing.sellerRating}</span>
                    <span className="text-gray-500">seller rating</span>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Message
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">{listing.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Category</p>
                <p className="font-medium capitalize">{listing.category}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Condition</p>
                <p className="font-medium">{condition.label}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Campus</p>
                <p className="font-medium">{listing.campus}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Listed</p>
                <p className="font-medium">{listing.createdAt}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-400 text-sm mb-6">
              <span>{listing.views} views</span>
              <span>{listing.saves} saves</span>
            </div>

            {/* Buy Section - Client Component */}
            <BuySection listing={listing} />
          </div>
        </div>
      </div>
    </main>
  );
}
