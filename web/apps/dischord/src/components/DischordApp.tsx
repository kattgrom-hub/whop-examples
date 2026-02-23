"use client";

import { useState, useCallback } from "react";
import type { Server } from "@/data/servers";
import Sidebar from "./Sidebar";
import ChannelList from "./ChannelList";
import ChatArea from "./ChatArea";
import MemberList from "./MemberList";

interface DischordAppProps {
  servers: Server[];
}

export default function DischordApp({ servers }: DischordAppProps) {
  const [activeServerId, setActiveServerId] = useState(servers[0]?.id || "1");

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  const [activeChannelId, setActiveChannelId] = useState(
    activeServer?.channels[0]?.id || null
  );

  const handleServerChange = useCallback(
    (serverId: string) => {
      setActiveServerId(serverId);
      const server = servers.find((s) => s.id === serverId);
      // Auto-select first channel when switching servers
      if (server?.channels[0]) {
        setActiveChannelId(server.channels[0].id);
      } else {
        setActiveChannelId(null);
      }
    },
    [servers]
  );

  const handleChannelChange = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        servers={servers}
        activeServerId={activeServerId}
        onServerChange={handleServerChange}
      />
      <ChannelList
        server={activeServer}
        activeChannelId={activeChannelId}
        onChannelChange={handleChannelChange}
      />
      <ChatArea
        channelId={activeChannelId}
        companyId={activeServer?.companyId || null}
        serverName={activeServer?.name || ""}
      />
      <MemberList />
    </div>
  );
}
