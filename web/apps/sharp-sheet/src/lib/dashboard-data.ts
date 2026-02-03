// Dashboard data for analyst earnings and stats

export const dashboardEarnings = {
  availableBalance: 2450,
  pendingBalance: 875,
  totalEarned: 15890,
  thisMonth: 3250,
  lastMonth: 2890,
  subscriberCount: 142,
  avgMonthlyRevenue: 3070,
  activeSubscriptions: 89,
  churnRate: 4.2,
};

export const dashboardStats = {
  totalPicks: 485,
  winRate: 58.7,
  avgUnits: 2.3,
  roi: 12.4,
  currentStreak: 5,
  bestStreak: 14,
  thisMonthRecord: { wins: 32, losses: 21, pushes: 3 },
  lastMonthRecord: { wins: 38, losses: 26, pushes: 2 },
  totalUnitsWon: 48.5,
  avgOdds: -108,
};

export const recentPayouts = [
  {
    id: "pay1",
    amount: 1850,
    status: "completed" as const,
    date: "2025-01-28",
    method: "Bank Account ****4242",
  },
  {
    id: "pay2",
    amount: 1420,
    status: "completed" as const,
    date: "2025-01-21",
    method: "Bank Account ****4242",
  },
  {
    id: "pay3",
    amount: 1680,
    status: "completed" as const,
    date: "2025-01-14",
    method: "Bank Account ****4242",
  },
  {
    id: "pay4",
    amount: 1550,
    status: "completed" as const,
    date: "2025-01-07",
    method: "Bank Account ****4242",
  },
];

export const weeklyPerformance = [
  { day: "Mon", wins: 4, losses: 2, units: 3.2 },
  { day: "Tue", wins: 3, losses: 3, units: -0.5 },
  { day: "Wed", wins: 5, losses: 1, units: 6.8 },
  { day: "Thu", wins: 2, losses: 2, units: 0.2 },
  { day: "Fri", wins: 4, losses: 3, units: 2.1 },
  { day: "Sat", wins: 6, losses: 2, units: 5.4 },
  { day: "Sun", wins: 8, losses: 4, units: 4.8 },
];

export const sportBreakdown = [
  { sport: "NFL", wins: 156, losses: 98, roi: 14.2 },
  { sport: "NBA", wins: 189, losses: 142, roi: 9.8 },
  { sport: "MLB", wins: 87, losses: 72, roi: 7.5 },
  { sport: "NHL", wins: 53, losses: 38, roi: 11.3 },
];
