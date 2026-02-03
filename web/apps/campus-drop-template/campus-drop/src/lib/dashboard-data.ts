// Mock data for user dashboard
import type { Order, Listing } from "./data";

export type Sale = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  price: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  createdAt: string;
  meetupLocation?: string;
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
};

export const mockUserListings: Listing[] = [
  {
    id: "u1",
    sellerId: "currentUser",
    sellerName: "You",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=currentuser",
    sellerRating: 4.8,
    title: "Wireless Noise Cancelling Headphones",
    description: "Sony WH-1000XM4 headphones. Amazing sound quality and noise cancellation. Battery lasts forever. Selling because I got the XM5s.",
    category: "electronics",
    price: 180,
    originalPrice: 350,
    condition: "like_new",
    images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"],
    campus: "UCLA",
    status: "active",
    createdAt: "2026-01-28",
    views: 89,
    saves: 12,
  },
  {
    id: "u2",
    sellerId: "currentUser",
    sellerName: "You",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=currentuser",
    sellerRating: 4.8,
    title: "Introduction to Psychology Textbook",
    description: "Psych 101 textbook, latest edition. Barely used it because I switched majors. No highlights or marks.",
    category: "textbooks",
    price: 40,
    originalPrice: 120,
    condition: "like_new",
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800"],
    campus: "UCLA",
    status: "active",
    createdAt: "2026-01-30",
    views: 45,
    saves: 5,
  },
  {
    id: "u3",
    sellerId: "currentUser",
    sellerName: "You",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=currentuser",
    sellerRating: 4.8,
    title: "Supreme Box Logo Hoodie - Black",
    description: "Authentic Supreme FW22 box logo hoodie. Size L. Worn twice. Has receipt and tags.",
    category: "fashion",
    price: 350,
    condition: "like_new",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
    campus: "UCLA",
    status: "sold",
    createdAt: "2026-01-15",
    views: 234,
    saves: 45,
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    listingId: "2",
    listingTitle: "Vintage Nike Dunk Low - Size 9",
    listingImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    buyerId: "currentUser",
    sellerId: "user2",
    price: 120,
    status: "delivered",
    createdAt: "2026-01-25",
    meetupLocation: "Bruin Plaza",
  },
  {
    id: "o2",
    listingId: "4",
    listingTitle: 'MacBook Pro 14" M3 Pro (2024)',
    listingImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    buyerId: "currentUser",
    sellerId: "user4",
    price: 1400,
    status: "paid",
    createdAt: "2026-01-31",
    meetupLocation: "Engineering Building",
  },
  {
    id: "o3",
    listingId: "3",
    listingTitle: "Organic Chemistry Textbook (8th Edition)",
    listingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    buyerId: "currentUser",
    sellerId: "user3",
    price: 45,
    status: "delivered",
    createdAt: "2026-01-20",
    meetupLocation: "Young Research Library",
  },
];

export const mockSales: Sale[] = [
  {
    id: "s1",
    listingId: "u3",
    listingTitle: "Supreme Box Logo Hoodie - Black",
    listingImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    buyerId: "user10",
    buyerName: "Chris Wilson",
    buyerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chris",
    price: 350,
    status: "completed",
    createdAt: "2026-01-18",
    meetupLocation: "Ackerman Union",
  },
  {
    id: "s2",
    listingId: "u4",
    listingTitle: "TI-84 Plus Calculator",
    listingImage: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800",
    buyerId: "user11",
    buyerName: "Ashley Thompson",
    buyerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ashley",
    price: 50,
    status: "completed",
    createdAt: "2026-01-10",
    meetupLocation: "Math Sciences Building",
  },
  {
    id: "s3",
    listingId: "u1",
    listingTitle: "Wireless Noise Cancelling Headphones",
    listingImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    buyerId: "user12",
    buyerName: "Jamie Santos",
    buyerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
    price: 180,
    status: "paid",
    createdAt: "2026-02-01",
    meetupLocation: "TBD",
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "p1",
    amount: 350,
    status: "completed",
    date: "2026-01-20",
    method: "Bank Account ****4242",
  },
  {
    id: "p2",
    amount: 50,
    status: "completed",
    date: "2026-01-12",
    method: "Bank Account ****4242",
  },
  {
    id: "p3",
    amount: 180,
    status: "pending",
    date: "2026-02-02",
    method: "Bank Account ****4242",
  },
];

export const mockEarnings = {
  availableBalance: 180,
  pendingBalance: 162, // After platform fee
  totalEarned: 580,
  thisMonth: 180,
  lastMonth: 400,
};

export const mockStats = {
  totalListings: 3,
  activeListings: 2,
  totalSales: 3,
  totalOrders: 3,
  totalViews: 368,
  totalSaves: 62,
};
