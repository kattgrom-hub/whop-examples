"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const BOAT_TYPES = ["Sailboat", "Yacht", "Pontoon", "Speedboat", "Fishing Boat", "Kayak"];

const RANDOM_LISTINGS = [
  // Yachts
  { title: "Sunset Cruiser", description: "Relaxing evening cruises along the coast with stunning sunset views.", location: "Marina Del Rey, CA", boatType: "Yacht", capacity: 8, pricePerTrip: 250 },
  { title: "Island Hopper", description: "Visit hidden coves and secluded beaches aboard a spacious yacht.", location: "San Juan Islands, WA", boatType: "Yacht", capacity: 12, pricePerTrip: 450 },
  { title: "The Odyssey", description: "Full-day luxury yacht charter with catered lunch and open bar.", location: "Cabo San Lucas, MX", boatType: "Yacht", capacity: 10, pricePerTrip: 800 },
  { title: "Blue Horizon", description: "Whale watching excursion on a 40ft yacht. Binoculars provided.", location: "Monterey Bay, CA", boatType: "Yacht", capacity: 8, pricePerTrip: 350 },
  { title: "Diamond Waves", description: "Corporate event yacht with presentation area and Wi-Fi.", location: "Hudson River, NY", boatType: "Yacht", capacity: 20, pricePerTrip: 1200 },
  // Fishing Boats
  { title: "The Salty Dog", description: "A rugged fishing boat perfect for deep-sea adventures.", location: "Key West, FL", boatType: "Fishing Boat", capacity: 4, pricePerTrip: 120 },
  { title: "Bass Master", description: "Fully equipped fishing boat with sonar, rods, and live bait included.", location: "Lake Okeechobee, FL", boatType: "Fishing Boat", capacity: 3, pricePerTrip: 95 },
  { title: "Reel Deal", description: "Half-day deep sea fishing. Tackle, bait, and fish cleaning included.", location: "Destin, FL", boatType: "Fishing Boat", capacity: 6, pricePerTrip: 200 },
  { title: "Catch & Release", description: "Fly fishing guide boat on pristine mountain rivers.", location: "Bozeman, MT", boatType: "Fishing Boat", capacity: 2, pricePerTrip: 275 },
  { title: "Trophy Hunter", description: "Night fishing for swordfish. All gear and snacks provided.", location: "Islamorada, FL", boatType: "Fishing Boat", capacity: 4, pricePerTrip: 350 },
  // Pontoons
  { title: "Aqua Therapy", description: "Peaceful pontoon rides on calm lake waters. BYOB friendly.", location: "Lake Tahoe, CA", boatType: "Pontoon", capacity: 10, pricePerTrip: 180 },
  { title: "Party Barge", description: "The ultimate floating party. Bluetooth speakers and cooler onboard.", location: "Lake Havasu, AZ", boatType: "Pontoon", capacity: 14, pricePerTrip: 350 },
  { title: "Lily Pad", description: "Chill pontoon with a water slide and swimming platform.", location: "Lake Travis, TX", boatType: "Pontoon", capacity: 12, pricePerTrip: 225 },
  { title: "Floating Picnic", description: "Pontoon set up for wine and cheese on the water. Couples welcome.", location: "Finger Lakes, NY", boatType: "Pontoon", capacity: 6, pricePerTrip: 150 },
  { title: "Sunday Funday", description: "Family-friendly pontoon with shaded canopy, tubes, and snorkels.", location: "Table Rock Lake, MO", boatType: "Pontoon", capacity: 10, pricePerTrip: 160 },
  // Sailboats
  { title: "Wind Whisperer", description: "Classic sailboat experience for those who love the open water.", location: "Newport, RI", boatType: "Sailboat", capacity: 6, pricePerTrip: 200 },
  { title: "Moonlight Sail", description: "Nighttime sailing under the stars. Includes hot cocoa.", location: "Chesapeake Bay, MD", boatType: "Sailboat", capacity: 5, pricePerTrip: 175 },
  { title: "Trade Winds", description: "Learn to sail with a USCG-certified captain. Beginners welcome.", location: "Annapolis, MD", boatType: "Sailboat", capacity: 4, pricePerTrip: 150 },
  { title: "Sea Breeze", description: "Catamaran sailing with snorkel stop at a coral reef.", location: "Maui, HI", boatType: "Sailboat", capacity: 8, pricePerTrip: 300 },
  { title: "Golden Gate Glider", description: "Sail under the Golden Gate Bridge. Camera-ready views guaranteed.", location: "San Francisco, CA", boatType: "Sailboat", capacity: 6, pricePerTrip: 225 },
  // Speedboats
  { title: "Velocity", description: "High-speed thrills on a sleek speedboat. Hold on tight!", location: "Miami Beach, FL", boatType: "Speedboat", capacity: 4, pricePerTrip: 300 },
  { title: "Thunder Run", description: "Adrenaline-pumping speedboat tour through the harbor.", location: "San Diego, CA", boatType: "Speedboat", capacity: 6, pricePerTrip: 180 },
  { title: "Jet Setter", description: "Wakeboarding and tubing package with all equipment included.", location: "Lake Powell, UT", boatType: "Speedboat", capacity: 5, pricePerTrip: 250 },
  { title: "Mako", description: "Shark cage diving transport. Fast ride to the dive site.", location: "Montauk, NY", boatType: "Speedboat", capacity: 4, pricePerTrip: 400 },
  { title: "Splash Zone", description: "Banana boat pulls and donuts. Perfect for groups of friends.", location: "Panama City Beach, FL", boatType: "Speedboat", capacity: 8, pricePerTrip: 200 },
  // Kayaks
  { title: "Lazy River", description: "Kayak through mangroves and spot wildlife up close.", location: "Everglades, FL", boatType: "Kayak", capacity: 2, pricePerTrip: 45 },
  { title: "Glow Tour", description: "Bioluminescent kayak tour at night. Paddles and life vests included.", location: "Mosquito Lagoon, FL", boatType: "Kayak", capacity: 2, pricePerTrip: 65 },
  { title: "Canyon Paddle", description: "Kayak through slot canyons with towering red rock walls.", location: "Lake Mead, NV", boatType: "Kayak", capacity: 2, pricePerTrip: 85 },
  { title: "Sea Cave Explorer", description: "Guided sea kayak tour through coastal caves and arches.", location: "La Jolla, CA", boatType: "Kayak", capacity: 2, pricePerTrip: 75 },
  { title: "Sunrise Paddle", description: "Early morning kayak with coffee and pastries on a sandbar.", location: "Siesta Key, FL", boatType: "Kayak", capacity: 2, pricePerTrip: 55 },
];

function randomDates(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const future = new Date(today);
    future.setDate(today.getDate() + Math.floor(Math.random() * 60) + 1);
    const iso = future.toISOString().split("T")[0];
    if (!dates.includes(iso)) dates.push(iso);
  }
  return dates.sort();
}

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  boatType: string;
  capacity: number;
  pricePerTrip: number;
  availableDates: string[];
  status: "available";
}

interface BookedReservation {
  id: string;
  boatId: string;
  title: string;
  guestName: string;
  guestEmail: string;
  guestAvatar: string;
  date: string;
  location: string;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

const formatDate = (d: string) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

function ListingModal({
  listing,
  onClose,
  onSave,
  companyId,
  userName,
  userAvatar,
}: {
  listing?: Listing;
  onClose: () => void;
  onSave: () => void;
  companyId: string;
  userName?: string;
  userAvatar?: string;
}) {
  const [form, setForm] = useState({
    title: listing?.title || "",
    description: listing?.description || "",
    location: listing?.location || "",
    boatType: listing?.boatType || "Sailboat",
    capacity: listing?.capacity || 6,
    pricePerTrip: listing?.pricePerTrip || 0,
    availableDates: listing?.availableDates || [] as string[],
  });
  const [newDate, setNewDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autofill = () => {
    const preset = RANDOM_LISTINGS[Math.floor(Math.random() * RANDOM_LISTINGS.length)];
    setForm({ ...preset, availableDates: randomDates(3 + Math.floor(Math.random() * 4)) });
  };

  const addDate = () => {
    if (newDate && !form.availableDates.includes(newDate)) {
      setForm({ ...form, availableDates: [...form.availableDates, newDate].sort() });
      setNewDate("");
    }
  };

  const removeDate = (d: string) => {
    setForm({ ...form, availableDates: form.availableDates.filter((x) => x !== d) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/host/sessions", {
        method: listing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing ? { listingId: listing.id, companyId, userName, userAvatar, ...form } : { companyId, userName, userAvatar, ...form }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Failed");
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-[#DDDDDD] flex items-center justify-between">
          <h2 className="font-semibold text-lg" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{listing ? "Edit listing" : "Create listing"}</h2>
          <div className="flex items-center gap-2">
            {!listing && <button type="button" onClick={autofill} className="px-3 py-1.5 text-xs border border-[#DDDDDD] hover:bg-[#EBEBEB] rounded-lg text-[#717171] hover:text-[#222222] transition-colors">Autofill</button>}
            <button onClick={onClose} className="text-[#717171] hover:text-[#222222] p-1 rounded-full hover:bg-[#EBEBEB] w-8 h-8 flex items-center justify-center">&#10005;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">Boat name</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sunset Cruiser"
              required
              maxLength={40}
              className="w-full px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell guests about your boat..."
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] resize-none text-[#222222]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Marina Del Rey, CA"
              required
              className="w-full px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#484848] mb-1.5">Boat type</label>
              <select value={form.boatType} onChange={(e) => setForm({ ...form, boatType: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]">
                {BOAT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#484848] mb-1.5">Max guests</label>
              <input type="number" min={1} max={50} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">Price per trip</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717171]">$</span>
              <input type="text" inputMode="decimal" value={form.pricePerTrip || ""} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ""); setForm({ ...form, pricePerTrip: parseFloat(v) || 0 }); }} placeholder="0" className="w-full pl-7 pr-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]" />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">Available dates</label>
            <div className="flex gap-2 mb-2">
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="flex-1 px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]" />
              <button type="button" onClick={addDate} className="px-4 py-2.5 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] text-sm font-semibold">Add</button>
            </div>
            {form.availableDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.availableDates.map((d) => (
                  <span key={d} className="flex items-center gap-1 px-3 py-1 bg-[#EBEBEB] text-[#484848] text-sm rounded-full">
                    {formatDate(d)}
                    <button type="button" onClick={() => removeDate(d)} className="ml-1 text-[#717171] hover:text-[#222222]">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting || !form.title || !form.location || form.availableDates.length === 0} className="w-full py-3 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors disabled:opacity-50 font-semibold">
            {isSubmitting ? "Saving..." : listing ? "Save changes" : "Create listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ListingsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [booked, setBooked] = useState<BookedReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Listing | undefined>();
  const [activeTab, setActiveTab] = useState<"listings" | "reservations">("listings");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = async () => {
    if (!user?.companyId) return setIsLoading(false);
    try {
      const res = await fetch(`/api/host/sessions?companyId=${user.companyId}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.availableListings || []);
        setBooked(data.bookedSessions || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/host/sessions?listingId=${id}`, { method: "DELETE" });
    load();
  };

  const handleCancelReservation = async (reservation: BookedReservation) => {
    if (!confirm(`Cancel reservation for ${reservation.guestName} on ${formatDate(reservation.date)}?`)) return;
    setCancellingId(reservation.id);
    try {
      const res = await fetch("/api/host/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: reservation.id, boatId: reservation.boatId, date: reservation.date }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to cancel");
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel reservation");
    } finally {
      setCancellingId(null);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [user?.companyId]);

  const upcoming = booked.filter((s) => s.status === "upcoming");
  const past = booked.filter((s) => s.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>;

  return (
    <div>
      {searchParams.get("success") === "true" && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
          New reservation received! <Link href="/messages" className="underline">Message your guest</Link> to coordinate details.
        </div>
      )}

      {/* Sub-tabs for Listings vs Reservations */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-white rounded-lg p-1">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "listings"
                ? "bg-[#EBEBEB] text-[#222222]"
                : "text-[#717171] hover:text-[#222222]"
            }`}
          >
            Your boats ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "reservations"
                ? "bg-[#EBEBEB] text-[#222222]"
                : "text-[#717171] hover:text-[#222222]"
            }`}
          >
            Reservations ({booked.length})
          </button>
        </div>
        {activeTab === "listings" && (
          <button
            onClick={() => { setEditing(undefined); setShowModal(true); }}
            className="px-4 py-2 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors font-semibold text-sm"
          >
            + Add listing
          </button>
        )}
      </div>

      {activeTab === "listings" ? (
        /* Listings grid */
        listings.length === 0 ? (
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-12 text-center">
            <p className="text-[#717171] mb-4">No listings yet</p>
            <button
              onClick={() => { setEditing(undefined); setShowModal(true); }}
              className="px-6 py-3 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
            >
              Create your first listing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((s) => (
              <div key={s.id} className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 flex items-center justify-between group hover:border-[#DDDDDD] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold truncate">{s.title}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/15 text-green-400">Active</span>
                  </div>
                  <p className="text-sm text-[#717171]">
                    {s.location} &middot; {s.boatType} &middot; Up to {s.capacity} guests &middot; {s.availableDates.length} date{s.availableDates.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="font-semibold whitespace-nowrap">
                    {s.pricePerTrip === 0 ? "Free" : `$${s.pricePerTrip}`}
                    {s.pricePerTrip > 0 && <span className="text-sm text-[#717171] font-normal"> / trip</span>}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(s); setShowModal(true); }} className="px-3 py-1.5 text-xs border border-[#DDDDDD] hover:bg-[#EBEBEB] rounded-lg text-[#484848]">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 text-xs border border-[#DDDDDD] hover:bg-red-600 hover:border-red-600 rounded-lg text-[#484848]">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Reservations */
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h3 className="text-sm font-medium text-[#717171] uppercase tracking-wide mb-3">Upcoming ({upcoming.length})</h3>
            {upcoming.length === 0 ? (
              <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No upcoming reservations</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((s) => (
                  <div key={s.id} className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={s.guestAvatar} alt="" className="w-10 h-10 rounded-full bg-[#EBEBEB]" />
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-[#717171]">{s.guestName} &middot; {formatDate(s.date)} &middot; {s.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{s.amount === 0 ? "Free" : `$${s.amount}`}</span>
                      <Link href="/messages" className="px-3 py-1.5 text-sm border border-[#DDDDDD] rounded-lg hover:bg-[#EBEBEB] transition-colors">Message</Link>
                      <button
                        onClick={() => handleCancelReservation(s)}
                        disabled={cancellingId === s.id}
                        className="px-3 py-1.5 text-sm border border-[#DDDDDD] rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === s.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h3 className="text-sm font-medium text-[#717171] uppercase tracking-wide mb-3">Past ({past.length})</h3>
            {past.length === 0 ? (
              <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No past reservations</div>
            ) : (
              <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-[#DDDDDD] text-left text-sm text-[#717171]">
                    <th className="px-5 py-3 font-medium">Boat</th>
                    <th className="px-5 py-3 font-medium">Guest</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#EBEBEB]">
                    {past.map((s) => (
                      <tr key={s.id} className="hover:bg-[#222222] transition-colors">
                        <td className="px-5 py-3 font-medium">{s.title}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <img src={s.guestAvatar} alt="" className="w-7 h-7 rounded-full bg-[#EBEBEB]" />
                            <span className="text-[#484848]">{s.guestName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[#717171]">{formatDate(s.date)}</td>
                        <td className="px-5 py-3">{s.amount === 0 ? "Free" : `$${s.amount}`}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === "completed" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && user && (
        <ListingModal listing={editing} onClose={() => setShowModal(false)} onSave={load} companyId={user.companyId} userName={user.name} userAvatar={user.profile_pic_url} />
      )}
    </div>
  );
}

export default function ListingsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>}><ListingsContent /></Suspense>;
}
