"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface CreateDMModalProps {
  onClose: () => void;
  onCreate: (userIds: string[]) => Promise<void>;
}

export default function CreateDMModal({
  onClose,
  onCreate,
}: CreateDMModalProps) {
  const [userInput, setUserInput] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = () => {
    const id = userInput.trim();
    if (id && !userIds.includes(id)) {
      setUserIds((prev) => [...prev, id]);
      setUserInput("");
    }
  };

  const removeUser = (id: string) => {
    setUserIds((prev) => prev.filter((uid) => uid !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUser();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userIds.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      await onCreate(userIds);
    } catch {
      setError("Failed to create DM channel. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-[#1a1a3e] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">New Direct Message</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-400">
          Add users by their Whop user ID to start a conversation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Add Participants
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="user_xxxxxxxxxx"
                className="flex-1 rounded-md border border-[#2a2a5e] bg-[#0a0a1a] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#4338CA]"
                autoFocus
              />
              <button
                type="button"
                onClick={addUser}
                disabled={!userInput.trim()}
                className="rounded-md bg-[#1E1B4B] px-3 py-2 text-gray-300 transition-colors hover:bg-[#2a2a5e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserPlus size={18} />
              </button>
            </div>
          </div>

          {userIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {userIds.map((id) => (
                <span
                  key={id}
                  className="flex items-center gap-1.5 rounded-full bg-[#4338CA]/30 px-3 py-1 text-xs text-[#a5b4fc]"
                >
                  {id}
                  <button
                    type="button"
                    onClick={() => removeUser(id)}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

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
              disabled={userIds.length === 0 || loading}
              className="rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5346db] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : `Start${userIds.length > 1 ? " Group" : ""} Chat`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
