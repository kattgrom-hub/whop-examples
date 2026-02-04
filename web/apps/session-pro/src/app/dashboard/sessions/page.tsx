"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";

interface AvailableSession {
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

interface NewSessionForm {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
}

const DEFAULT_SESSION = {
  title: "Designers Using Cursor",
  description: "I'll talk endlessly in engineering jargon and give you a few Claude skills at the end so you don't have to learn git",
  duration: 60,
  price: 5,
  time: "22:00",
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function AddSessionModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userEmail,
  userName,
  defaultPrice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  userEmail?: string;
  userName?: string;
  defaultPrice: number;
}) {
  const [form, setForm] = useState<NewSessionForm>({
    title: DEFAULT_SESSION.title,
    description: DEFAULT_SESSION.description,
    date: getTodayDate(),
    time: DEFAULT_SESSION.time,
    duration: DEFAULT_SESSION.duration,
    price: DEFAULT_SESSION.price,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update price when defaultPrice changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, price: defaultPrice }));
  }, [defaultPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/coach/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create session");
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      title: DEFAULT_SESSION.title,
      description: DEFAULT_SESSION.description,
      date: getTodayDate(),
      time: DEFAULT_SESSION.time,
      duration: DEFAULT_SESSION.duration,
      price: DEFAULT_SESSION.price,
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {success ? "Session Created!" : "Add New Session"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5l-10 10" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{form.title}</p>
                <p className="text-sm text-gray-400">
                  {form.date} at {form.time}
                </p>
              </div>
            </div>
            <p className="text-gray-300">
              Your session is now available for students to book on your profile page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    title: DEFAULT_SESSION.title,
                    description: DEFAULT_SESSION.description,
                    date: getTodayDate(),
                    time: DEFAULT_SESSION.time,
                    duration: DEFAULT_SESSION.duration,
                    price: DEFAULT_SESSION.price,
                  });
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Another
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., 1:1 Code Review"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description (optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What will you cover in this session?"
                rows={2}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Duration
                </label>
                <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500">
              This session will appear on your profile for students to book.
            </p>

            <button
              type="submit"
              disabled={isSubmitting || !form.title || !form.date || !form.time}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isSubmitting ? "Creating..." : "Create Session"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function EditSessionModal({
  session,
  onClose,
  onSave,
}: {
  session: AvailableSession;
  onClose: () => void;
  onSave: (session: AvailableSession, updates: Partial<AvailableSession>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: session.title,
    description: session.description,
    date: session.date,
    time: session.time,
    duration: session.duration,
    price: session.price,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(session, form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5l-10 10" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  // Handle HH:MM format
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function SessionsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([]);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<AvailableSession | null>(null);
  const [defaultPrice, setDefaultPrice] = useState(0);

  const showSuccess = searchParams.get("success") === "true";

  const loadSessions = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch sessions
      const response = await fetch(`/api/coach/sessions?userId=${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setAvailableSessions(data.availableSessions || []);
        setBookedSessions(data.bookedSessions || []);
      } else if (response.status === 404) {
        // No connected account yet
        setAvailableSessions([]);
        setBookedSessions([]);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to load sessions");
      }

      // Fetch coach profile for default price (optional)
      const profileResponse = await fetch(`/api/coach/profile?userId=${user.id}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setDefaultPrice(profileData.profile?.hourlyRate || 0);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Delete this session?")) return;

    try {
      const response = await fetch(`/api/coach/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadSessions();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete session");
      }
    } catch (err) {
      alert("Failed to delete session");
    }
  };

  const handleEditSession = async (session: AvailableSession, updates: Partial<AvailableSession>) => {
    try {
      const response = await fetch("/api/coach/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          ...updates,
        }),
      });

      if (response.ok) {
        setEditingSession(null);
        loadSessions();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update session");
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  const upcomingBooked = bookedSessions.filter((s) => s.status === "upcoming");
  const pastBooked = bookedSessions.filter((s) => s.status !== "upcoming");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add Session
        </button>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
          New booking received! The session has been added below.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Available Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Available for Booking
        </h2>
        {availableSessions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
            <p className="text-gray-400 mb-2">No sessions available</p>
            <p className="text-gray-500 text-sm">
              Create a session to let students book time with you.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-5 group"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold">{session.title}</h3>
                  <span className="text-green-400 font-semibold">
                    {session.price === 0 ? "Free" : `$${session.price}`}
                  </span>
                </div>
                {session.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {session.description}
                  </p>
                )}
                <div className="text-sm text-gray-500 mb-3">
                  {formatDate(session.date)} · {formatTime(session.time)} · {session.duration} min
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingSession(session)}
                    className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-red-600 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Booked Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Upcoming Bookings
        </h2>
        {upcomingBooked.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            No upcoming bookings yet
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBooked.map((session) => (
              <div
                key={session.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={session.studentAvatar}
                      alt={session.studentName}
                      className="w-12 h-12 rounded-full bg-gray-700"
                    />
                    <div>
                      <p className="font-semibold">{session.title}</p>
                      <p className="text-gray-300">{session.studentName}</p>
                      <p className="text-gray-400 text-sm">
                        {formatDate(session.date)} at {formatTime(session.time)} · {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">
                      {session.amount === 0 ? "Free" : `$${session.amount}`}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Join Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Past Sessions</h2>
        {pastBooked.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            No past sessions yet
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="px-6 py-4 text-gray-400 font-medium">Session</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Student</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Duration</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pastBooked.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 font-medium">{session.title}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={session.studentAvatar}
                          alt={session.studentName}
                          className="w-8 h-8 rounded-full bg-gray-700"
                        />
                        <div>
                          <span>{session.studentName}</span>
                          {session.studentEmail && (
                            <p className="text-gray-500 text-xs">{session.studentEmail}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(session.date)}</td>
                    <td className="px-6 py-4 text-gray-400">{session.duration} min</td>
                    <td className="px-6 py-4">
                      {session.amount === 0 ? "Free" : `$${session.amount}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          session.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {user && (
        <AddSessionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadSessions}
          userId={user.id}
          userEmail={user.email}
          userName={user.name}
          defaultPrice={defaultPrice}
        />
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSave={handleEditSession}
        />
      )}
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SessionsContent />
    </Suspense>
  );
}
