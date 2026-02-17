import { put, head } from "@vercel/blob";

export interface BookingRecord {
  id: string; // membership ID
  userId: string;
  instructorId: string;
  instructorName: string;
  title: string;
  date: string;
  time: string;
  timeSlot: string;
  duration: number;
  type: string;
  productId?: string;
  canceledAt?: string;
  createdAt: string;
}

interface UserBookings {
  updatedAt: string;
  bookings: BookingRecord[];
}

function blobPath(userId: string): string {
  return `bookings/by-user/${userId}.json`;
}

/**
 * Read all bookings for a user from blob storage.
 */
export async function getBookingsByUser(
  userId: string
): Promise<BookingRecord[]> {
  try {
    const meta = await head(blobPath(userId));
    const res = await fetch(meta.url);
    if (!res.ok) return [];
    const data = (await res.json()) as UserBookings;
    return data.bookings;
  } catch {
    return [];
  }
}

/**
 * Add a booking record for a user. Deduplicates by booking id.
 */
export async function addBooking(booking: BookingRecord): Promise<void> {
  const existing = await getBookingsByUser(booking.userId);
  const idx = existing.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    existing[idx] = booking;
  } else {
    existing.push(booking);
  }
  const data: UserBookings = {
    updatedAt: new Date().toISOString(),
    bookings: existing,
  };
  await put(blobPath(booking.userId), JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
