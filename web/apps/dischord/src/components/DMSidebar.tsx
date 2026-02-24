"use client";

import { useCallback, useMemo } from "react";
import {
  DmsListElement,
  ChatSession,
  Elements,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";
import type {
  DmsListElementEvent,
  DmsListElementOptions,
} from "@whop/embedded-components-vanilla-js/types";
import { Plus, Mic, Headphones, Settings } from "lucide-react";

const elements = loadWhopElements();

interface DMSidebarProps {
  companyId: string;
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onNewDM: () => void;
  getToken: () => Promise<string>;
}

export default function DMSidebar({
  companyId,
  selectedChannelId,
  onChannelSelect,
  onNewDM,
  getToken,
}: DMSidebarProps) {
  const handleDmsEvent = useCallback(
    (event: DmsListElementEvent) => {
      if (event.type === "channelSelected") {
        onChannelSelect(event.detail.id);
      }
    },
    [onChannelSelect]
  );

  const dmsOptions: DmsListElementOptions = useMemo(
    () => ({
      companyId,
      selectedChannel: selectedChannelId ?? undefined,
      onEvent: handleDmsEvent,
    }),
    [companyId, selectedChannelId, handleDmsEvent]
  );

  return (
    <div className="flex w-56 flex-col bg-[#12122a]">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-[#1E1B4B] px-4 shadow-sm">
        <h2 className="text-[15px] font-semibold text-white">
          Direct Messages
        </h2>
        <button
          onClick={onNewDM}
          className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          title="New DM"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* DM List */}
      <div className="flex-1 overflow-hidden">
        <Elements elements={elements}>
          <ChatSession token={getToken}>
            <DmsListElement
              options={dmsOptions}
              style={{ height: "100%", width: "100%" }}
            />
          </ChatSession>
        </Elements>
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
