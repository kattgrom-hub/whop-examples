"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const BOAT_TYPES = ["Sailboat", "Yacht", "Pontoon", "Speedboat", "Fishing Boat", "Kayak"];

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#DDDDDD] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <h2 className="font-semibold text-[#222222]">{listing ? "Edit" : "Add"} Boat Listing</h2>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222] p-1">&#10005;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Boat name"
            required
            maxLength={40}
            className="w-full px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] resize-none text-[#222222]"
          />
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location (e.g. Marina Del Rey, CA)"
            required
            className="w-full px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]"
          />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.boatType} onChange={(e) => setForm({ ...form, boatType: e.target.value })} className="px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]">
              {BOAT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717171] text-sm">Guests:</span>
              <input type="number" min={1} max={50} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} className="w-full pl-16 pr-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]" />
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717171]">$</span>
            <input type="text" inputMode="decimal" value={form.pricePerTrip || ""} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ""); setForm({ ...form, pricePerTrip: parseFloat(v) || 0 }); }} placeholder="Price per trip" className="w-full pl-7 pr-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]" />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-2">Available Dates</label>
            <div className="flex gap-2 mb-2">
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="flex-1 px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#222222] text-[#222222]" />
              <button type="button" onClick={addDate} className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] text-sm font-semibold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.availableDates.map((d) => (
                <span key={d} className="flex items-center gap-1 px-3 py-1 bg-[#F7F7F7] text-[#484848] text-sm rounded-full border border-[#EBEBEB]">
                  {formatDate(d)}
                  <button type="button" onClick={() => removeDate(d)} className="ml-1 text-[#717171] hover:text-[#222222]">×</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || !form.title || !form.location || form.availableDates.length === 0} className="w-full py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors disabled:opacity-50 font-semibold">
            {isSubmitting ? "Saving..." : listing ? "Save Changes" : "Create Listing"}
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [user?.companyId]);

  const upcoming = booked.filter((s) => s.status === "upcoming");
  const past = booked.filter((s) => s.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#222222]">Boat Listings</h1>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold">+ Add Listing</button>
      </div>

      {searchParams.get("success") === "true" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          New reservation received! <Link href="/messages" className="underline">Message your guest</Link> to coordinate details.
        </div>
      )}

      {/* Available Listings */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#222222]"><span className="w-2 h-2 bg-[#FF385C] rounded-full" />Your Listings</h2>
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No listings yet. Create one to let guests reserve.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-[#DDDDDD] p-5 group hover:shadow-md transition-all">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold text-[#222222]">{s.title}</h3>
                  <span className="text-[#222222] font-semibold">{s.pricePerTrip === 0 ? "Free" : `$${s.pricePerTrip}`}</span>
                </div>
                {s.description && <p className="text-[#717171] text-sm mb-2 line-clamp-2">{s.description}</p>}
                <div className="text-sm text-[#717171] mb-1">{s.location} · {s.boatType} · Up to {s.capacity} guests</div>
                <div className="text-sm text-[#717171] mb-3">{s.availableDates.length} date{s.availableDates.length !== 1 ? "s" : ""} available</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(s); setShowModal(true); }} className="px-3 py-1.5 text-xs bg-[#F7F7F7] hover:bg-[#EBEBEB] rounded text-[#484848] border border-[#DDDDDD]">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 text-xs bg-[#F7F7F7] hover:bg-red-50 hover:text-red-600 rounded text-[#484848] border border-[#DDDDDD]">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Reservations */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#222222]"><span className="w-2 h-2 bg-[#FF385C] rounded-full" />Upcoming Reservations</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No upcoming reservations</div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-[#DDDDDD] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.guestAvatar} alt="" className="w-12 h-12 rounded-full bg-[#EBEBEB]" />
                  <div>
                    <p className="font-semibold text-[#222222]">{s.title}</p>
                    <p className="text-[#484848]">{s.guestName}</p>
                    <p className="text-[#717171] text-sm">{formatDate(s.date)} · {s.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-[#222222]">{s.amount === 0 ? "Free" : `$${s.amount}`}</span>
                  <Link href="/messages" className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] font-semibold">Message</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Reservations */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[#222222]">Past</h2>
        {past.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No past reservations</div>
        ) : (
          <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#DDDDDD] text-left text-[#717171]">
                <th className="px-6 py-4">Boat</th><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {past.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-medium text-[#222222]">{s.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3 text-[#484848]"><img src={s.guestAvatar} alt="" className="w-8 h-8 rounded-full bg-[#EBEBEB]" />{s.guestName}</td>
                    <td className="px-6 py-4 text-[#717171]">{formatDate(s.date)}</td>
                    <td className="px-6 py-4 text-[#222222]">{s.amount === 0 ? "Free" : `$${s.amount}`}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${s.status === "completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && user && (
        <ListingModal listing={editing} onClose={() => setShowModal(false)} onSave={load} companyId={user.companyId} userName={user.name} userAvatar={user.profile_pic_url} />
      )}
    </div>
  );
}

export default function ListingsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" /></div>}><ListingsContent /></Suspense>;
}
