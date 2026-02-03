// Mock data for seller dashboard

export type Listing = {
  id: string;
  title: string;
  image: string;
  category: string;
  currentBid: number;
  startingBid: number;
  bidCount: number;
  watchers: number;
  endTime: string;
  status: "active" | "ended" | "sold" | "draft";
};

export type SellerPayout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
  auctionTitle?: string;
};

// Helper functions
function getPastDate(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function getFutureDate(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export const mockListings: Listing[] = [
  {
    id: "l1",
    title: "Pokemon Base Set Charizard 1st Edition PSA 9",
    image: "https://placehold.co/200x200/1f2937/f97316?text=Charizard",
    category: "Trading Cards",
    currentBid: 185000,
    startingBid: 150000,
    bidCount: 19,
    watchers: 1203,
    endTime: getFutureDate(12),
    status: "active",
  },
  {
    id: "l2",
    title: "1989 Upper Deck Ken Griffey Jr. RC PSA 10",
    image: "https://placehold.co/200x200/1f2937/22c55e?text=Griffey",
    category: "Trading Cards",
    currentBid: 4200,
    startingBid: 3000,
    bidCount: 14,
    watchers: 567,
    endTime: getPastDate(24),
    status: "sold",
  },
  {
    id: "l3",
    title: "Nike Air Force 1 Low 'Supreme' 2020",
    image: "https://placehold.co/200x200/1f2937/ef4444?text=Supreme",
    category: "Sneakers",
    currentBid: 0,
    startingBid: 450,
    bidCount: 0,
    watchers: 89,
    endTime: getFutureDate(72),
    status: "draft",
  },
  {
    id: "l4",
    title: "2020 Panini Prizm Justin Herbert RC Silver",
    image: "https://placehold.co/200x200/1f2937/3b82f6?text=Herbert",
    category: "Trading Cards",
    currentBid: 1250,
    startingBid: 800,
    bidCount: 11,
    watchers: 234,
    endTime: getFutureDate(48),
    status: "active",
  },
];

export const mockSellerPayouts: SellerPayout[] = [
  {
    id: "sp1",
    amount: 3990,
    status: "completed",
    date: "2026-01-28",
    method: "Bank Account ****4242",
    auctionTitle: "1989 Upper Deck Ken Griffey Jr. RC PSA 10",
  },
  {
    id: "sp2",
    amount: 1567.50,
    status: "completed",
    date: "2026-01-21",
    method: "Bank Account ****4242",
    auctionTitle: "Nike SB Dunk Low 'Chunky Dunky' 2020",
  },
  {
    id: "sp3",
    amount: 2850,
    status: "processing",
    date: "2026-02-01",
    method: "Bank Account ****4242",
    auctionTitle: "2020 Panini Mosaic Ja Morant Silver",
  },
];

export const mockSellerEarnings = {
  availableBalance: 2850,
  pendingBalance: 185000, // Waiting for current auction to end
  totalEarned: 45678,
  thisMonth: 8407.50,
  lastMonth: 12340,
  platformFee: 0.05, // 5% platform fee
};

export function getActiveListings(): Listing[] {
  return mockListings.filter((l) => l.status === "active");
}

export function getDraftListings(): Listing[] {
  return mockListings.filter((l) => l.status === "draft");
}

export function getSoldListings(): Listing[] {
  return mockListings.filter((l) => l.status === "sold");
}
