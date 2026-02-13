import Link from "next/link";
import { HeroCTAs } from "@/components/hero-ctas";

const CATEGORIES = ["Sailboat", "Yacht", "Pontoon", "Speedboat", "Fishing Boat", "Kayak"];

export default function Home() {
  return (
    <main>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Rent boats from local hosts, <span className="text-ocean-gradient">live</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse available boats from verified hosts. Pick a date and get on the water.
          </p>
          <HeroCTAs />
        </div>
      </section>

      <section className="py-14 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href="/browse" className="px-5 py-2.5 bg-[#1A1A1A] rounded-full text-gray-300 hover:bg-[#0077B6]/10 hover:text-[#0077B6] border border-[#2A2A2A] hover:border-[#0077B6]/30 transition-all">
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
              { n: "1", title: "Find a boat", desc: "Browse available boats from local hosts" },
              { n: "2", title: "Pick a date & reserve", desc: "Select an available date and pay securely" },
              { n: "3", title: "Get on the water", desc: "Chat with your host and enjoy the trip" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 bg-[#0077B6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">{step.n}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#2A2A2A] text-center text-gray-500">
        Powered by <a href="https://whop.com" className="text-[#0077B6] hover:text-[#023E8A]" target="_blank" rel="noopener noreferrer">Whop</a>
      </footer>
    </main>
  );
}
