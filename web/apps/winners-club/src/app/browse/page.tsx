import Link from "next/link";
import { ClassCard } from "@/components/class-card";

export const dynamic = "force-dynamic";

interface ClassItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
}

async function getPickPackages(): Promise<ClassItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5004";

  try {
    const response = await fetch(`${baseUrl}/api/classes`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch pick packages:", response.status);
      return [];
    }

    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error("Error fetching pick packages:", error);
    return [];
  }
}

export default async function BrowsePage() {
  const packages = await getPickPackages();

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Pick Packages</h1>
        <p className="text-gray-400 mb-8">
          Subscribe to a tipster and get winning picks
        </p>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {packages.length} package{packages.length !== 1 && "s"} available
        </p>

        {packages.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
            <p className="text-gray-400 mb-2">No pick packages available yet.</p>
            <p className="text-gray-500 text-sm">
              Be the first to sell picks!{" "}
              <Link href="/dashboard/sessions" className="text-[#F59E0B] hover:underline">
                Create one →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <ClassCard key={pkg.id} session={pkg} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
