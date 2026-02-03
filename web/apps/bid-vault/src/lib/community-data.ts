export type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "seller" | "buyer" | "admin";
    verified: boolean;
  };
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
};

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "seller" | "buyer" | "admin";
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
};

export const mockPosts: Post[] = [
  {
    id: "p1",
    author: {
      name: "Elite Cards",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elitecards",
      role: "seller",
      verified: true,
    },
    title: "Guide: How to Spot Fake PSA Slabs",
    content: "With the rise in valuable graded cards, counterfeit slabs have become more common. Here are the key things to look for: 1) Check the label hologram under UV light, 2) Verify the cert number on PSA's website, 3) Look for proper label alignment and font consistency...",
    category: "Trading Cards",
    createdAt: "2026-02-01",
    likes: 156,
    comments: 42,
  },
  {
    id: "p2",
    author: {
      name: "SneakerHead99",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sneaker",
      role: "buyer",
      verified: false,
    },
    title: "Just won my grail - Travis Scott x Fragment Jordan 1s!",
    content: "After months of bidding and being outbid on multiple pairs, finally won an auction for a DS pair in my size! The BidVault authentication process was super thorough. Can't wait for delivery!",
    category: "Sneakers",
    createdAt: "2026-01-30",
    likes: 234,
    comments: 67,
  },
  {
    id: "p3",
    author: {
      name: "Heritage Sports",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=heritage",
      role: "seller",
      verified: true,
    },
    title: "Upcoming: Babe Ruth Collection Consignment",
    content: "Excited to announce we'll be listing a major Ruth collection next month including game-used items, signed photos, and contracts. Preview images coming soon. These items have been in a private collection for over 40 years.",
    category: "Memorabilia",
    createdAt: "2026-01-28",
    likes: 312,
    comments: 89,
  },
  {
    id: "p4",
    author: {
      name: "Chrono Luxe",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrono",
      role: "seller",
      verified: true,
    },
    title: "Market Analysis: Rolex Sports Models 2025-2026",
    content: "The secondary market for Rolex sports models has seen interesting shifts. Submariners are holding steady while Daytonas have softened slightly. GMT-Master IIs remain highly sought after. Here's our detailed breakdown...",
    category: "Watches",
    createdAt: "2026-01-25",
    likes: 178,
    comments: 54,
  },
  {
    id: "p5",
    author: {
      name: "ArtCollector",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=art",
      role: "buyer",
      verified: false,
    },
    title: "Question: Best way to display KAWS figures?",
    content: "Just starting my KAWS collection and looking for advice on display cases. Want something that protects from dust and UV but also looks clean. What does everyone here use? Budget is flexible for the right solution.",
    category: "Art",
    createdAt: "2026-01-22",
    likes: 67,
    comments: 31,
  },
  {
    id: "p6",
    author: {
      name: "BidVault Team",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bidvault",
      role: "admin",
      verified: true,
    },
    title: "New Feature: Live Auction Notifications",
    content: "We've rolled out real-time bid notifications! You'll now get instant alerts when you're outbid, when auctions you're watching are ending soon, and when items in your favorite categories are listed. Enable in Settings.",
    category: "Announcements",
    createdAt: "2026-01-20",
    likes: 445,
    comments: 76,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "CardKing23",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=cardking",
      role: "buyer",
      verified: false,
    },
    content: "This is super helpful! I almost bought a fake slab on eBay last month. The UV test saved me.",
    createdAt: "2026-02-01",
    likes: 23,
  },
  {
    id: "c2",
    author: {
      name: "TCG Vault",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=tcg",
      role: "seller",
      verified: true,
    },
    content: "Great guide! I'd also add to check the case seams - fakes often have visible seam lines that authentic PSA cases don't have.",
    createdAt: "2026-02-01",
    likes: 45,
  },
  {
    id: "c3",
    author: {
      name: "InvestorMike",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=investor",
      role: "buyer",
      verified: false,
    },
    content: "Does this apply to BGS slabs too or is there a different guide for those?",
    createdAt: "2026-02-01",
    likes: 12,
  },
];

export function getPost(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id);
}

export function getPostsByCategory(category: string): Post[] {
  if (category === "All") return mockPosts;
  return mockPosts.filter((p) => p.category === category);
}
