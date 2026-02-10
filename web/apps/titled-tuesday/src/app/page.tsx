import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-glow chess-grid max-w-6xl mx-auto px-6 py-32 md:py-40 text-center relative">
        <div className="relative z-10 animate-fade-up">
          <h1 className="font-display text-6xl md:text-8xl mb-6 tracking-tight">
            <span className="font-bold">Titled</span>{" "}
            <span className="italic bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Tuesday
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-xl mx-auto font-body leading-relaxed">
            The premier weekly blitz chess tournament for titled players. Automated entry fees, prize distribution, and payouts &mdash; all powered by Whop.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/tournaments"
              className="px-8 py-4 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold text-lg hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_16px_rgba(212,160,23,0.3)]"
            >
              Browse Events
            </Link>
            <Link
              href="/become-organizer"
              className="px-8 py-4 bg-transparent text-text-primary rounded-xl hover:bg-surface-overlay transition-all duration-200 font-semibold text-lg border border-border-default hover:border-border-strong"
            >
              Become an Organizer
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display italic text-3xl md:text-4xl text-center mb-16 text-text-primary">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {[
            {
              step: "1",
              title: "Find a Tournament",
              description: "Browse upcoming tournaments, check entry fees and prize structures, and pick your event.",
            },
            {
              step: "2",
              title: "Enter & Play",
              description: "Pay the entry fee through secure embedded checkout. All funds are held by the platform until results are in.",
            },
            {
              step: "3",
              title: "Get Paid",
              description: "After the tournament, request your payout. Once approved, withdraw directly to your bank.",
            },
          ].map((item) => (
            <div key={item.step} className="card p-8">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-text-inverse font-display text-lg mb-5">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-primary">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Organizers */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="card p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="font-display italic text-3xl md:text-4xl mb-4 text-text-primary">
              Organize Chess Events
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed text-lg">
              Create chess tournaments, set entry fees and prize structures, manage registrations, and record results.
              The platform handles all the money movement.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {["Create chess events", "Set prize structures", "Track registrations", "Record results", "Earn revenue"].map((feature) => (
                <span key={feature} className="px-3 py-1.5 bg-amber-900/50 rounded-full text-sm text-amber-300 border border-amber-700/30">
                  {feature}
                </span>
              ))}
            </div>
            <Link
              href="/become-organizer"
              className="inline-block px-6 py-3.5 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
