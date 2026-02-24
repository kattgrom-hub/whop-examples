"use client";

import { Plus, Compass } from "lucide-react";

export interface SidebarServer {
  id: string;
  name: string;
  isParent: boolean;
}

interface SidebarProps {
  servers: SidebarServer[];
  activeServerId: string | null;
  isDMView: boolean;
  isDiscoverView: boolean;
  onServerSelect: (serverId: string) => void;
  onDMClick: () => void;
  onAddServer: () => void;
  onDiscoverClick: () => void;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({
  servers,
  activeServerId,
  isDMView,
  isDiscoverView,
  onServerSelect,
  onDMClick,
  onAddServer,
  onDiscoverClick,
}: SidebarProps) {
  return (
    <div className="flex w-[72px] flex-col items-center gap-2 bg-[#0a0a1a] py-3 overflow-y-auto scrollbar-hide">
      {/* Home / DM button */}
      <button
        onClick={onDMClick}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-[24px] text-white transition-all duration-200 hover:rounded-[16px] hover:bg-[#4338CA] ${
          isDMView ? "rounded-[16px] bg-[#4338CA]" : "bg-[#1E1B4B]"
        }`}
        title="Direct Messages"
      >
        {isDMView && (
          <div className="absolute -left-1 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200 h-10" />
        )}
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
          <path
            d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0292 1.4184C10.8251 0.934541 10.5765 0.461742 10.3416 0C8.49019 0.321226 6.68494 0.884344 4.97287 1.68377C1.09328 7.44983 0.00667861 13.0693 0.553337 18.6058C2.69935 20.1712 4.90447 21.1342 7.07169 21.7596C7.60502 21.039 8.07973 20.2746 8.48987 19.4724C7.72082 19.1901 6.97554 18.8463 6.26194 18.4438C6.44323 18.3109 6.62116 18.1724 6.79235 18.0339C11.7944 20.3624 17.2655 20.3624 22.2078 18.0339C22.3816 18.1724 22.5596 18.3109 22.7382 18.4438C22.0219 18.849 21.274 19.1955 20.5023 19.4751C20.9153 20.2773 21.3873 21.0417 21.9206 21.7623C24.0905 21.1369 26.2983 20.1739 28.4443 18.6058C29.0907 12.1276 27.4741 6.55945 23.0212 1.67671ZM9.68041 15.2608C8.2507 15.2608 7.07511 13.9396 7.07511 12.3258C7.07511 10.712 8.22422 9.38833 9.68041 9.38833C11.1366 9.38833 12.3122 10.7093 12.2856 12.3258C12.2856 13.9396 11.1339 15.2608 9.68041 15.2608ZM19.3198 15.2608C17.8901 15.2608 16.7145 13.9396 16.7145 12.3258C16.7145 10.712 17.8636 9.38833 19.3198 9.38833C20.776 9.38833 21.9516 10.7093 21.925 12.3258C21.925 13.9396 20.776 15.2608 19.3198 15.2608Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Separator */}
      <div className="mx-auto h-[2px] w-8 rounded-full bg-[#1E1B4B]" />

      {/* Server list */}
      {servers.map((server) => {
        const isActive = !isDMView && !isDiscoverView && activeServerId === server.id;
        return (
          <div key={server.id} className="group relative">
            {isActive && (
              <div className="absolute -left-1 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200 h-10" />
            )}
            {server.isParent && (
              <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a1a] bg-[#22C55E] z-10" />
            )}
            <button
              onClick={() => onServerSelect(server.id)}
              className={`flex h-12 w-12 items-center justify-center text-sm font-semibold text-white transition-all duration-200 ${
                isActive
                  ? "rounded-[16px] bg-[#4338CA]"
                  : "rounded-[24px] bg-[#1E1B4B] hover:rounded-[16px] hover:bg-[#4338CA]"
              }`}
              title={server.name}
            >
              {getInitials(server.name)}
            </button>
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-4 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#18182f] px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {server.name}
            </div>
          </div>
        );
      })}

      {/* Separator */}
      <div className="mx-auto h-[2px] w-8 rounded-full bg-[#1E1B4B]" />

      {/* Add server */}
      <button
        onClick={onAddServer}
        className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#1E1B4B] text-[#22C55E] transition-all duration-200 hover:rounded-[16px] hover:bg-[#22C55E] hover:text-white"
        title="Add a Server"
      >
        <Plus size={24} />
      </button>

      {/* Discover */}
      <button
        onClick={onDiscoverClick}
        className={`flex h-12 w-12 items-center justify-center rounded-[24px] text-[#22C55E] transition-all duration-200 hover:rounded-[16px] hover:bg-[#22C55E] hover:text-white ${
          isDiscoverView ? "rounded-[16px] bg-[#22C55E] text-white" : "bg-[#1E1B4B]"
        }`}
        title="Discover Communities"
      >
        <Compass size={24} />
      </button>
    </div>
  );
}
