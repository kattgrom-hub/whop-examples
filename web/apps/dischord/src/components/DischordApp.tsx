"use client";

import { useState, useCallback } from "react";
import type { ChatChannel } from "@/lib/channels";
import type { Server } from "@/lib/servers";
import Sidebar, { type SidebarServer } from "./Sidebar";
import ChannelList from "./ChannelList";
import ChatArea from "./ChatArea";
import DMSidebar from "./DMSidebar";
import CreateServerModal from "./CreateServerModal";
import CreateDMModal from "./CreateDMModal";
import CreateChannelModal from "./CreateChannelModal";
import DiscoverPage from "./DiscoverPage";

type View = "server" | "dm" | "discover";

interface DischordAppProps {
  parentCompanyId: string;
  initialServers: Server[];
  initialChannels: ChatChannel[];
}

export default function DischordApp({
  parentCompanyId,
  initialServers,
  initialChannels,
}: DischordAppProps) {
  const [view, setView] = useState<View>("server");
  const [servers, setServers] = useState<SidebarServer[]>(() => [
    { id: parentCompanyId, name: "Dischord", isParent: true },
    ...initialServers.map((s) => ({
      id: s.id,
      name: s.name,
      isParent: false,
    })),
  ]);
  const [activeServerId, setActiveServerId] = useState(parentCompanyId);
  const [channels, setChannels] = useState(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(
    initialChannels[0]?.id ?? null
  );
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [dmChannelId, setDmChannelId] = useState<string | null>(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showCreateDM, setShowCreateDM] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const activeServer = servers.find((s) => s.id === activeServerId);
  const activeChannel =
    channels.find((c) => c.id === activeChannelId) ?? null;

  const fetchChannelsForServer = useCallback(async (companyId: string) => {
    setChannelsLoading(true);
    try {
      const res = await fetch(`/api/channels?companyId=${companyId}`);
      const data = await res.json();
      const fetched: ChatChannel[] = data.channels ?? [];
      setChannels(fetched);
      setActiveChannelId(fetched[0]?.id ?? null);
    } catch {
      setChannels([]);
      setActiveChannelId(null);
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  const handleServerSelect = useCallback(
    (serverId: string) => {
      setView("server");
      setActiveServerId(serverId);
      if (serverId !== activeServerId) {
        fetchChannelsForServer(serverId);
      }
    },
    [activeServerId, fetchChannelsForServer]
  );

  const handleChannelChange = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
  }, []);

  const handleDMClick = useCallback(() => {
    setView("dm");
    setDmChannelId(null);
  }, []);

  const handleDiscoverClick = useCallback(() => {
    setView("discover");
  }, []);

  const handleDMChannelSelect = useCallback((channelId: string) => {
    setDmChannelId(channelId);
  }, []);

  const handleCreateServer = useCallback(
    async (title: string, email?: string) => {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, email }),
      });
      if (!res.ok) throw new Error("Failed to create server");
      const data = await res.json();
      const newServer: SidebarServer = {
        id: data.server.id,
        name: data.server.name,
        isParent: false,
      };
      setServers((prev) => [...prev, newServer]);
      setShowCreateServer(false);
      setView("server");
      setActiveServerId(newServer.id);
      fetchChannelsForServer(newServer.id);
    },
    [fetchChannelsForServer]
  );

  const handleCreateDM = useCallback(
    async (userIds: string[]) => {
      const res = await fetch("/api/dm-channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, companyId: parentCompanyId }),
      });
      if (!res.ok) throw new Error("Failed to create DM channel");
      const data = await res.json();
      setDmChannelId(data.channelId);
      setShowCreateDM(false);
    },
    [parentCompanyId]
  );

  const handleCreateChannel = useCallback(
    async (name: string) => {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyId: activeServerId }),
      });
      if (!res.ok) throw new Error("Failed to create channel");
      const data = await res.json();
      const newChannel: ChatChannel = data.channel;
      setChannels((prev) => [...prev, newChannel]);
      setActiveChannelId(newChannel.id);
      setShowCreateChannel(false);
    },
    [activeServerId]
  );

  const getToken = useCallback(async (): Promise<string> => {
    const res = await fetch(`/api/token?companyId=${parentCompanyId}`);
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || "Failed to fetch token");
    }
    return data.token;
  }, [parentCompanyId]);

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar
          servers={servers}
          activeServerId={activeServerId}
          isDMView={view === "dm"}
          isDiscoverView={view === "discover"}
          onServerSelect={handleServerSelect}
          onDMClick={handleDMClick}
          onAddServer={() => setShowCreateServer(true)}
          onDiscoverClick={handleDiscoverClick}
        />

        {view === "discover" ? (
          <DiscoverPage />
        ) : view === "dm" ? (
          <>
            <DMSidebar
              companyId={parentCompanyId}
              selectedChannelId={dmChannelId}
              onChannelSelect={handleDMChannelSelect}
              onNewDM={() => setShowCreateDM(true)}
              getToken={getToken}
            />
            <ChatArea
              channelId={dmChannelId}
              channelName={null}
              companyId={parentCompanyId}
              isDM
            />
          </>
        ) : (
          <>
            <ChannelList
              serverName={activeServer?.name ?? "Server"}
              channels={channels}
              activeChannelId={activeChannelId}
              onChannelChange={handleChannelChange}
              onCreateChannel={() => setShowCreateChannel(true)}
              loading={channelsLoading}
            />
            <ChatArea
              channelId={activeChannelId}
              channelName={activeChannel?.name ?? null}
              companyId={activeServerId}
            />
          </>
        )}
      </div>

      {showCreateServer && (
        <CreateServerModal
          onClose={() => setShowCreateServer(false)}
          onCreate={handleCreateServer}
        />
      )}

      {showCreateDM && (
        <CreateDMModal
          onClose={() => setShowCreateDM(false)}
          onCreate={handleCreateDM}
        />
      )}

      {showCreateChannel && (
        <CreateChannelModal
          onClose={() => setShowCreateChannel(false)}
          onCreate={handleCreateChannel}
        />
      )}
    </>
  );
}
