import Link from "next/link";
import { HeroCTAs } from "@/components/hero-ctas";

const CATEGORIES = ["Code Review", "Music", "Fitness", "Business", "Design", "Programming"];

export default function Home() {
  return (
    <main>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Learn from the best, <span className="text-red-gradient">live</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book 1:1 classes with verified experts. Level up your skills with personalized teaching.
          </p>
          <HeroCTAs />
        </div>
      </section>

      <section className="py-14 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href="/browse" className="px-5 py-2.5 bg-[#1A1A1A] rounded-full text-gray-300 hover:bg-[#E53935]/10 hover:text-[#E53935] border border-[#2A2A2A] hover:border-[#E53935]/30 transition-all">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Find a class", desc: "Browse available classes by instructors" },
              { n: "2", title: "Book & pay", desc: "Pick a time and pay securely" },
              { n: "3", title: "Level up", desc: "Join your live class" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 bg-[#E53935] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">{step.n}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#2A2A2A] text-center text-gray-500">
        Powered by <a href="https://whop.com" className="text-[#E53935] hover:text-[#C62828]" target="_blank" rel="noopener noreferrer">Whop</a>
      </footer>
    </main>
  );
}
