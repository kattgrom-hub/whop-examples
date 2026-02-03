export type UserBid = {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  amount: number;
  timestamp: string;
  status: "winning" | "outbid" | "won" | "lost";
  currentHighBid: number;
  endTime: string;
};

export type WonAuction = {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  winningBid: number;
  wonAt: string;
  seller: {
    name: string;
    avatar: string;
  };
  paymentStatus: "pending" | "paid" | "shipped" | "delivered";
  trackingNumber?: string;
};

// Helper to get past/future dates
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

export const mockUserBids: UserBid[] = [
  {
    id: "ub1",
    auctionId: "1",
    auctionTitle: "1986 Fleer Michael Jordan Rookie Card PSA 10",
    auctionImage: "https://placehold.co/200x200/1f2937/f59e0b?text=Jordan+RC",
    amount: 420000,
    timestamp: getPastDate(4),
    status: "outbid",
    currentHighBid: 425000,
    endTime: getFutureDate(2),
  },
  {
    id: "ub2",
    auctionId: "2",
    auctionTitle: "Nike Air Jordan 1 Retro High OG 'Chicago' 2015",
    auctionImage: "https://placehold.co/200x200/1f2937/ef4444?text=Chicago+1s",
    amount: 2850,
    timestamp: getPastDate(2),
    status: "winning",
    currentHighBid: 2850,
    endTime: getFutureDate(8),
  },
  {
    id: "ub3",
    auctionId: "4",
    auctionTitle: "Rolex Submariner Date 126610LN 2023",
    auctionImage: "https://placehold.co/200x200/1f2937/3b82f6?text=Submariner",
    amount: 13500,
    timestamp: getPastDate(6),
    status: "outbid",
    currentHighBid: 14200,
    endTime: getFutureDate(6),
  },
  {
    id: "ub4",
    auctionId: "8",
    auctionTitle: "Nike Dunk Low 'Panda' 2021 DS",
    auctionImage: "https://placehold.co/200x200/1f2937/6366f1?text=Panda",
    amount: 275,
    timestamp: getPastDate(3),
    status: "outbid",
    currentHighBid: 285,
    endTime: getFutureDate(4),
  },
  {
    id: "ub5",
    auctionId: "9",
    auctionTitle: "1989 Upper Deck Ken Griffey Jr. RC PSA 10",
    auctionImage: "https://placehold.co/200x200/1f2937/22c55e?text=Griffey",
    amount: 4200,
    timestamp: getPastDate(48),
    status: "won",
    currentHighBid: 4200,
    endTime: getPastDate(24),
  },
  {
    id: "ub6",
    auctionId: "10",
    auctionTitle: "Vintage Omega Speedmaster Professional",
    auctionImage: "https://placehold.co/200x200/1f2937/a855f7?text=Speedmaster",
    amount: 5800,
    timestamp: getPastDate(72),
    status: "lost",
    currentHighBid: 6200,
    endTime: getPastDate(48),
  },
];

export const mockWonAuctions: WonAuction[] = [
  {
    id: "wa1",
    auctionId: "9",
    auctionTitle: "1989 Upper Deck Ken Griffey Jr. RC PSA 10",
    auctionImage: "https://placehold.co/200x200/1f2937/22c55e?text=Griffey",
    winningBid: 4200,
    wonAt: getPastDate(24),
    seller: {
      name: "Card Kingdom",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=cardkingdom",
    },
    paymentStatus: "shipped",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "wa2",
    auctionId: "11",
    auctionTitle: "Nike SB Dunk Low 'Chunky Dunky' 2020",
    auctionImage: "https://placehold.co/200x200/1f2937/14b8a6?text=Chunky",
    winningBid: 1650,
    wonAt: getPastDate(168),
    seller: {
      name: "Ice Cream Kicks",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=icecream",
    },
    paymentStatus: "delivered",
  },
  {
    id: "wa3",
    auctionId: "12",
    auctionTitle: "2020 Panini Prizm LaMelo Ball RC Silver",
    auctionImage: "https://placehold.co/200x200/1f2937/f97316?text=LaMelo",
    winningBid: 850,
    wonAt: getPastDate(48),
    seller: {
      name: "Prizm Pros",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=prizm",
    },
    paymentStatus: "paid",
  },
];

export function getActiveBids(): UserBid[] {
  return mockUserBids.filter((b) => b.status === "winning" || b.status === "outbid");
}

export function getBidHistory(): UserBid[] {
  return mockUserBids.filter((b) => b.status === "won" || b.status === "lost");
}

export function getWonAuctions(): WonAuction[] {
  return mockWonAuctions;
}
