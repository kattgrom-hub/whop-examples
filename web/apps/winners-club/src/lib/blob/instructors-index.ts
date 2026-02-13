import { put, head } from "@vercel/blob";

const BLOB_PATH = "instructors/index.json";

export interface InstructorEntry {
  name: string;
  avatarUrl: string;
  plan: "core" | "pro";
  categories: string[];
}

export interface InstructorsIndex {
  updatedAt: string;
  instructors: Record<string, InstructorEntry>; // keyed by companyId
  userMap: Record<string, string>; // userId → companyId
}

/**
 * Read the instructors index blob. Returns null if it doesn't exist yet.
 */
export async function readInstructorsIndex(): Promise<InstructorsIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    if (!meta) return null;
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as InstructorsIndex;
  } catch {
    return null;
  }
}

/**
 * Write the full instructors index blob (overwrites).
 */
export async function writeInstructorsIndex(
  index: InstructorsIndex
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
 * Upsert a single instructor entry in the index.
 * If userId is provided, also updates the userId → companyId map.
 */
export async function upsertInstructorEntry(
  companyId: string,
  entry: InstructorEntry,
  userId?: string
): Promise<void> {
  const index = (await readInstructorsIndex()) ?? {
    updatedAt: "",
    instructors: {},
    userMap: {},
  };
  if (!index.userMap) index.userMap = {};
  index.instructors[companyId] = entry;
  if (userId) index.userMap[userId] = companyId;
  await writeInstructorsIndex(index);
}

/**
 * Look up a companyId by userId. Returns null if not found.
 * This replaces the O(N) companies.list scan.
 */
export async function getCompanyIdByUserId(
  userId: string
): Promise<string | null> {
  const index = await readInstructorsIndex();
  return index?.userMap?.[userId] ?? null;
}

/**
 * Update specific fields on an instructor entry (partial update).
 */
export async function updateInstructorEntry(
  companyId: string,
  updates: Partial<InstructorEntry>
): Promise<void> {
  const index = (await readInstructorsIndex()) ?? {
    updatedAt: "",
    instructors: {},
    userMap: {},
  };
  const existing = index.instructors[companyId];
  if (!existing) return;
  index.instructors[companyId] = { ...existing, ...updates };
  await writeInstructorsIndex(index);
}

/**
 * Remove an instructor entry from the index.
 */
export async function removeFromInstructorsIndex(
  companyId: string
): Promise<void> {
  const index = (await readInstructorsIndex()) ?? {
    updatedAt: "",
    instructors: {},
    userMap: {},
  };
  delete index.instructors[companyId];
  await writeInstructorsIndex(index);
}

/**
 * Get a single instructor entry by companyId.
 */
export async function getInstructorEntry(
  companyId: string
): Promise<InstructorEntry | null> {
  const index = await readInstructorsIndex();
  return index?.instructors[companyId] ?? null;
}

/**
 * Get all company IDs from the instructors index.
 */
export async function getAllInstructorCompanyIds(): Promise<string[]> {
  const index = await readInstructorsIndex();
  if (!index) return [];
  return Object.keys(index.instructors);
}
