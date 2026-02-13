"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";

interface PickPackage {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "available";
}

interface Subscriber {
  id: string;
  title: string;
  learnerName: string;
  learnerEmail: string;
  learnerAvatar: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
const formatTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

function PackageModal({
  session,
  onClose,
  onSave,
  companyId,
  userName,
  userAvatar,
}: {
  session?: PickPackage;
  onClose: () => void;
  onSave: () => void;
  companyId: string;
  userName?: string;
  userAvatar?: string;
}) {
  const [form, setForm] = useState({
    title: session?.title || "",
    description: session?.description || "",
    date: session?.date || new Date().toISOString().split("T")[0],
    time: session?.time || "10:00",
    duration: session?.duration || 60,
    price: session?.price || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/sessions", {
        method: session ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session ? { sessionId: session.id, companyId, userName, userAvatar, ...form } : { companyId, userName, userAvatar, ...form }),
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
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] w-full max-w-md">
        <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <h2 className="font-semibold">{session ? "Edit" : "Add"} Pick Package</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">&#10005;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Package title (e.g. NFL Week 12 Picks)"
            required
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] resize-none text-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required min={new Date().toISOString().split("T")[0]} className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })} className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white">
              <option value={3}>3 picks</option>
              <option value={5}>5 picks</option>
              <option value={10}>10 picks</option>
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="text" inputMode="decimal" value={form.price || ""} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ""); setForm({ ...form, price: parseFloat(v) || 0 }); }} placeholder="0.00" className="w-full pl-7 pr-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting || !form.title} className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors disabled:opacity-50 font-bold">
            {isSubmitting ? "Saving..." : session ? "Save Changes" : "Create Package"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PackagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<PickPackage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PickPackage | undefined>();

  const load = async () => {
    if (!user?.companyId) return setIsLoading(false);
    try {
      const res = await fetch(`/api/instructor/sessions?companyId=${user.companyId}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.availableSessions || []);
        setSubscribers(data.bookedSessions || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pick package?")) return;
    await fetch(`/api/instructor/sessions?sessionId=${id}`, { method: "DELETE" });
    load();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [user?.companyId]);

  const active = subscribers.filter((s) => s.status === "upcoming");
  const past = subscribers.filter((s) => s.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Pick Packages</h1>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} className="px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold">+ Add Package</button>
      </div>

      {searchParams.get("success") === "true" && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">New subscriber!</div>
      )}

      {/* Available Packages */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#F59E0B] rounded-full" />Available</h2>
        {packages.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">No packages yet. Create one to start selling picks.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <div key={p.id} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-5 group hover:border-[#F59E0B]/30 transition-all">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="text-[#F59E0B] font-semibold">{p.price === 0 ? "Free" : `$${p.price}`}</span>
                </div>
                {p.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>}
                <div className="text-sm text-gray-500 mb-3">{formatDate(p.date)} · {formatTime(p.time)} · {p.duration} picks</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(p); setShowModal(true); }} className="px-3 py-1.5 text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded text-gray-300">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 text-xs bg-[#2A2A2A] hover:bg-red-600 rounded text-gray-300">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Subscribers */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#F59E0B] rounded-full" />Active Subscribers</h2>
        {active.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">No active subscribers</div>
        ) : (
          <div className="space-y-4">
            {active.map((s) => (
              <div key={s.id} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.learnerAvatar} alt="" className="w-12 h-12 rounded-full bg-[#2A2A2A]" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-gray-300">{s.learnerName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(s.date)} at {formatTime(s.time)}</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-[#F59E0B]">{s.amount === 0 ? "Free" : `$${s.amount}`}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">No past subscribers</div>
        ) : (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2A2A2A] text-left text-gray-400">
                <th className="px-6 py-4">Package</th><th className="px-6 py-4">Subscriber</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {past.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-medium">{s.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3"><img src={s.learnerAvatar} alt="" className="w-8 h-8 rounded-full bg-[#2A2A2A]" />{s.learnerName}</td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(s.date)}</td>
                    <td className="px-6 py-4 text-[#F59E0B]">{s.amount === 0 ? "Free" : `$${s.amount}`}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${s.status === "completed" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-red-500/20 text-red-500"}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && user && (
        <PackageModal session={editing} onClose={() => setShowModal(false)} onSave={load} companyId={user.companyId} userName={user.name} userAvatar={user.profile_pic_url} />
      )}
    </div>
  );
}

export default function PackagesPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" /></div>}><PackagesContent /></Suspense>;
}
