import Link from "next/link";
import { ContestCard } from "@/components/contest-card";
import { contests, sports } from "@/lib/data";

export default function Home() {
  const featuredContests = contests.filter((c) => c.status === "open").slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Play. Compete.{" "}
            <span className="text-green-500">Win.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join daily fantasy, survivor pools, and pick&apos;em contests with real entry fees and massive prize pools. Compete against others and win big.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contests"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Browse Contests
            </Link>
            <Link
              href="/auth/login?role=creator"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              Create a Contest
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Sport</h2>
          <div className="flex flex-wrap gap-3">
            {sports.map((sport) => (
              <Link
                key={sport}
                href={`/contests?sport=${sport}`}
                className="px-5 py-2.5 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {sport}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Contests */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Contests</h2>
            <Link
              href="/contests"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Find a Contest</h3>
              <p className="text-gray-400">
                Browse daily fantasy, survivor, or pick&apos;em contests across all major sports.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Pay Entry Fee</h3>
              <p className="text-gray-400">
                Secure checkout secure. Entry fees go directly to the prize pool.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Make Your Picks</h3>
              <p className="text-gray-400">
                Select your lineup, make your predictions, or choose your survivors.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Win Big</h3>
              <p className="text-gray-400">
                Compete for prizes. Winnings paid out instantly via Payouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-500">$2.5M+</p>
              <p className="text-gray-400 mt-1">Prize Pools</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">50K+</p>
              <p className="text-gray-400 mt-1">Players</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">1,200+</p>
              <p className="text-gray-400 mt-1">Contests Run</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">$1.8M+</p>
              <p className="text-gray-400 mt-1">Paid Out</p>
            </div>
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
