import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-73px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#222222] tracking-tight">
            Find your next
            <span className="text-[#FF385C]"> adventure</span>
            <br />
            on the water.
          </h1>
          <p className="mt-6 text-lg text-[#717171] max-w-lg mx-auto">
            Browse boats from local hosts — sailboats, yachts, kayaks, and more.
            Book a trip in just a few clicks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/browse"
              className="px-8 py-3.5 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold text-lg"
            >
              Browse Boats
            </Link>
            <Link
              href="/dashboard/listings"
              className="px-8 py-3.5 border border-[#222222] text-[#222222] rounded-lg hover:bg-[#F7F7F7] transition-colors font-semibold text-lg"
            >
              List Your Boat
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DDDDDD] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[#717171]">
          <span>&copy; {new Date().getFullYear()} Waterbnb</span>
          <a
            href="https://whop.com"
            className="text-[#FF385C] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Whop
          </a>
        </div>
      </footer>
    </main>
  );
}
