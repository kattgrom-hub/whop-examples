"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDataset } from "@/lib/data";
import { notFound } from "next/navigation";

export default function DatasetDetailPage() {
  const params = useParams();
  const dataset = getDataset(params.id as string);
  const [selectedTier, setSelectedTier] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!dataset) {
    notFound();
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/datasets" className="text-gray-400 hover:text-white transition-colors">
            Datasets
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-white">{dataset.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sample Images */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-8">
              <div className="grid grid-cols-2 gap-1 p-1">
                {dataset.sampleImages.map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`${dataset.name} sample ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 text-center border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Showing 4 sample images from {dataset.totalItems.toLocaleString()} total items
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">About This Dataset</h2>
              <p className="text-gray-400 mb-6">{dataset.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{dataset.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="font-medium">{dataset.totalItems.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quality</p>
                  <p className="font-medium">{dataset.quality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price/Item</p>
                  <p className="font-medium">${dataset.pricePerItem}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* License Terms */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4">License Terms</h2>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Commercial Use</p>
                    <p className="text-sm">Licensed for commercial AI training purposes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Model Training</p>
                    <p className="text-sm">Train unlimited models with purchased data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Perpetual License</p>
                    <p className="text-sm">One-time purchase, no recurring fees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">No Redistribution</p>
                    <p className="text-sm">Data cannot be resold or shared externally</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-2">{dataset.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">{dataset.category}</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                  {dataset.quality}
                </span>
              </div>

              {/* Tier Selection */}
              <div className="space-y-3 mb-6">
                {dataset.licenseTiers.map((tier, index) => (
                  <button
                    key={tier.name}
                    onClick={() => setSelectedTier(index)}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      selectedTier === index
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{tier.name}</span>
                      <span className="text-green-500 font-bold">${tier.price}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {tier.items.toLocaleString()} items
                    </p>
                  </button>
                ))}
              </div>

              {/* Purchase Button */}
              {showCheckout ? (
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-semibold mb-2">Secure checkout</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Secure payment processing would appear here
                  </p>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  Purchase License - ${dataset.licenseTiers[selectedTier].price}
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                Instant access after purchase. Invoice provided.
              </p>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm font-medium mb-3">Includes:</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {dataset.licenseTiers[selectedTier].items.toLocaleString()} high-quality items
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Commercial license
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Metadata included
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download via secure link
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
