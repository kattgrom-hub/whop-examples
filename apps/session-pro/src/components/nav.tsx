import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Session<span className="text-blue-500">Pro</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/browse"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Browse Coaches
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Coach Dashboard
          </Link>
          <Link
            href="#"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Become a Coach
          </Link>
        </div>
      </div>
    </nav>
  );
}
