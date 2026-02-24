"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ChatElement,
  ChatSession,
  DmsListElement,
  Elements,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";
import type {
  DmsListElementEvent,
  DmsListElementOptions,
  ChatElementOptions,
} from "@whop/embedded-components-vanilla-js/types";
import { Plus, MessageCircle, X, Loader2, UserPlus } from "lucide-react";

const elements = loadWhopElements();

interface DmsViewProps {
  companyId: string;
}

export default function DmsView({ companyId }: DmsViewProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string>();
  const [showNewDm, setShowNewDm] = useState(false);

  const getToken = useCallback(async (): Promise<string> => {
    const params = companyId ? `?companyId=${companyId}` : "";
    const res = await fetch(`/api/token${params}`);
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || "Failed to fetch token");
    }
    return data.token;
  }, [companyId]);

  const handleDmsEvent = useCallback((event: DmsListElementEvent) => {
    switch (event.type) {
      case "channelSelected":
        setSelectedChannelId(event.detail.id);
        break;
    }
  }, []);

  const dmsOptions: DmsListElementOptions = useMemo(
    () => ({
      companyId,
      selectedChannel: selectedChannelId,
      onEvent: handleDmsEvent,
    }),
    [companyId, selectedChannelId, handleDmsEvent]
  );

  const chatOptions: ChatElementOptions | null = useMemo(() => {
    if (!selectedChannelId) return null;
    return { channelId: selectedChannelId };
  }, [selectedChannelId]);

  const handleDmCreated = (channelId: string) => {
    setSelectedChannelId(channelId);
    setShowNewDm(false);
  };

  return (
    <Elements elements={elements}>
      <ChatSession token={getToken}>
        <div className="flex flex-1">
          {/* DM List Panel */}
          <div className="flex w-56 flex-col bg-[#12122a]">
            {/* Header */}
            <div className="flex h-12 items-center justify-between border-b border-[#1E1B4B] px-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-white">
                Direct Messages
              </h2>
              <button
                onClick={() => setShowNewDm(true)}
                className="text-gray-400 transition-colors duration-200 hover:text-white"
                title="New DM"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* DM Conversations */}
            <div className="flex-1 overflow-hidden">
              <DmsListElement
                options={dmsOptions}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>

          {/* Chat Area */}
          {chatOptions ? (
            <div className="flex flex-1 flex-col bg-[#0F0F23]">
              <div className="flex h-12 items-center border-b border-[#1E1B4B] px-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-gray-500" />
                  <h3 className="font-semibold text-white">
                    Direct Message
                  </h3>
                  <div className="mx-2 h-6 w-px bg-[#1E1B4B]" />
                  <p className="text-sm text-gray-500">
                    Powered by Whop Chat
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatElement
                  options={chatOptions}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
              <div className="flex flex-col items-center gap-4 text-center px-8 max-w-md">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1B4B]">
                  <MessageCircle size={40} className="text-[#4338CA]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Messages</h2>
                <p className="text-gray-400 leading-relaxed">
                  Select a conversation or start a new one.
                </p>
                <button
                  onClick={() => setShowNewDm(true)}
                  className="mt-2 flex items-center gap-2 rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3730A3]"
                >
                  <UserPlus size={16} />
                  New Message
                </button>
              </div>
            </div>
          )}
        </div>
      </ChatSession>

      {/* New DM Modal */}
      {showNewDm && (
        <NewDmModal
          onClose={() => setShowNewDm(false)}
          onCreated={handleDmCreated}
        />
      )}
    </Elements>
  );
}

function NewDmModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (channelId: string) => void;
}) {
  const [userIds, setUserIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const ids = userIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      setError("Enter at least one user ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create DM");
      onCreated(data.channelId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create DM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-[#12122a] border border-[#1E1B4B] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E1B4B] px-5 py-4">
          <h3 className="text-lg font-semibold text-white">
            Create Group DM
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <label className="block text-sm text-gray-400 mb-2">
            Enter Whop user IDs (comma-separated)
          </label>
          <input
            type="text"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            placeholder="user_xxx, user_yyy"
            className="w-full rounded-md bg-[#0a0a1a] border border-[#1E1B4B] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#4338CA] transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          <p className="mt-2 text-xs text-gray-600">
            Add multiple users to create a group conversation.
          </p>

          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#1E1B4B] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !userIds.trim()}
            className="flex items-center gap-2 rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3730A3] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create DM"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
