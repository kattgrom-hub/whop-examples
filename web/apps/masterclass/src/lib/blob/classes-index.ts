import { put, head } from "@vercel/blob";

const BLOB_PATH = "classes/index.json";

export interface ClassIndexEntry {
  id: string;
  companyId: string;
  instructorName: string;
  instructorLogo: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  categories: string[];
  visibility: "visible" | "hidden";
}

export interface ClassesIndex {
  updatedAt: string;
  classes: ClassIndexEntry[];
}

/**
 * Read the classes index from Vercel Blob Storage.
 * Returns null if the blob does not exist yet.
 */
export async function readClassesIndex(): Promise<ClassesIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as ClassesIndex;
  } catch {
    // Blob not found or fetch failed
    return null;
  }
}

/**
 * Write the classes index to Vercel Blob Storage.
 * Overwrites the existing blob at the fixed path.
 */
export async function writeClassesIndex(
  index: ClassesIndex,
): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(index), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/**
 * Add or update a class entry in the index, then persist.
 * If the class already exists (by id), it is replaced.
 */
export async function upsertClass(
  entry: ClassIndexEntry,
): Promise<void> {
  const index = (await readClassesIndex()) ?? {
    updatedAt: new Date().toISOString(),
    classes: [],
  };
  const idx = index.classes.findIndex((s) => s.id === entry.id);
  if (idx >= 0) {
    index.classes[idx] = entry;
  } else {
    index.classes.push(entry);
  }
  index.updatedAt = new Date().toISOString();
  await writeClassesIndex(index);
}

/**
 * Remove a class from the index by id, then persist.
 * "Remove" sets visibility to "hidden" so it stops appearing in browse results,
 * matching the Whop product soft-delete pattern.
 */
export async function removeClass(classId: string): Promise<void> {
  const index = await readClassesIndex();
  if (!index) return;
  const cls = index.classes.find((s) => s.id === classId);
  if (cls) {
    cls.visibility = "hidden";
    index.updatedAt = new Date().toISOString();
    await writeClassesIndex(index);
  }
}
