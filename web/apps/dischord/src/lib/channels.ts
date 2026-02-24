import Whop from "@whop/sdk";

export interface ChatChannel {
  id: string;
  name: string;
}

/**
 * Fetch real chat channels for the configured company from the Whop API.
 * This runs server-side only (uses WHOP_API_KEY).
 */
export async function fetchChannels(
  companyId: string
): Promise<ChatChannel[]> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) return [];

  const whop = new Whop({ apiKey });
  const channels: ChatChannel[] = [];

  for await (const ch of whop.chatChannels.list({
    company_id: companyId,
  })) {
    channels.push({
      id: ch.id,
      name: ch.experience.name,
    });
  }

  return channels;
}
