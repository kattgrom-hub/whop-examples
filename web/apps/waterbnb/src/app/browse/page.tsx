import Link from "next/link";
import { BoatCard } from "@/components/boat-card";

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
      console.error("Failed to fetch boats:", response.status);
      return [];
    }

    const data = await response.json();
    return data.boats || [];
  } catch (error) {
    console.error("Error fetching boats:", error);
    return [];
  }
}

export default async function BrowsePage() {
  const boats = await getBoats();

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Boats</h1>
        <p className="text-gray-400 mb-8">
          Browse boats from local hosts and pick a date
        </p>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {boats.length} boat{boats.length !== 1 && "s"} available
        </p>

        {boats.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
            <p className="text-gray-400 mb-2">No boats available yet.</p>
            <p className="text-gray-500 text-sm">
              Be the first to list a boat!{" "}
              <Link href="/dashboard/listings" className="text-[#0077B6] hover:underline">
                Create one →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boats.map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
