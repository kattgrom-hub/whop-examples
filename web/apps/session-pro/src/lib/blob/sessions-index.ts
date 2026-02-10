import { put, head } from "@vercel/blob";

const BLOB_PATH = "sessions/index.json";

export interface SessionIndexEntry {
  id: string;
  companyId: string;
  coachName: string;
  coachLogo: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  categories: string[];
  visibility: "visible" | "hidden";
}

export interface SessionsIndex {
  updatedAt: string;
  sessions: SessionIndexEntry[];
}

/**
 * Read the sessions index from Vercel Blob Storage.
 * Returns null if the blob does not exist yet.
 */
export async function readSessionsIndex(): Promise<SessionsIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as SessionsIndex;
  } catch {
    // Blob not found or fetch failed
    return null;
  }
}

/**
 * Write the sessions index to Vercel Blob Storage.
 * Overwrites the existing blob at the fixed path.
 */
export async function writeSessionsIndex(
  index: SessionsIndex,
): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(index), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/**
 * Add or update a session entry in the index, then persist.
 * If the session already exists (by id), it is replaced.
 */
export async function upsertSession(
  entry: SessionIndexEntry,
): Promise<void> {
  const index = (await readSessionsIndex()) ?? {
    updatedAt: new Date().toISOString(),
    sessions: [],
  };
  const idx = index.sessions.findIndex((s) => s.id === entry.id);
  if (idx >= 0) {
    index.sessions[idx] = entry;
  } else {
    index.sessions.push(entry);
  }
  index.updatedAt = new Date().toISOString();
  await writeSessionsIndex(index);
}

/**
 * Remove a session from the index by id, then persist.
 * "Remove" sets visibility to "hidden" so it stops appearing in browse results,
 * matching the Whop product soft-delete pattern.
 */
export async function removeSession(sessionId: string): Promise<void> {
  const index = await readSessionsIndex();
  if (!index) return;
  const session = index.sessions.find((s) => s.id === sessionId);
  if (session) {
    session.visibility = "hidden";
    index.updatedAt = new Date().toISOString();
    await writeSessionsIndex(index);
  }
}
