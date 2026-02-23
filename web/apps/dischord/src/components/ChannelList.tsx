"use client";

import { useState } from "react";
import {
  Hash,
  Volume2,
  ChevronDown,
  Plus,
  Settings,
  Search,
  Mic,
  Headphones,
} from "lucide-react";
import type { Server, ServerChannel } from "@/data/servers";

interface ChannelListProps {
  server: Server;
  activeChannelId: string | null;
  onChannelChange: (channelId: string) => void;
}

export default function ChannelList({
  server,
  activeChannelId,
  onChannelChange,
}: ChannelListProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const categories = Array.from(
    new Set(server.channels.map((ch) => ch.category))
  );

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const channelsByCategory = categories.reduce<
    Record<string, ServerChannel[]>
  >((acc, cat) => {
    acc[cat] = server.channels.filter((ch) => ch.category === cat);
    return acc;
  }, {});

  return (
    <div className="flex w-56 flex-col bg-[#12122a]">
      {/* Server header */}
      <div className="flex h-12 items-center justify-between border-b border-[#1E1B4B] px-4 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="truncate text-[15px] font-semibold text-white">
            {server.name}
          </h2>
          {server.companyId && (
            <div className="h-2 w-2 rounded-full bg-[#22C55E] shrink-0" title="Connected to Whop" />
          )}
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

      {/* Business scope badge */}
      {server.companyId && (
        <div className="mx-2 mt-2 rounded-md bg-[#4338CA]/10 border border-[#4338CA]/20 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#4338CA]">
            Whop Business
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500 font-mono truncate">
            {server.companyId}
          </p>
        </div>
      )}

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 scrollbar-hide">
        {categories.map((category) => (
          <div key={category} className="mb-4">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="group mb-1 flex w-full items-center gap-0.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 transition-colors duration-200 hover:text-gray-300"
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  collapsedCategories.has(category) ? "-rotate-90" : ""
                }`}
              />
              <span>{category}</span>
              <Plus
                size={14}
                className="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </button>

            {/* Channel items */}
            {!collapsedCategories.has(category) &&
              channelsByCategory[category].map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelChange(channel.id)}
                  className={`group mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ${
                    activeChannelId === channel.id
                      ? "bg-[#1E1B4B]/60 text-white"
                      : "text-gray-500 hover:bg-[#1E1B4B]/30 hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    {channel.type === "text" ? (
                      <Hash size={18} className="shrink-0 text-gray-500" />
                    ) : (
                      <Volume2 size={18} className="shrink-0 text-gray-500" />
                    )}
                  </div>
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
          </div>
        ))}
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
