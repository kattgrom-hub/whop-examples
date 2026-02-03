import { CategoryCard } from "@/components/category-card";
import { categories } from "@/lib/data";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Data Categories</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse the categories of data that AI companies are actively seeking.
            Higher demand categories typically offer better earnings per item.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Tips for Higher Earnings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-green-500 mb-3">Quality Matters</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  High resolution images (1080p+) earn premium rates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  Good lighting and clear subjects are essential
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  Avoid blurry or heavily filtered content
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-500 mb-3">Diversity Wins</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  Unique angles and perspectives are valued
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  Upload across multiple categories
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">-</span>
                  Natural, unposed content performs well
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Start Uploading
          </Link>
        </div>
      </div>
    </main>
  );
}
