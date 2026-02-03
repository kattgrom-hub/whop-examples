// Mock data for creator dashboard

export type CreatedContest = {
  id: string;
  name: string;
  sport: string;
  type: "daily" | "survivor" | "pickem" | "season";
  entryFee: number;
  prizePool: number;
  totalEntries: number;
  revenue: number;
  status: "draft" | "open" | "live" | "completed";
  startTime: string;
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
};

export const mockCreatedContests: CreatedContest[] = [
  {
    id: "c1",
    name: "NFL Sunday Million",
    sport: "NFL",
    type: "daily",
    entryFee: 25,
    prizePool: 100000,
    totalEntries: 4127,
    revenue: 103175,
    status: "open",
    startTime: "2025-02-09T13:00:00Z",
  },
  {
    id: "c2",
    name: "Super Bowl Survivor",
    sport: "NFL",
    type: "survivor",
    entryFee: 50,
    prizePool: 50000,
    totalEntries: 892,
    revenue: 44600,
    status: "open",
    startTime: "2025-02-09T18:30:00Z",
  },
  {
    id: "c3",
    name: "EPL Season Challenge",
    sport: "Soccer",
    type: "season",
    entryFee: 150,
    prizePool: 200000,
    totalEntries: 1456,
    revenue: 218400,
    status: "open",
    startTime: "2025-08-12T14:00:00Z",
  },
  {
    id: "c4",
    name: "March Madness 2024",
    sport: "NBA",
    type: "pickem",
    entryFee: 20,
    prizePool: 15000,
    totalEntries: 850,
    revenue: 17000,
    status: "completed",
    startTime: "2024-03-15T12:00:00Z",
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "p1",
    amount: 8500,
    status: "completed",
    date: "2025-01-25",
    method: "Bank Account ****4242",
  },
  {
    id: "p2",
    amount: 12300,
    status: "completed",
    date: "2025-01-18",
    method: "Bank Account ****4242",
  },
  {
    id: "p3",
    amount: 6750,
    status: "completed",
    date: "2025-01-11",
    method: "Bank Account ****4242",
  },
  {
    id: "p4",
    amount: 15200,
    status: "processing",
    date: "2025-02-01",
    method: "Bank Account ****4242",
  },
];

export const mockEarnings = {
  availableBalance: 18750,
  pendingBalance: 15200,
  totalEarned: 156800,
  thisMonth: 42500,
  lastMonth: 38200,
  platformFeeRate: 0.05, // 5% platform fee
};

export function getCreatorStats() {
  const totalContests = mockCreatedContests.length;
  const activeContests = mockCreatedContests.filter(
    (c) => c.status === "open" || c.status === "live"
  ).length;
  const totalEntries = mockCreatedContests.reduce(
    (sum, c) => sum + c.totalEntries,
    0
  );
  const totalRevenue = mockCreatedContests.reduce(
    (sum, c) => sum + c.revenue,
    0
  );

  return {
    totalContests,
    activeContests,
    totalEntries,
    totalRevenue,
  };
}
