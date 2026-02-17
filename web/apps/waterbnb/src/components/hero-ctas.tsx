import Link from "next/link";

export function HeroCTAs() {
  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/browse"
        className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
      >
        Find a Boat
      </Link>
    </div>
  );
}
