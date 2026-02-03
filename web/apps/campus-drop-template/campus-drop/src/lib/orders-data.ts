// Additional mock orders data
import type { Order } from "./data";

export const orders: Order[] = [
  {
    id: "ord_1",
    listingId: "2",
    listingTitle: "Vintage Nike Dunk Low - Size 9",
    listingImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    buyerId: "user_current",
    sellerId: "user2",
    price: 120,
    status: "delivered",
    createdAt: "2026-01-25",
    meetupLocation: "Bruin Plaza",
  },
  {
    id: "ord_2",
    listingId: "4",
    listingTitle: 'MacBook Pro 14" M3 Pro (2024)',
    listingImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    buyerId: "user_current",
    sellerId: "user4",
    price: 1400,
    status: "paid",
    createdAt: "2026-01-31",
    meetupLocation: "Engineering Building",
  },
  {
    id: "ord_3",
    listingId: "3",
    listingTitle: "Organic Chemistry Textbook (8th Edition)",
    listingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    buyerId: "user_current",
    sellerId: "user3",
    price: 45,
    status: "delivered",
    createdAt: "2026-01-20",
    meetupLocation: "Young Research Library",
  },
  {
    id: "ord_4",
    listingId: "7",
    listingTitle: "Patagonia Better Sweater - Size M",
    listingImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    buyerId: "user_current",
    sellerId: "user7",
    price: 65,
    status: "pending",
    createdAt: "2026-02-01",
  },
  {
    id: "ord_5",
    listingId: "6",
    listingTitle: "Harry Styles Concert Tickets - LA Forum",
    listingImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
    buyerId: "user_current",
    sellerId: "user6",
    price: 280,
    status: "shipped",
    createdAt: "2026-01-29",
    meetupLocation: "Student Center",
  },
  {
    id: "ord_6",
    listingId: "8",
    listingTitle: "iPad Air 5th Gen + Apple Pencil",
    listingImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    buyerId: "user_current",
    sellerId: "user8",
    price: 550,
    status: "cancelled",
    createdAt: "2026-01-22",
  },
];

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersByBuyer(buyerId: string): Order[] {
  return orders.filter((o) => o.buyerId === buyerId);
}

export function getOrdersBySeller(sellerId: string): Order[] {
  return orders.filter((o) => o.sellerId === sellerId);
}
