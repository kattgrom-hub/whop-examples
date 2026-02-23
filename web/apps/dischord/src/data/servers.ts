/**
 * Dischord Server Architecture
 *
 * Each "server" in Dischord maps to a Whop business (companyId).
 * Channels within a server are Whop chat channels (channelId).
 * Business-scoped chats mean each server has its own isolated chat space.
 */

export interface ServerChannel {
  id: string; // Whop chat channel ID (chat_xxx) or placeholder
  name: string;
  type: "text" | "voice";
  category: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  companyId: string | null; // Whop business ID (biz_xxx) — null means not connected
  channels: ServerChannel[];
}

/**
 * Build the server list from environment variables.
 * The first server uses NEXT_PUBLIC_WHOP_COMPANY_ID + NEXT_PUBLIC_WHOP_CHAT_CHANNEL_ID.
 * Additional servers demonstrate the multi-business concept.
 */
export function getServers(): Server[] {
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || null;
  const defaultChannelId =
    process.env.NEXT_PUBLIC_WHOP_CHAT_CHANNEL_ID || null;

  return [
    {
      id: "1",
      name: "Producer Hub",
      icon: "PH",
      companyId,
      channels: [
        {
          id: defaultChannelId || "general",
          name: "general",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "collabs",
          name: "collabs",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "feedback",
          name: "feedback",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "drops",
          name: "drops",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "studio-a",
          name: "Studio A",
          type: "voice",
          category: "Voice Channels",
        },
        {
          id: "mixing-room",
          name: "Mixing Room",
          type: "voice",
          category: "Voice Channels",
        },
      ],
    },
    {
      id: "2",
      name: "Vocalist Lounge",
      icon: "VL",
      companyId: null, // Connect a second Whop business
      channels: [
        {
          id: "vl-general",
          name: "general",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "vl-sessions",
          name: "sessions",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "vl-warm-up",
          name: "Warm Up Room",
          type: "voice",
          category: "Voice Channels",
        },
      ],
    },
    {
      id: "3",
      name: "Beat Market",
      icon: "BM",
      companyId: null,
      channels: [
        {
          id: "bm-general",
          name: "general",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "bm-listings",
          name: "listings",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "bm-preview",
          name: "Preview Room",
          type: "voice",
          category: "Voice Channels",
        },
      ],
    },
    {
      id: "4",
      name: "A&R Network",
      icon: "AR",
      companyId: null,
      channels: [
        {
          id: "ar-general",
          name: "general",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "ar-submissions",
          name: "submissions",
          type: "text",
          category: "Text Channels",
        },
      ],
    },
    {
      id: "5",
      name: "Sample Library",
      icon: "SL",
      companyId: null,
      channels: [
        {
          id: "sl-general",
          name: "general",
          type: "text",
          category: "Text Channels",
        },
        {
          id: "sl-packs",
          name: "packs",
          type: "text",
          category: "Text Channels",
        },
      ],
    },
  ];
}
