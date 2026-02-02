export type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "coach" | "student";
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
    role: "coach" | "student";
  };
  content: string;
  createdAt: string;
  likes: number;
};

export const mockPosts: Post[] = [
  {
    id: "p1",
    author: {
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
      role: "coach",
    },
    title: "Tips for improving your aim in Valorant",
    content: "After coaching 50+ students, here are the most common mistakes I see with aim training and how to fix them...",
    category: "Gaming",
    createdAt: "2025-02-01",
    likes: 47,
    comments: 12,
  },
  {
    id: "p2",
    author: {
      name: "Jamie Wilson",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
      role: "student",
    },
    title: "Just hit Immortal after 3 months of coaching!",
    content: "Wanted to share my progress. Started in Gold, worked with @Alex for 12 sessions, and finally hit Immortal last night!",
    category: "Gaming",
    createdAt: "2025-01-30",
    likes: 89,
    comments: 24,
  },
  {
    id: "p3",
    author: {
      name: "Sarah Mitchell",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
      role: "coach",
    },
    title: "Best way to learn music theory for guitar?",
    content: "I often get asked about the order to learn music theory concepts. Here's my recommended progression for guitarists...",
    category: "Music",
    createdAt: "2025-01-28",
    likes: 34,
    comments: 8,
  },
  {
    id: "p4",
    author: {
      name: "Marcus Johnson",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcus",
      role: "coach",
    },
    title: "AMA: Ask me anything about strength training",
    content: "I'm Marcus, NASM certified trainer. Drop your questions about lifting, nutrition, or programming below!",
    category: "Fitness",
    createdAt: "2025-01-25",
    likes: 56,
    comments: 31,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Casey Brown",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=casey",
      role: "student",
    },
    content: "This is exactly what I needed! The crosshair placement tip alone improved my gameplay.",
    createdAt: "2025-02-01",
    likes: 8,
  },
  {
    id: "c2",
    author: {
      name: "Morgan Lee",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=morgan",
      role: "student",
    },
    content: "Would you recommend aim trainers like Aim Lab or just deathmatching?",
    createdAt: "2025-02-01",
    likes: 3,
  },
  {
    id: "c3",
    author: {
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
      role: "coach",
    },
    content: "Great question! I recommend a mix of both. 15 min of Aim Lab for warm-up, then deathmatch for real scenarios.",
    createdAt: "2025-02-01",
    likes: 12,
  },
];

export function getPost(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id);
}
