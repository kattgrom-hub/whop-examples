"use client";

import { useState, useCallback } from "react";
import type { ChatChannel } from "@/lib/channels";
import Sidebar from "./Sidebar";
import ChannelList from "./ChannelList";
import ChatArea from "./ChatArea";

interface DischordAppProps {
  companyId: string;
  channels: ChatChannel[];
}

export default function DischordApp({
  companyId,
  channels,
}: DischordAppProps) {
  const [activeChannelId, setActiveChannelId] = useState(
    channels[0]?.id ?? null
  );

  const handleChannelChange = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
  }, []);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <ChannelList
        channels={channels}
        activeChannelId={activeChannelId}
        onChannelChange={handleChannelChange}
      />
      <ChatArea
        channelId={activeChannelId}
        channelName={activeChannel?.name ?? null}
        companyId={companyId}
      />
    </div>
  );
}
