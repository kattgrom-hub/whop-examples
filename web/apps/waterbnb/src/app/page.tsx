import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilters } from "@/components/category-filters";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

interface BoatItem {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  boatType: string;
  pricePerTrip: number;
  availableDates: string[];
  hostId: string;
  hostName: string;
  hostAvatar: string;
}

async function getBoats(): Promise<BoatItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

  try {
    const response = await fetch(`${baseUrl}/api/boats`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.boats || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const boats = await getBoats();

  return (
    <main>
      {/* Search Section */}
      <section className="pt-8 pb-6 px-6">
        <SearchBar />
      </section>

      {/* Category Filters */}
      <section className="px-6 border-b border-[#DDDDDD]">
        <div className="max-w-7xl mx-auto">
          <CategoryFilters />
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {boats.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-[#222222] mb-3">
                No boats available yet
              </h2>
              <p className="text-[#717171] mb-6">
                Be the first to list your boat on Waterbnb
              </p>
              <Link
                href="/become-a-host"
                className="inline-flex px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
              >
                Become a Host
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {boats.map((boat) => (
                <ListingCard
                  key={boat.id}
                  id={boat.id}
                  title={boat.title}
                  location={boat.location}
                  boatType={boat.boatType}
                  pricePerTrip={boat.pricePerTrip}
                  capacity={boat.capacity}
                  hostName={boat.hostName}
                  availableDates={boat.availableDates}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DDDDDD] bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-[#222222] mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-[#717171]">
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Help Center</Link></li>
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Safety information</Link></li>
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Cancellation options</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#222222] mb-4">Hosting</h4>
              <ul className="space-y-3 text-sm text-[#717171]">
                <li><Link href="/become-a-host" className="hover:underline hover:text-[#222222]">Waterbnb your boat</Link></li>
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Hosting resources</Link></li>
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Community forum</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#222222] mb-4">Waterbnb</h4>
              <ul className="space-y-3 text-sm text-[#717171]">
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Newsroom</Link></li>
                <li><Link href="/browse" className="hover:underline hover:text-[#222222]">Learn about new features</Link></li>
                <li>
                  <a href="https://whop.com" className="hover:underline hover:text-[#222222]" target="_blank" rel="noopener noreferrer">
                    Powered by Whop
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#DDDDDD] text-sm text-[#717171] text-center">
            &copy; {new Date().getFullYear()} Waterbnb, Inc. &middot; Powered by{" "}
            <a href="https://whop.com" className="text-[#FF385C] hover:underline" target="_blank" rel="noopener noreferrer">
              Whop
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
