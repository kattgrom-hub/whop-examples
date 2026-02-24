"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateServerModalProps {
  onClose: () => void;
  onCreate: (title: string, email?: string) => Promise<void>;
}

export default function CreateServerModal({
  onClose,
  onCreate,
}: CreateServerModalProps) {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onCreate(title.trim(), email.trim() || undefined);
    } catch {
      setError("Failed to create server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-[#1a1a3e] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create a Server</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-400">
          Create a new server backed by a Whop connected account. Each server
          has its own isolated chat channels.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Server Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Server"
              className="w-full rounded-md border border-[#2a2a5e] bg-[#0a0a1a] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#4338CA]"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-md border border-[#2a2a5e] bg-[#0a0a1a] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#4338CA]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5346db] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Server"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
