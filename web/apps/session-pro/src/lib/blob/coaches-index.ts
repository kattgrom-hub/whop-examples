import { put, head } from "@vercel/blob";

const BLOB_PATH = "coaches/index.json";

export interface CoachEntry {
  name: string;
  plan: "core" | "pro";
  categories: string[];
}

export interface CoachesIndex {
  updatedAt: string;
  coaches: Record<string, CoachEntry>; // keyed by companyId
  userMap: Record<string, string>; // userId → companyId
}

/**
 * Read the coaches index blob. Returns null if it doesn't exist yet.
 */
export async function readCoachesIndex(): Promise<CoachesIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    if (!meta) return null;
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as CoachesIndex;
  } catch {
    return null;
  }
}

/**
 * Write the full coaches index blob (overwrites).
 */
export async function writeCoachesIndex(
  index: CoachesIndex
): Promise<void> {
  index.updatedAt = new Date().toISOString();
  await put(BLOB_PATH, JSON.stringify(index), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
}

/**
 * Upsert a single coach entry in the index.
 * If userId is provided, also updates the userId → companyId map.
 */
export async function upsertCoachEntry(
  companyId: string,
  entry: CoachEntry,
  userId?: string
): Promise<void> {
  const index = (await readCoachesIndex()) ?? {
    updatedAt: "",
    coaches: {},
    userMap: {},
  };
  if (!index.userMap) index.userMap = {};
  index.coaches[companyId] = entry;
  if (userId) index.userMap[userId] = companyId;
  await writeCoachesIndex(index);
}

/**
 * Look up a companyId by userId. Returns null if not found.
 * This replaces the O(N) companies.list scan.
 */
export async function getCompanyIdByUserId(
  userId: string
): Promise<string | null> {
  const index = await readCoachesIndex();
  return index?.userMap?.[userId] ?? null;
}

/**
 * Update specific fields on a coach entry (partial update).
 */
export async function updateCoachEntry(
  companyId: string,
  updates: Partial<CoachEntry>
): Promise<void> {
  const index = (await readCoachesIndex()) ?? {
    updatedAt: "",
    coaches: {},
    userMap: {},
  };
  const existing = index.coaches[companyId];
  if (!existing) return;
  index.coaches[companyId] = { ...existing, ...updates };
  await writeCoachesIndex(index);
}

/**
 * Remove a coach entry from the index.
 */
export async function removeFromCoachesIndex(
  companyId: string
): Promise<void> {
  const index = (await readCoachesIndex()) ?? {
    updatedAt: "",
    coaches: {},
    userMap: {},
  };
  delete index.coaches[companyId];
  await writeCoachesIndex(index);
}

/**
 * Get a single coach entry by companyId.
 */
export async function getCoachEntry(
  companyId: string
): Promise<CoachEntry | null> {
  const index = await readCoachesIndex();
  return index?.coaches[companyId] ?? null;
}

/**
 * Get all company IDs from the coaches index.
 */
export async function getAllCoachCompanyIds(): Promise<string[]> {
  const index = await readCoachesIndex();
  if (!index) return [];
  return Object.keys(index.coaches);
}
