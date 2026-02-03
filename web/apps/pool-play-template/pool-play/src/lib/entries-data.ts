// Mock data for user entries and results

export type UserEntry = {
  id: string;
  contestId: string;
  contestName: string;
  sport: string;
  type: "daily" | "survivor" | "pickem" | "season";
  entryFee: number;
  status: "active" | "eliminated" | "won" | "lost";
  currentRank: number;
  totalEntries: number;
  points: number;
  potentialWinnings: number;
  picks: string[];
  enteredAt: string;
};

export type WinningRecord = {
  id: string;
  contestName: string;
  sport: string;
  place: number;
  prize: number;
  date: string;
};

export const mockUserEntries: UserEntry[] = [
  {
    id: "ue1",
    contestId: "1",
    contestName: "NFL Sunday Million",
    sport: "NFL",
    type: "daily",
    entryFee: 25,
    status: "active",
    currentRank: 127,
    totalEntries: 4127,
    points: 142.5,
    potentialWinnings: 0,
    picks: ["J. Allen", "D. Henry", "J. Jefferson", "T. Hill", "G. Kittle", "49ers DST"],
    enteredAt: "2025-02-07T10:30:00Z",
  },
  {
    id: "ue2",
    contestId: "7",
    contestName: "NHL Daily Shootout",
    sport: "NHL",
    type: "daily",
    entryFee: 5,
    status: "active",
    currentRank: 45,
    totalEntries: 987,
    points: 28.5,
    potentialWinnings: 250,
    picks: ["A. Ovechkin", "C. McDavid", "A. Matthews", "N. MacKinnon"],
    enteredAt: "2025-02-08T14:00:00Z",
  },
  {
    id: "ue3",
    contestId: "3",
    contestName: "Super Bowl Survivor",
    sport: "NFL",
    type: "survivor",
    entryFee: 50,
    status: "active",
    currentRank: 156,
    totalEntries: 892,
    points: 0,
    potentialWinnings: 0,
    picks: ["Chiefs"],
    enteredAt: "2025-02-06T09:00:00Z",
  },
  {
    id: "ue4",
    contestId: "8",
    contestName: "MLB Home Run Derby",
    sport: "MLB",
    type: "pickem",
    entryFee: 15,
    status: "won",
    currentRank: 3,
    totalEntries: 1200,
    points: 47,
    potentialWinnings: 2000,
    picks: ["45", "38", "42", "29"],
    enteredAt: "2025-01-28T16:00:00Z",
  },
  {
    id: "ue5",
    contestId: "2",
    contestName: "NBA Showdown",
    sport: "NBA",
    type: "daily",
    entryFee: 10,
    status: "lost",
    currentRank: 1845,
    totalEntries: 2341,
    points: 89.2,
    potentialWinnings: 0,
    picks: ["L. James (CPT)", "S. Curry", "K. Durant", "J. Tatum", "A. Davis"],
    enteredAt: "2025-02-05T18:00:00Z",
  },
];

export const mockWinnings: WinningRecord[] = [
  {
    id: "w1",
    contestName: "MLB Home Run Derby",
    sport: "MLB",
    place: 3,
    prize: 2000,
    date: "2025-02-01",
  },
  {
    id: "w2",
    contestName: "NFL Wildcard Survivor",
    sport: "NFL",
    place: 1,
    prize: 5000,
    date: "2025-01-15",
  },
  {
    id: "w3",
    contestName: "NBA All-Star Pick'em",
    sport: "NBA",
    place: 5,
    prize: 500,
    date: "2025-01-10",
  },
  {
    id: "w4",
    contestName: "NHL Winter Classic",
    sport: "NHL",
    place: 2,
    prize: 1200,
    date: "2024-12-28",
  },
];

export const mockPlayerStats = {
  contestsEntered: 47,
  contestsWon: 8,
  winRate: 17,
  totalWinnings: 12450,
  activEntries: 3,
  pendingPayouts: 2000,
};

export function getUserEntries(status?: string): UserEntry[] {
  if (!status || status === "all") return mockUserEntries;
  return mockUserEntries.filter((e) => e.status === status);
}

export function getUserEntry(id: string): UserEntry | undefined {
  return mockUserEntries.find((e) => e.id === id);
}
