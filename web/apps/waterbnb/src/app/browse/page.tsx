import { BrowseGrid } from "@/components/browse-grid";

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
    <main className="pb-8">
      <BrowseGrid boats={boats} />
    </main>
  );
}
