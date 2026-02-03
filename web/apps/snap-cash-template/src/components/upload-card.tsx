"use client";

import type { Upload } from "@/lib/data";

interface UploadCardProps {
  upload: Upload;
  onSelect?: (upload: Upload) => void;
}

export function UploadCard({ upload, onSelect }: UploadCardProps) {
  const statusColors = {
    processing: "bg-yellow-500/20 text-yellow-500",
    approved: "bg-green-500/20 text-green-500",
    rejected: "bg-red-500/20 text-red-500",
  };

  const qualityColors = {
    standard: "bg-gray-500/20 text-gray-400",
    high: "bg-blue-500/20 text-blue-400",
    premium: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div
      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer group"
      onClick={() => onSelect?.(upload)}
    >
      <div className="relative aspect-square">
        <img
          src={upload.thumbnail}
          alt={upload.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {upload.type === "video" && (
          <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Video
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${qualityColors[upload.quality]}`}
          >
            {upload.quality}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{upload.category}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${statusColors[upload.status]}`}
          >
            {upload.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          {upload.status === "approved" ? (
            <>
              <span className="text-green-500 font-semibold">
                +${upload.earnings.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">
                {upload.licenses} licenses
              </span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">
              {upload.status === "processing" ? "Under review..." : "Not accepted"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
