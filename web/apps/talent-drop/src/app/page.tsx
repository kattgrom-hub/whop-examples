import Link from "next/link";
import { TalentCard } from "@/components/talent-card";
import { GigCard } from "@/components/gig-card";
import { talents, gigs, categories } from "@/lib/data";

export default function Home() {
  const featuredTalent = talents.filter((t) => t.isPremium).slice(0, 3);
  const latestGigs = gigs.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Connect. Create.{" "}
            <span className="text-purple-500">Get Paid.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The talent marketplace connecting businesses with top creators and
            workers. Post gigs, hire talent, and automate payouts when work is
            completed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/talent"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Find Talent
            </Link>
            <Link
              href="/gigs"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              Browse Gigs
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
                href={`/talent?category=${encodeURIComponent(category)}`}
                className="px-5 py-2.5 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talent */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Talent</h2>
              <p className="text-gray-400 mt-1">
                Premium creators ready to bring your vision to life
              </p>
            </div>
            <Link
              href="/talent"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTalent.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Gigs */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Latest Gigs</h2>
              <p className="text-gray-400 mt-1">
                Fresh opportunities from verified clients
              </p>
            </div>
            <Link
              href="/gigs"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">How it works</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Whether you&apos;re hiring or looking for work, TalentDrop makes it
            simple.
          </p>

          {/* For Clients */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-purple-400 mb-6 text-center">
              For Clients
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h4 className="font-semibold text-lg mb-2">Post a gig</h4>
                <p className="text-gray-400">
                  Describe your project, set your budget, and specify the skills
                  you need.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h4 className="font-semibold text-lg mb-2">Review talent</h4>
                <p className="text-gray-400">
                  Browse applications, view portfolios, and chat with
                  candidates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h4 className="font-semibold text-lg mb-2">Hire & pay</h4>
                <p className="text-gray-400">
                  Hire your choice and pay securely. Funds release when
                  work&apos;s done.
                </p>
              </div>
            </div>
          </div>

          {/* For Talent */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-6 text-center">
              For Talent
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h4 className="font-semibold text-lg mb-2">
                  Create your profile
                </h4>
                <p className="text-gray-400">
                  Showcase your skills, portfolio, and set your rates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h4 className="font-semibold text-lg mb-2">Apply to gigs</h4>
                <p className="text-gray-400">
                  Browse opportunities and submit proposals to jobs that match
                  your skills.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h4 className="font-semibold text-lg mb-2">Get paid</h4>
                <p className="text-gray-400">
                  Complete the work and get paid instantly via Payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-6 border-t border-gray-800 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Secure platform
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Built for seamless payments,
            communication, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl mb-3">💳</div>
              <h4 className="font-semibold mb-1">Embedded Checkout</h4>
              <p className="text-sm text-gray-400">Secure gig payments</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl mb-3">💸</div>
              <h4 className="font-semibold mb-1">Embedded Payouts</h4>
              <p className="text-sm text-gray-400">Instant talent payouts</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold mb-1">Chat</h4>
              <p className="text-sm text-gray-400">Real-time messaging</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-semibold mb-1">Notifications</h4>
              <p className="text-sm text-gray-400">Gig updates & alerts</p>
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
            className="text-purple-500 hover:text-purple-400"
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
