"use client";

import { useMemo, useCallback } from "react";
import {
  ChatElement,
  ChatSession,
  Elements,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";
import { Hash, MessageCircle } from "lucide-react";

const elements = loadWhopElements();

interface ChatAreaProps {
  channelId: string | null;
  channelName: string | null;
  companyId: string;
}

export default function ChatArea({
  channelId,
  channelName,
  companyId,
}: ChatAreaProps) {
  const getToken = useCallback(async (): Promise<string> => {
    const params = companyId ? `?companyId=${companyId}` : "";
    const res = await fetch(`/api/token${params}`);
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || "Failed to fetch token");
    }
    return data.token;
  }, [companyId]);

  const chatOptions = useMemo(() => {
    if (!channelId) return null;
    return { channelId };
  }, [channelId]);

  // No channel selected
  if (!chatOptions) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
        <div className="flex flex-col items-center gap-4 text-center px-8 max-w-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1B4B]">
            <MessageCircle size={40} className="text-[#4338CA]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Select a channel
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Pick a channel from the sidebar to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0F0F23]">
      {/* Channel header */}
      <div className="flex h-12 items-center border-b border-[#1E1B4B] px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Hash size={20} className="text-gray-500" />
          <h3 className="font-semibold text-white">{channelName}</h3>
          <div className="mx-2 h-6 w-px bg-[#1E1B4B]" />
          <p className="text-sm text-gray-500">
            Powered by Whop Chat
          </p>
        </div>
      </div>

      {/* Whop Chat */}
      <div className="flex-1 overflow-hidden">
        <Elements elements={elements}>
          <ChatSession token={getToken}>
            <ChatElement
              options={chatOptions}
              style={{ height: "100%", width: "100%" }}
            />
          </ChatSession>
        </Elements>
      </div>
    </div>
  );
}
