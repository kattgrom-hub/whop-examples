"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";

interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "available";
}

interface BookedSession {
  id: string;
  title: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
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

function SessionModal({
  session,
  onClose,
  onSave,
  userId,
  userEmail,
  userName,
}: {
  session?: Session;
  onClose: () => void;
  onSave: () => void;
  userId: string;
  userEmail?: string;
  userName?: string;
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
      const response = await fetch("/api/coach/sessions", {
        method: session ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session ? { sessionId: session.id, ...form } : { userId, userEmail, userName, ...form }),
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
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold">{session ? "Edit" : "Add"} Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Session title"
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required min={new Date().toISOString().split("T")[0]} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} min="0" placeholder="Price ($)" className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" disabled={isSubmitting || !form.title} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {isSubmitting ? "Saving..." : session ? "Save Changes" : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SessionsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [booked, setBooked] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Session | undefined>();

  const load = async () => {
    if (!user?.id) return setIsLoading(false);
    try {
      const res = await fetch(`/api/coach/sessions?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.availableSessions || []);
        setBooked(data.bookedSessions || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/coach/sessions?sessionId=${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => { load(); }, [user]);

  const upcoming = booked.filter((s) => s.status === "upcoming");
  const past = booked.filter((s) => s.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Session</button>
      </div>

      {searchParams.get("success") === "true" && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">New booking received!</div>
      )}

      {/* Available Sessions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Available</h2>
        {sessions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">No sessions yet. Create one to let students book.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <div key={s.id} className="bg-gray-800 rounded-xl border border-gray-700 p-5 group">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{s.title}</h3>
                  <span className="text-green-400 font-semibold">{s.price === 0 ? "Free" : `$${s.price}`}</span>
                </div>
                {s.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{s.description}</p>}
                <div className="text-sm text-gray-500 mb-3">{formatDate(s.date)} · {formatTime(s.time)} · {s.duration} min</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(s); setShowModal(true); }} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-red-600 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Bookings */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full" />Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">No upcoming bookings</div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((s) => (
              <div key={s.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.studentAvatar} alt="" className="w-12 h-12 rounded-full bg-gray-700" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-gray-300">{s.studentName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(s.date)} at {formatTime(s.time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">{s.amount === 0 ? "Free" : `$${s.amount}`}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Join</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Sessions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">No past sessions</div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-gray-700 text-left text-gray-400">
                <th className="px-6 py-4">Session</th><th className="px-6 py-4">Student</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-700">
                {past.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-medium">{s.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3"><img src={s.studentAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-700" />{s.studentName}</td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(s.date)}</td>
                    <td className="px-6 py-4">{s.amount === 0 ? "Free" : `$${s.amount}`}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${s.status === "completed" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && user && (
        <SessionModal session={editing} onClose={() => setShowModal(false)} onSave={load} userId={user.id} userEmail={user.email} userName={user.name} />
      )}
    </div>
  );
}

export default function SessionsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}><SessionsContent /></Suspense>;
}
