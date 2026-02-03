// Mock data for analyst dashboard

export type Subscriber = {
  id: string;
  name: string;
  avatar: string;
  subscribedAt: string;
  plan: string;
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
};

export const mockSubscribers: Subscriber[] = [
  {
    id: "s1",
    name: "Chris Walker",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrisw",
    subscribedAt: "2025-01-15",
    plan: "Monthly",
  },
  {
    id: "s2",
    name: "Jessica Lee",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jessical",
    subscribedAt: "2025-01-20",
    plan: "Monthly",
  },
  {
    id: "s3",
    name: "Brandon Smith",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=brandons",
    subscribedAt: "2025-01-22",
    plan: "Annual",
  },
  {
    id: "s4",
    name: "Amanda Chen",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=amandac",
    subscribedAt: "2025-01-25",
    plan: "Monthly",
  },
  {
    id: "s5",
    name: "Tyler Johnson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=tylerj",
    subscribedAt: "2025-01-28",
    plan: "Monthly",
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "pay1",
    amount: 1250,
    status: "completed",
    date: "2025-01-25",
    method: "Bank Account ****4242",
  },
  {
    id: "pay2",
    amount: 980,
    status: "completed",
    date: "2025-01-18",
    method: "Bank Account ****4242",
  },
  {
    id: "pay3",
    amount: 1450,
    status: "completed",
    date: "2025-01-11",
    method: "Bank Account ****4242",
  },
];

export const mockEarnings = {
  availableBalance: 875,
  pendingBalance: 425,
  totalEarned: 4555,
  thisMonth: 1300,
  lastMonth: 1250,
  subscriberCount: 47,
  avgMonthlyRevenue: 1275,
};

export const mockAnalystStats = {
  totalPicks: 485,
  winRate: 58.7,
  avgUnits: 2.3,
  roi: 12.4,
  currentStreak: 5,
  bestStreak: 12,
  thisMonthRecord: { wins: 24, losses: 16, pushes: 2 },
  lastMonthRecord: { wins: 28, losses: 19, pushes: 1 },
};
