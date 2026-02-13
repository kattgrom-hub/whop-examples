import { put, head } from "@vercel/blob";

const BLOB_PATH = "boats/index.json";

export interface BoatIndexEntry {
  id: string;
  companyId: string;
  hostName: string;
  hostLogo: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  boatType: string;
  pricePerTrip: number;
  availableDates: string[];
  categories: string[];
  visibility: "visible" | "hidden";
}

export interface BoatsIndex {
  updatedAt: string;
  boats: BoatIndexEntry[];
}

/**
 * Read the boats index from Vercel Blob Storage.
 * Returns null if the blob does not exist yet.
 */
export async function readBoatsIndex(): Promise<BoatsIndex | null> {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as BoatsIndex;
  } catch {
    // Blob not found or fetch failed
    return null;
  }
}

/**
 * Write the boats index to Vercel Blob Storage.
 * Overwrites the existing blob at the fixed path.
 */
export async function writeBoatsIndex(
  index: BoatsIndex,
): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(index), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/**
 * Add or update a boat entry in the index, then persist.
 * If the boat already exists (by id), it is replaced.
 */
export async function upsertBoat(
  entry: BoatIndexEntry,
): Promise<void> {
  const index = (await readBoatsIndex()) ?? {
    updatedAt: new Date().toISOString(),
    boats: [],
  };
  const idx = index.boats.findIndex((s) => s.id === entry.id);
  if (idx >= 0) {
    index.boats[idx] = entry;
  } else {
    index.boats.push(entry);
  }
  index.updatedAt = new Date().toISOString();
  await writeBoatsIndex(index);
}

/**
 * Remove a booked date from a boat's available dates.
 * If no dates remain, sets visibility to "hidden".
 */
export async function removeBookedDate(boatId: string, date: string): Promise<void> {
  const index = await readBoatsIndex();
  if (!index) return;
  const boat = index.boats.find((b) => b.id === boatId);
  if (!boat) return;

  boat.availableDates = boat.availableDates.filter((d) => d !== date);
  if (boat.availableDates.length === 0) {
    boat.visibility = "hidden";
  }
  index.updatedAt = new Date().toISOString();
  await writeBoatsIndex(index);
}

/**
 * Remove a boat from the index by id (soft-delete: sets visibility to "hidden").
 */
export async function removeBoat(boatId: string): Promise<void> {
  const index = await readBoatsIndex();
  if (!index) return;
  const boat = index.boats.find((s) => s.id === boatId);
  if (boat) {
    boat.visibility = "hidden";
    index.updatedAt = new Date().toISOString();
    await writeBoatsIndex(index);
  }
}

/**
 * Add new available dates to an existing boat listing.
 */
export async function addBoatDates(boatId: string, dates: string[]): Promise<void> {
  const index = await readBoatsIndex();
  if (!index) return;
  const boat = index.boats.find((b) => b.id === boatId);
  if (!boat) return;

  const existing = new Set(boat.availableDates);
  for (const d of dates) {
    existing.add(d);
  }
  boat.availableDates = [...existing].sort();
  if (boat.visibility === "hidden" && boat.availableDates.length > 0) {
    boat.visibility = "visible";
  }
  index.updatedAt = new Date().toISOString();
  await writeBoatsIndex(index);
}
