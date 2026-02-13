import { put, head } from "@vercel/blob";

const BLOB_PATH = "hosts/index.json";

export interface HostEntry {
  name: string;
  avatarUrl: string;
  plan: "core" | "pro";
  categories: string[];
}

export interface HostsIndex {
  updatedAt: string;
  hosts: Record<string, HostEntry>; // keyed by companyId
  userMap: Record<string, string>; // userId → companyId
}

/**
 * Read the hosts index blob. Returns null if it doesn't exist yet.
 */
export async function readHostsIndex(): Promise<HostsIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    if (!meta) return null;
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as HostsIndex;
  } catch {
    return null;
  }
}

/**
 * Write the full hosts index blob (overwrites).
 */
export async function writeHostsIndex(
  index: HostsIndex
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
 * Upsert a single host entry in the index.
 * If userId is provided, also updates the userId → companyId map.
 */
export async function upsertHostEntry(
  companyId: string,
  entry: HostEntry,
  userId?: string
): Promise<void> {
  const index = (await readHostsIndex()) ?? {
    updatedAt: "",
    hosts: {},
    userMap: {},
  };
  if (!index.userMap) index.userMap = {};
  index.hosts[companyId] = entry;
  if (userId) index.userMap[userId] = companyId;
  await writeHostsIndex(index);
}

/**
 * Look up a companyId by userId. Returns null if not found.
 */
export async function getCompanyIdByUserId(
  userId: string
): Promise<string | null> {
  const index = await readHostsIndex();
  return index?.userMap?.[userId] ?? null;
}

/**
 * Update specific fields on a host entry (partial update).
 */
export async function updateHostEntry(
  companyId: string,
  updates: Partial<HostEntry>
): Promise<void> {
  const index = (await readHostsIndex()) ?? {
    updatedAt: "",
    hosts: {},
    userMap: {},
  };
  const existing = index.hosts[companyId];
  if (!existing) return;
  index.hosts[companyId] = { ...existing, ...updates };
  await writeHostsIndex(index);
}

/**
 * Remove a host entry from the index.
 */
export async function removeFromHostsIndex(
  companyId: string
): Promise<void> {
  const index = (await readHostsIndex()) ?? {
    updatedAt: "",
    hosts: {},
    userMap: {},
  };
  delete index.hosts[companyId];
  await writeHostsIndex(index);
}

/**
 * Get a single host entry by companyId.
 */
export async function getHostEntry(
  companyId: string
): Promise<HostEntry | null> {
  const index = await readHostsIndex();
  return index?.hosts[companyId] ?? null;
}

/**
 * Get all company IDs from the hosts index.
 */
export async function getAllHostCompanyIds(): Promise<string[]> {
  const index = await readHostsIndex();
  if (!index) return [];
  return Object.keys(index.hosts);
}

/**
 * Reverse lookup: get userId from companyId.
 */
export async function getUserIdByCompanyId(
  companyId: string
): Promise<string | null> {
  const index = await readHostsIndex();
  if (!index?.userMap) return null;
  for (const [userId, cId] of Object.entries(index.userMap)) {
    if (cId === companyId) return userId;
  }
  return null;
}
