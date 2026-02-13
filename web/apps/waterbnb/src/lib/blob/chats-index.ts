import { storeRead, storeWrite } from "./storage";

const BLOB_PATH = "chats/index.json";

export interface ChatEntry {
  channelId: string;
  hostUserId: string;
  guestUserId: string;
  membershipId: string;
  boatTitle: string;
  createdAt: string;
}

export interface ChatsIndex {
  updatedAt: string;
  chats: ChatEntry[];
}

/**
 * Read the chats index from Vercel Blob Storage.
 */
export async function readChatsIndex(): Promise<ChatsIndex | null> {
  try {
    const raw = await storeRead(BLOB_PATH);
    if (!raw) return null;
    return JSON.parse(raw) as ChatsIndex;
  } catch {
    return null;
  }
}

/**
 * Write the chats index to Vercel Blob Storage.
 */
export async function writeChatsIndex(index: ChatsIndex): Promise<void> {
  await storeWrite(BLOB_PATH, JSON.stringify(index));
}

/**
 * Add a chat entry to the index.
 */
export async function addChatEntry(entry: ChatEntry): Promise<void> {
  const index = (await readChatsIndex()) ?? {
    updatedAt: new Date().toISOString(),
    chats: [],
  };

  // Avoid duplicates by membershipId
  const existing = index.chats.find((c) => c.membershipId === entry.membershipId);
  if (existing) return;

  index.chats.push(entry);
  index.updatedAt = new Date().toISOString();
  await writeChatsIndex(index);
}

/**
 * Get chat entries for a user (as host or guest).
 */
export async function getChatsForUser(userId: string): Promise<ChatEntry[]> {
  const index = await readChatsIndex();
  if (!index) return [];
  return index.chats.filter(
    (c) => c.hostUserId === userId || c.guestUserId === userId
  );
}
