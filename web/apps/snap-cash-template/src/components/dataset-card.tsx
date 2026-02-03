import Link from "next/link";
import type { Dataset } from "@/lib/data";

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const minPrice = Math.min(...dataset.licenseTiers.map((t) => t.price));

  return (
    <Link
      href={`/dataset/${dataset.id}`}
      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors block group"
    >
      <div className="grid grid-cols-2 gap-1 p-1">
        {dataset.sampleImages.slice(0, 4).map((img, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded">
            <img
              src={img}
              alt={`${dataset.name} sample ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
            {dataset.category}
          </span>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
            {dataset.quality}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-green-400 transition-colors">
          {dataset.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {dataset.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            {dataset.totalItems.toLocaleString()} items
          </span>
          <span className="text-green-500 font-semibold">
            From ${minPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
