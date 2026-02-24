"use client";

import {
  Hash,
  ChevronDown,
  Search,
  Mic,
  Headphones,
  Settings,
  Plus,
} from "lucide-react";
import type { ChatChannel } from "@/lib/channels";

interface ChannelListProps {
  serverName: string;
  channels: ChatChannel[];
  activeChannelId: string | null;
  onChannelChange: (channelId: string) => void;
  onCreateChannel: () => void;
  loading?: boolean;
}

export default function ChannelList({
  serverName,
  channels,
  activeChannelId,
  onChannelChange,
  onCreateChannel,
  loading,
}: ChannelListProps) {
  return (
    <div className="flex w-56 flex-col bg-[#12122a]">
      {/* Server header */}
      <div className="flex h-12 items-center justify-between border-b border-[#1E1B4B] px-4 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="truncate text-[15px] font-semibold text-white">
            {serverName}
          </h2>
          <div
            className="h-2 w-2 rounded-full bg-[#22C55E] shrink-0"
            title="Connected to Whop"
          />
        </div>
        <button className="text-gray-400 transition-colors duration-200 hover:text-white">
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="px-2 pt-3 pb-1">
        <button className="flex w-full items-center gap-2 rounded-md bg-[#0a0a1a] px-2 py-1.5 text-xs text-gray-500 transition-colors duration-200 hover:text-gray-400">
          <Search size={14} />
          <span>Search</span>
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4338CA] border-t-transparent" />
          </div>
        ) : channels.length > 0 ? (
          <div className="mb-4">
            <div className="mb-1 flex w-full items-center gap-0.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <ChevronDown size={12} />
              <span className="flex-1">Chat Channels</span>
              <button
                onClick={onCreateChannel}
                className="rounded p-0.5 text-gray-500 transition-colors hover:text-white"
                title="Create Channel"
              >
                <Plus size={14} />
              </button>
            </div>

            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelChange(channel.id)}
                className={`group mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ${
                  activeChannelId === channel.id
                    ? "bg-[#1E1B4B]/60 text-white"
                    : "text-gray-500 hover:bg-[#1E1B4B]/30 hover:text-gray-300"
                }`}
              >
                <Hash size={18} className="shrink-0 text-gray-500" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-2 py-4 text-center text-xs text-gray-600">
            <span>No channels yet.</span>
            <button
              onClick={onCreateChannel}
              className="rounded-md bg-[#4338CA] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#5346db]"
            >
              Create Channel
            </button>
          </div>
        )}
      </div>

      {/* User panel */}
      <div className="flex items-center gap-2 border-t border-[#1E1B4B] bg-[#0a0a1a] px-2 py-2">
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4338CA] text-xs font-bold text-white">
            You
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a1a] bg-[#22C55E]" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-white">YourName</p>
          <p className="truncate text-[11px] text-gray-500">Online</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-gray-500 transition-colors duration-200 hover:text-gray-300">
            <Mic size={16} />
          </button>
          <button className="rounded p-1 text-gray-500 transition-colors duration-200 hover:text-gray-300">
            <Headphones size={16} />
          </button>
          <button className="rounded p-1 text-gray-500 transition-colors duration-200 hover:text-gray-300">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
