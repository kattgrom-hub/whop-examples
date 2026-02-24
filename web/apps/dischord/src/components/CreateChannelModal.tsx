"use client";

import { useState } from "react";
import { X, Hash } from "lucide-react";

interface CreateChannelModalProps {
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export default function CreateChannelModal({
  onClose,
  onCreate,
}: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onCreate(name.trim());
    } catch {
      setError("Failed to create channel. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-[#1a1a3e] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create Channel</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-400">
          Create a new chat channel in this server. Channels are where your
          members communicate.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Channel Name
            </label>
            <div className="flex items-center gap-2 rounded-md border border-[#2a2a5e] bg-[#0a0a1a] px-3 py-2">
              <Hash size={16} className="shrink-0 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="general"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                autoFocus
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

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
              disabled={!name.trim() || loading}
              className="rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5346db] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
