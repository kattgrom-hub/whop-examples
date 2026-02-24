"use client";

import { useState, useCallback } from "react";
import type { ChatChannel } from "@/lib/channels";
import Sidebar from "./Sidebar";
import type { View } from "./Sidebar";
import ChannelList from "./ChannelList";
import ChatArea from "./ChatArea";
import DiscoverPage from "./DiscoverPage";
import DmsView from "./DmsView";

interface DischordAppProps {
  companyId: string;
  channels: ChatChannel[];
}

export default function DischordApp({
  companyId,
  channels,
}: DischordAppProps) {
  const [activeView, setActiveView] = useState<View>("channels");
  const [activeChannelId, setActiveChannelId] = useState(
    channels[0]?.id ?? null
  );

  const handleChannelChange = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
  }, []);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {activeView === "channels" && (
        <>
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
        </>
      )}

      {activeView === "discover" && <DiscoverPage />}

      {activeView === "dms" && <DmsView companyId={companyId} />}
    </div>
  );
}
