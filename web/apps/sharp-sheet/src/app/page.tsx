import Link from "next/link";
import { AnalystCard } from "@/components/analyst-card";
import { PickCard } from "@/components/pick-card";
import { analysts, sports, getRecentPicks } from "@/lib/data";

export default function Home() {
  const featuredAnalysts = analysts.slice(0, 3);
  const recentPicks = getRecentPicks(4);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Win with the <span className="text-green-500">sharps</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Follow verified sports analysts with proven track records. Get their
            picks in real-time and start winning.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/analysts"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Browse Analysts
            </Link>
            <Link
              href="/auth/login?role=analyst"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              Become an Analyst
            </Link>
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Sport</h2>
          <div className="flex flex-wrap gap-3">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                href={`/analysts?sport=${sport.name}`}
                className="px-5 py-2.5 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>{sport.emoji}</span>
                <span>{sport.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Analysts */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Analysts</h2>
            <Link
              href="/analysts"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAnalysts.map((analyst) => (
              <AnalystCard key={analyst.id} analyst={analyst} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Picks */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Picks</h2>
            <Link
              href="/feed"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPicks.map((pick) => (
              <PickCard key={pick.id} pick={pick} />
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
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Find your analyst</h3>
              <p className="text-gray-400">
                Browse verified analysts by sport, record, and ROI.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Subscribe</h3>
              <p className="text-gray-400">
                Get instant access to their picks, analysis, and insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Start winning</h3>
              <p className="text-gray-400">
                Follow their plays and track your results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-500">500+</p>
            <p className="text-gray-400 mt-1">Verified Analysts</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-500">58%</p>
            <p className="text-gray-400 mt-1">Avg Win Rate</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-500">50K+</p>
            <p className="text-gray-400 mt-1">Active Subscribers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-500">$2M+</p>
            <p className="text-gray-400 mt-1">Paid to Analysts</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500">
        <p>
          Powered by{" "}
          <a
            href="#"
            className="text-green-500 hover:text-green-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Platform
          </a>
        </p>
      </footer>
    </main>
  );
}
