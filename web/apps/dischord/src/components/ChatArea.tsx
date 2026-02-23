"use client";

import { useMemo, useCallback } from "react";
import {
  ChatElement,
  ChatSession,
  Elements,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";
import { Hash, MessageCircle, Link2 } from "lucide-react";

const elements = loadWhopElements();

interface ChatAreaProps {
  channelId: string | null;
  companyId: string | null;
  serverName: string;
}

export default function ChatArea({
  channelId,
  companyId,
  serverName,
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

  // Server is not connected to a Whop business
  if (!companyId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
        <div className="flex flex-col items-center gap-4 text-center px-8 max-w-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1B4B]">
            <Link2 size={40} className="text-[#4338CA]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Connect {serverName}
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Each Dischord server is powered by a Whop business. Connect a
            business to enable live chat channels for this server.
          </p>
          <div className="mt-2 rounded-lg border border-[#1E1B4B] bg-[#12122a] p-4 text-left text-sm w-full">
            <p className="mb-2 font-semibold text-gray-400">
              How it works:
            </p>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#4338CA] shrink-0" />
                Each server maps to a Whop business (<code className="text-[#A78BFA]">companyId</code>)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#4338CA] shrink-0" />
                Channels are Whop chat channels (<code className="text-[#A78BFA]">channelId</code>)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#4338CA] shrink-0" />
                Business-scoped chats keep each server isolated
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Server connected but no channel selected or channel not a real Whop ID
  if (!chatOptions || !channelId?.startsWith("chat_")) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
        <div className="flex flex-col items-center gap-4 text-center px-8 max-w-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1B4B]">
            <MessageCircle size={40} className="text-[#4338CA]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {serverName}
          </h2>
          <p className="text-gray-400 leading-relaxed">
            This channel needs a Whop chat channel ID to display live chat. Add
            channel IDs to your server configuration to connect more channels.
          </p>
          <div className="mt-2 rounded-lg border border-[#1E1B4B] bg-[#12122a] p-4 text-left text-sm text-gray-500 w-full">
            <p className="mb-1 font-semibold text-gray-400">
              Channel format:
            </p>
            <code className="block text-xs leading-relaxed text-[#A78BFA]">
              chat_XXXXXXXXXXXXXX
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Real Whop chat channel — render ChatElement
  return (
    <div className="flex flex-1 flex-col bg-[#0F0F23]">
      {/* Channel header */}
      <div className="flex h-12 items-center border-b border-[#1E1B4B] px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Hash size={20} className="text-gray-500" />
          <h3 className="font-semibold text-white">
            {serverName.toLowerCase().replace(/\s+/g, "-")}
          </h3>
          <div className="mx-2 h-6 w-px bg-[#1E1B4B]" />
          <p className="text-sm text-gray-500">
            Business-scoped chat powered by Whop
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
