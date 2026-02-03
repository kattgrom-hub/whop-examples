"use client";

import { useState } from "react";
import Link from "next/link";
import { mockUploads, categories } from "@/lib/data";
import { UploadCard } from "@/components/upload-card";

export default function UploadsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredUploads = mockUploads.filter((upload) => {
    if (filter !== "all" && upload.status !== filter) return false;
    if (categoryFilter !== "all" && upload.category !== categoryFilter) return false;
    return true;
  });

  const statusCounts = {
    all: mockUploads.length,
    approved: mockUploads.filter((u) => u.status === "approved").length,
    processing: mockUploads.filter((u) => u.status === "processing").length,
    rejected: mockUploads.filter((u) => u.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Uploads</h1>
        <Link
          href="/upload"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Status</p>
            <div className="flex gap-2">
              {(["all", "approved", "processing", "rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filter === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
          <div className="md:ml-auto">
            <p className="text-sm text-gray-400 mb-2">Category</p>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Uploads Grid */}
      {filteredUploads.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No uploads found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or upload new content.</p>
          <Link
            href="/upload"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Upload Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUploads.map((upload) => (
            <UploadCard key={upload.id} upload={upload} />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{mockUploads.length}</p>
            <p className="text-sm text-gray-400">Total Uploads</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">
              ${mockUploads.reduce((sum, u) => sum + u.earnings, 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Total Earnings</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {mockUploads.reduce((sum, u) => sum + u.licenses, 0)}
            </p>
            <p className="text-sm text-gray-400">Total Licenses</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              ${(mockUploads.reduce((sum, u) => sum + u.earnings, 0) / mockUploads.filter((u) => u.status === "approved").length || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Avg per Upload</p>
          </div>
        </div>
      </div>
    </div>
  );
}
