export type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "analyst" | "subscriber";
  };
  title: string;
  content: string;
  sport: string;
  createdAt: string;
  likes: number;
  comments: number;
};

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "analyst" | "subscriber";
  };
  content: string;
  createdAt: string;
  likes: number;
};

export const mockPosts: Post[] = [
  {
    id: "post1",
    author: {
      name: "Mike Sharp",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mikesharp",
      role: "analyst",
    },
    title: "NFL Divisional Round Preview - My Top Plays",
    content: "Breaking down the divisional round games with a focus on line movement and sharp money. The Chiefs-Bills line has moved significantly and I see value...",
    sport: "NFL",
    createdAt: "2025-02-01",
    likes: 89,
    comments: 34,
  },
  {
    id: "post2",
    author: {
      name: "Chris Walker",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrisw",
      role: "subscriber",
    },
    title: "5-0 this week following Mike Sharp!",
    content: "Just wanted to share my results. Started following Mike's picks last month and I'm up 15 units. The NFL spreads have been money!",
    sport: "NFL",
    createdAt: "2025-01-31",
    likes: 156,
    comments: 28,
  },
  {
    id: "post3",
    author: {
      name: "Sarah Hoops",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarahhoops",
      role: "analyst",
    },
    title: "NBA Player Prop Strategy for Back-to-Backs",
    content: "When targeting player props on back-to-back games, here are the key stats I look at: minutes played, usage rate changes, and opponent defensive rating...",
    sport: "NBA",
    createdAt: "2025-01-30",
    likes: 67,
    comments: 19,
  },
  {
    id: "post4",
    author: {
      name: "The Professor",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=professor",
      role: "analyst",
    },
    title: "How I Build My Machine Learning Models",
    content: "A deep dive into my analytical process. I use gradient boosting models trained on 10 years of historical data, incorporating weather, injuries, and situational factors...",
    sport: "NFL",
    createdAt: "2025-01-28",
    likes: 234,
    comments: 67,
  },
  {
    id: "post5",
    author: {
      name: "Goal Machine",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=goalmachine",
      role: "analyst",
    },
    title: "Champions League Round of 16 Preview",
    content: "The draw is set and there are some fascinating matchups. Here's my early analysis of where I see value in the two-leg ties...",
    sport: "Soccer",
    createdAt: "2025-01-27",
    likes: 78,
    comments: 23,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Brandon Smith",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=brandons",
      role: "subscriber",
    },
    content: "Great breakdown! The Chiefs analysis is spot on. Tailing this one.",
    createdAt: "2025-02-01",
    likes: 12,
  },
  {
    id: "c2",
    author: {
      name: "Mike Sharp",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mikesharp",
      role: "analyst",
    },
    content: "Thanks for the support! Let's keep the momentum going.",
    createdAt: "2025-02-01",
    likes: 8,
  },
  {
    id: "c3",
    author: {
      name: "Amanda Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=amandac",
      role: "subscriber",
    },
    content: "The player prop strategy has been a game changer for me. Sarah's NBA picks are consistently profitable.",
    createdAt: "2025-01-30",
    likes: 15,
  },
];

export function getPost(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id);
}
