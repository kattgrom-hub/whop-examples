import Link from "next/link";
import { CoachCard } from "@/components/coach-card";
import { coaches, categories } from "@/lib/data";

export default function Home() {
  const featuredCoaches = coaches.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Learn from the best,{" "}
            <span className="text-blue-500">live</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Book 1:1 sessions with verified experts in gaming, music, fitness,
            business, and more. Level up your skills with personalized coaching.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/browse"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Find a Coach
            </Link>
            <Link
              href="/become-a-coach"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              Become a Coach
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/browse?category=${category}`}
                className="px-5 py-2.5 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Coaches</h2>
            <Link
              href="/browse"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Find your coach</h3>
              <p className="text-gray-400">
                Browse verified experts by category, price, and reviews.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Book a session</h3>
              <p className="text-gray-400">
                Pick a time that works and pay securely through the platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Level up</h3>
              <p className="text-gray-400">
                Join your live session and get personalized guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500">
        <p>
          Powered by{" "}
          <a
            href="https://whop.com"
            className="text-blue-500 hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whop
          </a>
        </p>
      </footer>
    </main>
  );
}
