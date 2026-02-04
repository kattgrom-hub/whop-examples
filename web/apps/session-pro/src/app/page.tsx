import Link from "next/link";
import { HeroCTAs } from "@/components/hero-ctas";

const CATEGORIES = ["Code Review", "Music", "Fitness", "Business", "Design", "Programming"];

export default function Home() {
  return (
    <main>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Learn from the best, <span className="text-blue-500">live</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Book 1:1 sessions with verified experts. Level up your skills with personalized coaching.
          </p>
          <HeroCTAs />
        </div>
      </section>

      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href="/browse" className="px-5 py-2.5 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Find a session", desc: "Browse available sessions by coaches" },
              { n: "2", title: "Book & pay", desc: "Pick a time and pay securely" },
              { n: "3", title: "Level up", desc: "Join your live session" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{step.n}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500">
        Powered by <a href="https://whop.com" className="text-blue-500 hover:text-blue-400" target="_blank" rel="noopener noreferrer">Whop</a>
      </footer>
    </main>
  );
}
