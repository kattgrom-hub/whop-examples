import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  boatType: string;
  pricePerTrip: number;
  capacity: number;
  hostName?: string;
  availableDates: string[];
}

export function ListingCard({
  title,
  location,
  boatType,
  pricePerTrip,
  capacity,
  hostName,
  availableDates,
}: ListingCardProps) {
  const nextDate = availableDates[0];
  const formattedDate = nextDate
    ? new Date(nextDate + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link href="/browse" className="group block">
      {/* Image placeholder */}
      <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F7F7] border border-[#DDDDDD] mb-3 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#DDDDDD]"
          >
            <path d="M12 2L12 20" />
            <path d="M12 5L4 18H20L12 5Z" />
            <path d="M3 21H21" />
          </svg>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#222222] text-xs font-medium rounded-full border border-[#DDDDDD]">
            {boatType}
          </span>
        </div>
        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 p-1.5"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-md"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#222222] text-[15px] leading-tight truncate">
            {location}
          </h3>
        </div>
        <p className="text-[#717171] text-sm mt-0.5">{title}</p>
        {hostName && (
          <p className="text-[#717171] text-sm">Hosted by {hostName}</p>
        )}
        <p className="text-[#717171] text-sm">
          {formattedDate ? `${formattedDate} · ` : ""}Up to {capacity} guests
        </p>
        <p className="mt-1.5">
          <span className="font-semibold text-[#222222]">
            {pricePerTrip === 0 ? "Free" : `$${pricePerTrip}`}
          </span>
          <span className="text-[#717171]"> trip</span>
        </p>
      </div>
    </Link>
  );
}
