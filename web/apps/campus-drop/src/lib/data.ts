export type Listing = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  title: string;
  description: string;
  category: "tickets" | "fashion" | "textbooks" | "electronics" | "furniture" | "other";
  price: number;
  originalPrice?: number;
  condition: "new" | "like_new" | "good" | "fair";
  images: string[];
  campus: string;
  status: "active" | "sold" | "reserved";
  createdAt: string;
  views: number;
  saves: number;
};

export type Order = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  meetupLocation?: string;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  campus: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
  listingsCount: number;
  salesCount: number;
  verified: boolean;
};

export const categories = [
  { id: "tickets", name: "Tickets", icon: "ticket" },
  { id: "fashion", name: "Fashion", icon: "shirt" },
  { id: "textbooks", name: "Textbooks", icon: "book" },
  { id: "electronics", name: "Electronics", icon: "laptop" },
  { id: "furniture", name: "Furniture", icon: "chair" },
  { id: "other", name: "Other", icon: "package" },
] as const;

export const campuses = [
  "UCLA",
  "USC",
  "Stanford",
  "UC Berkeley",
  "UCSD",
  "Cal Poly",
  "UCSB",
  "UCI",
];

export const conditionLabels: Record<Listing["condition"], { label: string; color: string }> = {
  new: { label: "New", color: "bg-green-500/20 text-green-400" },
  like_new: { label: "Like New", color: "bg-blue-500/20 text-blue-400" },
  good: { label: "Good", color: "bg-yellow-500/20 text-yellow-400" },
  fair: { label: "Fair", color: "bg-orange-500/20 text-orange-400" },
};

export const listings: Listing[] = [
  {
    id: "1",
    sellerId: "user1",
    sellerName: "Jake Martinez",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jake",
    sellerRating: 4.9,
    title: "UCLA vs USC Football Tickets (2 tickets)",
    description: "Two tickets for the big rivalry game! Section 12, Row F. Can't make it anymore due to travel plans. These are prime seats near midfield. Will transfer via Ticketmaster.",
    category: "tickets",
    price: 150,
    originalPrice: 200,
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    ],
    campus: "UCLA",
    status: "active",
    createdAt: "2026-01-28",
    views: 234,
    saves: 45,
  },
  {
    id: "2",
    sellerId: "user2",
    sellerName: "Emma Chen",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emma",
    sellerRating: 5.0,
    title: "Vintage Nike Dunk Low - Size 9",
    description: "Authentic Nike Dunk Low in great condition. Only worn a handful of times. Comes with original box. Perfect for sneakerheads looking for a classic style.",
    category: "fashion",
    price: 120,
    condition: "like_new",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    ],
    campus: "USC",
    status: "active",
    createdAt: "2026-01-29",
    views: 189,
    saves: 67,
  },
  {
    id: "3",
    sellerId: "user3",
    sellerName: "Marcus Johnson",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcus",
    sellerRating: 4.8,
    title: "Organic Chemistry Textbook (8th Edition)",
    description: "McMurry Organic Chemistry textbook, 8th edition. Some highlighting but in great shape overall. Perfect for Chem 14C or 30A. Save hundreds compared to bookstore prices!",
    category: "textbooks",
    price: 45,
    originalPrice: 180,
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    ],
    campus: "UCLA",
    status: "active",
    createdAt: "2026-01-30",
    views: 156,
    saves: 23,
  },
  {
    id: "4",
    sellerId: "user4",
    sellerName: "Sophie Williams",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sophie",
    sellerRating: 4.7,
    title: 'MacBook Pro 14" M3 Pro (2024)',
    description: "Selling my MacBook Pro as I upgraded to the M3 Max. 18GB RAM, 512GB SSD. AppleCare+ until 2027. Includes original charger and box. Battery health at 98%.",
    category: "electronics",
    price: 1400,
    originalPrice: 1999,
    condition: "like_new",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
    ],
    campus: "Stanford",
    status: "active",
    createdAt: "2026-01-27",
    views: 412,
    saves: 89,
  },
  {
    id: "5",
    sellerId: "user5",
    sellerName: "Alex Kim",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alexk",
    sellerRating: 4.6,
    title: "IKEA MALM Desk - White",
    description: "Moving out and need to sell my desk. IKEA MALM in white, 55\" wide. Minor scratches but overall good condition. You need to pick up from my apartment near campus.",
    category: "furniture",
    price: 60,
    originalPrice: 180,
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    ],
    campus: "UC Berkeley",
    status: "active",
    createdAt: "2026-01-26",
    views: 98,
    saves: 12,
  },
  {
    id: "6",
    sellerId: "user6",
    sellerName: "Taylor Park",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=taylor",
    sellerRating: 4.9,
    title: "Harry Styles Concert Tickets - LA Forum",
    description: "Selling 2 tickets to Harry Styles at the Kia Forum. Floor seats, amazing view! Unfortunately have a final that day. Price is for both tickets.",
    category: "tickets",
    price: 280,
    originalPrice: 350,
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
    ],
    campus: "UCLA",
    status: "active",
    createdAt: "2026-01-31",
    views: 567,
    saves: 134,
  },
  {
    id: "7",
    sellerId: "user7",
    sellerName: "Jordan Lee",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jordan",
    sellerRating: 4.5,
    title: "Patagonia Better Sweater - Size M",
    description: "Classic Patagonia quarter-zip in navy blue. Perfect for those cold lecture halls. Worn maybe 5 times, no issues. Great for layering.",
    category: "fashion",
    price: 65,
    originalPrice: 139,
    condition: "like_new",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    campus: "UCSD",
    status: "active",
    createdAt: "2026-01-25",
    views: 145,
    saves: 28,
  },
  {
    id: "8",
    sellerId: "user8",
    sellerName: "Casey Rivera",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=casey",
    sellerRating: 4.8,
    title: "iPad Air 5th Gen + Apple Pencil",
    description: "iPad Air with M1 chip, 256GB, Space Gray. Includes Apple Pencil 2nd gen. Used for note-taking, no scratches. Comes with case and original boxes.",
    category: "electronics",
    price: 550,
    originalPrice: 850,
    condition: "like_new",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    ],
    campus: "Cal Poly",
    status: "active",
    createdAt: "2026-01-24",
    views: 287,
    saves: 56,
  },
  {
    id: "9",
    sellerId: "user1",
    sellerName: "Jake Martinez",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jake",
    sellerRating: 4.9,
    title: "Calculus Early Transcendentals (Stewart)",
    description: "Stewart's Calculus 8th Edition. Required for most calc classes. Has some notes in pencil but pages are clean. Access code NOT included.",
    category: "textbooks",
    price: 35,
    originalPrice: 250,
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    ],
    campus: "UCLA",
    status: "sold",
    createdAt: "2026-01-20",
    views: 234,
    saves: 18,
  },
  {
    id: "10",
    sellerId: "user9",
    sellerName: "Morgan Davis",
    sellerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=morgan",
    sellerRating: 4.7,
    title: "Mini Fridge - Perfect for Dorm",
    description: "Compact mini fridge, 3.2 cu ft. Has small freezer compartment. Works perfectly, just upgrading. Great for keeping drinks and snacks cold in your dorm!",
    category: "furniture",
    price: 75,
    originalPrice: 150,
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
    ],
    campus: "UCSB",
    status: "active",
    createdAt: "2026-01-23",
    views: 167,
    saves: 34,
  },
];

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsByCategory(category: string): Listing[] {
  if (category === "all") return listings.filter((l) => l.status === "active");
  return listings.filter((l) => l.category === category && l.status === "active");
}

export function getListingsByCampus(campus: string): Listing[] {
  if (campus === "all") return listings.filter((l) => l.status === "active");
  return listings.filter((l) => l.campus === campus && l.status === "active");
}

export function getFeaturedListings(): Listing[] {
  return listings
    .filter((l) => l.status === "active")
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 4);
}
