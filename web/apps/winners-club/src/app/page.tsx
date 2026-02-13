import Link from "next/link";
import { HeroCTAs } from "@/components/hero-ctas";

const SPORTS = ["NFL", "NBA", "MLB", "NHL", "Soccer", "MMA", "Tennis", "Golf"];

export default function Home() {
  return (
    <main>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Follow the sharpest, <span className="text-gold-gradient">win big</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscribe to top sports tipsters. Track records automatically. Get winning picks delivered straight to you.
          </p>
          <HeroCTAs />
        </div>
      </section>

      <section className="py-14 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Browse by Sport</h2>
          <div className="flex flex-wrap gap-3">
            {SPORTS.map((sport) => (
              <Link key={sport} href="/browse" className="px-5 py-2.5 bg-[#1A1A1A] rounded-full text-gray-300 hover:bg-[#F59E0B]/10 hover:text-[#F59E0B] border border-[#2A2A2A] hover:border-[#F59E0B]/30 transition-all">
                {sport}
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
              { n: "1", title: "Find a tipster", desc: "Browse top-ranked sports bettors by sport" },
              { n: "2", title: "Subscribe & pay", desc: "Pick a tipster and subscribe securely" },
              { n: "3", title: "Get picks", desc: "Receive winning picks and track results" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-[#0A0A0A]">{step.n}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Oswald', Impact, sans-serif", textTransform: "uppercase" }}>{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#2A2A2A] text-center text-gray-500">
        Powered by <a href="https://whop.com" className="text-[#F59E0B] hover:text-[#D97706]" target="_blank" rel="noopener noreferrer">Whop</a>
      </footer>
    </main>
  );
}
