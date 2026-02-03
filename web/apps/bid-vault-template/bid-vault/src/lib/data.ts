export type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
};

export type Bid = {
  id: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  amount: number;
  timestamp: string;
};

export type Auction = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  bidCount: number;
  bids: Bid[];
  endTime: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  condition: "mint" | "near-mint" | "excellent" | "good" | "fair";
  authenticity: {
    verified: boolean;
    certificateId?: string;
  };
  shipping: {
    domestic: number;
    international?: number;
  };
  watchers: number;
  featured: boolean;
};

export const categories: Category[] = [
  { id: "1", name: "Trading Cards", icon: "cards", slug: "trading-cards" },
  { id: "2", name: "Sneakers", icon: "sneakers", slug: "sneakers" },
  { id: "3", name: "Memorabilia", icon: "memorabilia", slug: "memorabilia" },
  { id: "4", name: "Watches", icon: "watches", slug: "watches" },
  { id: "5", name: "Art", icon: "art", slug: "art" },
  { id: "6", name: "Collectibles", icon: "collectibles", slug: "collectibles" },
];

export const categoryIcons: Record<string, string> = {
  "trading-cards": "cards",
  sneakers: "sneakers",
  memorabilia: "memorabilia",
  watches: "watches",
  art: "art",
  collectibles: "collectibles",
};

// Helper to get a future date
function getFutureDate(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

// Helper to get a past date
function getPastDate(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

export const auctions: Auction[] = [
  {
    id: "1",
    title: "1986 Fleer Michael Jordan Rookie Card PSA 10",
    description: "Pristine PSA 10 graded 1986 Fleer Michael Jordan rookie card (#57). One of the most iconic basketball cards ever produced. This gem mint example features perfect centering, sharp corners, and flawless surface. Comes with PSA certification and tamper-proof case. A true investment-grade collectible.",
    images: [
      "https://placehold.co/600x600/1f2937/f59e0b?text=Jordan+RC",
      "https://placehold.co/600x600/1f2937/f59e0b?text=PSA+10",
      "https://placehold.co/600x600/1f2937/f59e0b?text=Back",
    ],
    category: "trading-cards",
    currentBid: 425000,
    startingBid: 350000,
    buyNowPrice: 550000,
    bidCount: 23,
    bids: [
      { id: "b1", bidderId: "u1", bidderName: "CardKing23", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=cardking", amount: 425000, timestamp: getPastDate(1) },
      { id: "b2", bidderId: "u2", bidderName: "InvestorMike", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=investor", amount: 415000, timestamp: getPastDate(3) },
      { id: "b3", bidderId: "u3", bidderName: "HoopsDreams", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=hoops", amount: 400000, timestamp: getPastDate(6) },
    ],
    endTime: getFutureDate(2),
    seller: {
      id: "s1",
      name: "Elite Cards",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elitecards",
      rating: 4.9,
      verified: true,
    },
    condition: "mint",
    authenticity: { verified: true, certificateId: "PSA-12345678" },
    shipping: { domestic: 0, international: 150 },
    watchers: 847,
    featured: true,
  },
  {
    id: "2",
    title: "Nike Air Jordan 1 Retro High OG 'Chicago' 2015",
    description: "Deadstock pair of the iconic 2015 Chicago Jordan 1s. Size 10 US. Original box and laces included. These have been stored in a climate-controlled environment since purchase. One of the most sought-after sneaker releases of the decade.",
    images: [
      "https://placehold.co/600x600/1f2937/ef4444?text=Chicago+1s",
      "https://placehold.co/600x600/1f2937/ef4444?text=Side+View",
      "https://placehold.co/600x600/1f2937/ef4444?text=Box",
    ],
    category: "sneakers",
    currentBid: 2850,
    startingBid: 2000,
    bidCount: 15,
    bids: [
      { id: "b4", bidderId: "u4", bidderName: "SneakerHead99", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sneaker", amount: 2850, timestamp: getPastDate(2) },
      { id: "b5", bidderId: "u5", bidderName: "KicksCollector", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=kicks", amount: 2700, timestamp: getPastDate(5) },
    ],
    endTime: getFutureDate(8),
    seller: {
      id: "s2",
      name: "Sole Legacy",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sole",
      rating: 5.0,
      verified: true,
    },
    condition: "mint",
    authenticity: { verified: true, certificateId: "CHECKCHECK-98765" },
    shipping: { domestic: 25, international: 75 },
    watchers: 234,
    featured: true,
  },
  {
    id: "3",
    title: "Babe Ruth Signed Baseball PSA/DNA Authenticated",
    description: "Authentic Babe Ruth single-signed Official American League baseball. Ball dates to the 1930s based on the William Harridge signature. PSA/DNA authenticated with LOA. A cornerstone piece for any serious sports memorabilia collection.",
    images: [
      "https://placehold.co/600x600/1f2937/22c55e?text=Ruth+Ball",
      "https://placehold.co/600x600/1f2937/22c55e?text=Signature",
      "https://placehold.co/600x600/1f2937/22c55e?text=LOA",
    ],
    category: "memorabilia",
    currentBid: 78500,
    startingBid: 50000,
    bidCount: 31,
    bids: [
      { id: "b6", bidderId: "u6", bidderName: "VintageVault", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=vintage", amount: 78500, timestamp: getPastDate(4) },
    ],
    endTime: getFutureDate(24),
    seller: {
      id: "s3",
      name: "Heritage Sports",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=heritage",
      rating: 4.8,
      verified: true,
    },
    condition: "good",
    authenticity: { verified: true, certificateId: "PSA/DNA-456789" },
    shipping: { domestic: 0, international: 100 },
    watchers: 562,
    featured: true,
  },
  {
    id: "4",
    title: "Rolex Submariner Date 126610LN 2023",
    description: "Brand new unworn 2023 Rolex Submariner Date reference 126610LN. 41mm case, black ceramic bezel, Oystersteel bracelet. Complete set with box, papers, warranty card, and hang tags. AD purchased with full manufacturer warranty.",
    images: [
      "https://placehold.co/600x600/1f2937/3b82f6?text=Submariner",
      "https://placehold.co/600x600/1f2937/3b82f6?text=Dial",
      "https://placehold.co/600x600/1f2937/3b82f6?text=Box+Set",
    ],
    category: "watches",
    currentBid: 14200,
    startingBid: 12000,
    bidCount: 18,
    bids: [
      { id: "b7", bidderId: "u7", bidderName: "WatchWizard", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=watch", amount: 14200, timestamp: getPastDate(1) },
      { id: "b8", bidderId: "u8", bidderName: "TimepieceTrader", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=time", amount: 13800, timestamp: getPastDate(3) },
    ],
    endTime: getFutureDate(6),
    seller: {
      id: "s4",
      name: "Chrono Luxe",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrono",
      rating: 4.9,
      verified: true,
    },
    condition: "mint",
    authenticity: { verified: true, certificateId: "ROLEX-2023-126610" },
    shipping: { domestic: 0, international: 200 },
    watchers: 423,
    featured: false,
  },
  {
    id: "5",
    title: "KAWS Companion (Open Edition) Grey 2016",
    description: "KAWS Companion Open Edition figure in grey colorway. 11 inches tall, vinyl construction. Excellent condition with original packaging. A staple piece from one of the most influential contemporary artists of our generation.",
    images: [
      "https://placehold.co/600x600/1f2937/a855f7?text=KAWS",
      "https://placehold.co/600x600/1f2937/a855f7?text=Detail",
      "https://placehold.co/600x600/1f2937/a855f7?text=Box",
    ],
    category: "art",
    currentBid: 1850,
    startingBid: 1200,
    bidCount: 12,
    bids: [
      { id: "b9", bidderId: "u9", bidderName: "ArtCollector", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=art", amount: 1850, timestamp: getPastDate(5) },
    ],
    endTime: getFutureDate(48),
    seller: {
      id: "s5",
      name: "Gallery Nine",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=gallery",
      rating: 4.7,
      verified: true,
    },
    condition: "excellent",
    authenticity: { verified: true },
    shipping: { domestic: 35, international: 85 },
    watchers: 189,
    featured: false,
  },
  {
    id: "6",
    title: "Pokemon Base Set Charizard 1st Edition PSA 9",
    description: "Holy grail of Pokemon cards - 1st Edition Base Set Charizard #4 graded PSA 9. Shadowless variant with excellent eye appeal. A defining collectible of the late 90s that continues to appreciate. Complete with PSA case and certification.",
    images: [
      "https://placehold.co/600x600/1f2937/f97316?text=Charizard",
      "https://placehold.co/600x600/1f2937/f97316?text=PSA+Case",
      "https://placehold.co/600x600/1f2937/f97316?text=1st+Ed",
    ],
    category: "trading-cards",
    currentBid: 185000,
    startingBid: 150000,
    bidCount: 19,
    bids: [
      { id: "b10", bidderId: "u10", bidderName: "PokeInvestor", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=poke", amount: 185000, timestamp: getPastDate(2) },
    ],
    endTime: getFutureDate(12),
    seller: {
      id: "s6",
      name: "TCG Vault",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=tcg",
      rating: 5.0,
      verified: true,
    },
    condition: "near-mint",
    authenticity: { verified: true, certificateId: "PSA-99887766" },
    shipping: { domestic: 0, international: 100 },
    watchers: 1203,
    featured: true,
  },
  {
    id: "7",
    title: "Vintage Star Wars Boba Fett Action Figure 1979",
    description: "Original 1979 Kenner Boba Fett action figure with rocket-firing backpack variant. Extremely rare prototype that was never mass-produced due to safety concerns. Includes original mail-away cardboard. Museum-quality piece.",
    images: [
      "https://placehold.co/600x600/1f2937/14b8a6?text=Boba+Fett",
      "https://placehold.co/600x600/1f2937/14b8a6?text=Rocket",
      "https://placehold.co/600x600/1f2937/14b8a6?text=Card",
    ],
    category: "collectibles",
    currentBid: 42500,
    startingBid: 35000,
    bidCount: 14,
    bids: [
      { id: "b11", bidderId: "u11", bidderName: "RetroRelic", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=retro", amount: 42500, timestamp: getPastDate(8) },
    ],
    endTime: getFutureDate(36),
    seller: {
      id: "s7",
      name: "Nostalgia Vault",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=nostalgia",
      rating: 4.6,
      verified: true,
    },
    condition: "excellent",
    authenticity: { verified: true, certificateId: "AFA-85" },
    shipping: { domestic: 50, international: 150 },
    watchers: 387,
    featured: false,
  },
  {
    id: "8",
    title: "Nike Dunk Low 'Panda' 2021 DS",
    description: "Brand new deadstock Nike Dunk Low Retro 'Panda' (DD1391-100). Size 9.5 US. Original box with tissue paper. The most hyped general release of 2021. Perfect for wear or collection.",
    images: [
      "https://placehold.co/600x600/1f2937/6366f1?text=Panda",
      "https://placehold.co/600x600/1f2937/6366f1?text=Swoosh",
      "https://placehold.co/600x600/1f2937/6366f1?text=Box",
    ],
    category: "sneakers",
    currentBid: 285,
    startingBid: 200,
    bidCount: 8,
    bids: [
      { id: "b12", bidderId: "u12", bidderName: "DunkFan", bidderAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=dunk", amount: 285, timestamp: getPastDate(1) },
    ],
    endTime: getFutureDate(4),
    seller: {
      id: "s8",
      name: "Sneaker Market",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=market",
      rating: 4.8,
      verified: true,
    },
    condition: "mint",
    authenticity: { verified: true },
    shipping: { domestic: 15, international: 45 },
    watchers: 156,
    featured: false,
  },
];

export function getAuction(id: string): Auction | undefined {
  return auctions.find((a) => a.id === id);
}

export function getAuctionsByCategory(categorySlug: string): Auction[] {
  if (categorySlug === "all") return auctions;
  return auctions.filter((a) => a.category === categorySlug);
}

export function getFeaturedAuctions(): Auction[] {
  return auctions.filter((a) => a.featured);
}

export function getEndingSoonAuctions(): Auction[] {
  const now = new Date();
  return auctions
    .filter((a) => new Date(a.endTime) > now)
    .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
    .slice(0, 6);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTimeRemaining(endTime: string): { days: number; hours: number; minutes: number; seconds: number; isEnded: boolean } {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isEnded: false };
}

export function getCategoryIcon(slug: string): string {
  const icons: Record<string, string> = {
    "trading-cards": "cards",
    sneakers: "sneakers",
    memorabilia: "memorabilia",
    watches: "watches",
    art: "art",
    collectibles: "collectibles",
  };
  return icons[slug] || "collectibles";
}
