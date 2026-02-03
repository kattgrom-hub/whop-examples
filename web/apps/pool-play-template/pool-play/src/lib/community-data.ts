export type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "creator" | "player";
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
    role: "creator" | "player";
  };
  content: string;
  createdAt: string;
  likes: number;
};

export const mockPosts: Post[] = [
  {
    id: "p1",
    author: {
      name: "ProPicker22",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=propicker",
      role: "player",
    },
    title: "Strategy guide for NFL survivor pools",
    content: "After winning 3 survivor pools this season, here are my top tips: 1) Avoid picking heavy favorites early, save them for later weeks. 2) Consider bye weeks when planning your picks. 3) Look for home underdogs getting points...",
    category: "NFL",
    createdAt: "2025-02-01",
    likes: 89,
    comments: 24,
  },
  {
    id: "p2",
    author: {
      name: "FantasyKing",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=fantasyking",
      role: "creator",
    },
    title: "Just launched my biggest prize pool yet!",
    content: "Super excited to announce the NFL Sunday Million is now live! $100K prize pool with $25K to first place. Good luck to everyone entering!",
    category: "NFL",
    createdAt: "2025-02-01",
    likes: 156,
    comments: 45,
  },
  {
    id: "p3",
    author: {
      name: "HoopsAnalyst",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=hoops",
      role: "player",
    },
    title: "NBA showdown strategy - captain picks",
    content: "Your captain pick is everything in showdown contests. Here's my approach: focus on usage rate and minutes projection. A player with 30%+ usage who's projected for 35+ minutes is your best bet...",
    category: "NBA",
    createdAt: "2025-01-30",
    likes: 67,
    comments: 18,
  },
  {
    id: "p4",
    author: {
      name: "GolfGuru",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=golfguru",
      role: "creator",
    },
    title: "Masters Pool now open for entries",
    content: "The biggest golf event of the year is coming up. Our Masters pool has a $75K prize pool. Pick 6 golfers and compete against the field!",
    category: "Golf",
    createdAt: "2025-01-28",
    likes: 43,
    comments: 12,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "GridironGuru",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=gridriron",
      role: "player",
    },
    content: "Great advice! I've been making the mistake of burning good teams early. Definitely going to save the top teams for playoff weeks.",
    createdAt: "2025-02-01",
    likes: 12,
  },
  {
    id: "c2",
    author: {
      name: "DailyWinner",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=dailywinner",
      role: "player",
    },
    content: "What's your take on picking divisional games? I've had mixed results going with divisional underdogs.",
    createdAt: "2025-02-01",
    likes: 5,
  },
  {
    id: "c3",
    author: {
      name: "ProPicker22",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=propicker",
      role: "player",
    },
    content: "Good question! I generally avoid divisional games unless there's a clear mismatch. The familiarity between teams makes these games too unpredictable.",
    createdAt: "2025-02-01",
    likes: 18,
  },
];

export function getPost(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id);
}
