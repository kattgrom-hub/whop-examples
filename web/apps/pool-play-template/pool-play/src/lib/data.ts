export type Contest = {
  id: string;
  name: string;
  sport: string;
  type: "daily" | "survivor" | "pickem" | "season";
  entryFee: number;
  prizePool: number;
  maxEntries: number;
  currentEntries: number;
  startTime: string;
  status: "open" | "live" | "completed";
  creatorId: string;
  rules: string;
  prizes: { place: number; amount: number }[];
};

export type Entry = {
  id: string;
  contestId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  picks: string[];
  points: number;
  rank: number;
  status: "active" | "eliminated" | "won";
};

export type UserStats = {
  contestsEntered: number;
  contestsWon: number;
  totalWinnings: number;
  winRate: number;
};

export const sports = ["NFL", "NBA", "MLB", "NHL", "Soccer", "Golf"];

export const contestTypes = [
  { value: "daily", label: "Daily Fantasy" },
  { value: "survivor", label: "Survivor Pool" },
  { value: "pickem", label: "Pick'em" },
  { value: "season", label: "Season Long" },
];

export const contests: Contest[] = [
  {
    id: "1",
    name: "NFL Sunday Million",
    sport: "NFL",
    type: "daily",
    entryFee: 25,
    prizePool: 100000,
    maxEntries: 5000,
    currentEntries: 4127,
    startTime: "2025-02-09T13:00:00Z",
    status: "open",
    creatorId: "user_1",
    rules: "Select 9 players (1 QB, 2 RB, 3 WR, 1 TE, 1 FLEX, 1 DST) within $50,000 salary cap. Standard PPR scoring.",
    prizes: [
      { place: 1, amount: 25000 },
      { place: 2, amount: 10000 },
      { place: 3, amount: 5000 },
      { place: 4, amount: 2500 },
      { place: 5, amount: 1500 },
    ],
  },
  {
    id: "2",
    name: "NBA Showdown",
    sport: "NBA",
    type: "daily",
    entryFee: 10,
    prizePool: 25000,
    maxEntries: 3000,
    currentEntries: 2341,
    startTime: "2025-02-08T19:00:00Z",
    status: "open",
    creatorId: "user_2",
    rules: "Select 6 players (1 Captain, 5 UTIL) for a single game slate. Captain scores 1.5x points.",
    prizes: [
      { place: 1, amount: 5000 },
      { place: 2, amount: 2500 },
      { place: 3, amount: 1500 },
      { place: 4, amount: 1000 },
      { place: 5, amount: 500 },
    ],
  },
  {
    id: "3",
    name: "Super Bowl Survivor",
    sport: "NFL",
    type: "survivor",
    entryFee: 50,
    prizePool: 50000,
    maxEntries: 1000,
    currentEntries: 892,
    startTime: "2025-02-09T18:30:00Z",
    status: "open",
    creatorId: "user_1",
    rules: "Pick one team each week to win. You can only use each team once. Last person standing wins.",
    prizes: [
      { place: 1, amount: 50000 },
    ],
  },
  {
    id: "4",
    name: "March Madness Bracket",
    sport: "NBA",
    type: "pickem",
    entryFee: 20,
    prizePool: 10000,
    maxEntries: 500,
    currentEntries: 412,
    startTime: "2025-03-15T12:00:00Z",
    status: "open",
    creatorId: "user_3",
    rules: "Fill out your bracket. Score points for each correct pick. More points for later rounds.",
    prizes: [
      { place: 1, amount: 5000 },
      { place: 2, amount: 2500 },
      { place: 3, amount: 1500 },
      { place: 4, amount: 500 },
      { place: 5, amount: 500 },
    ],
  },
  {
    id: "5",
    name: "Golf Masters Pool",
    sport: "Golf",
    type: "pickem",
    entryFee: 100,
    prizePool: 75000,
    maxEntries: 750,
    currentEntries: 623,
    startTime: "2025-04-10T08:00:00Z",
    status: "open",
    creatorId: "user_2",
    rules: "Select 6 golfers. Earn points based on their tournament finish. Lowest cumulative score wins.",
    prizes: [
      { place: 1, amount: 25000 },
      { place: 2, amount: 15000 },
      { place: 3, amount: 10000 },
      { place: 4, amount: 5000 },
      { place: 5, amount: 2500 },
    ],
  },
  {
    id: "6",
    name: "EPL Season Challenge",
    sport: "Soccer",
    type: "season",
    entryFee: 150,
    prizePool: 200000,
    maxEntries: 2000,
    currentEntries: 1456,
    startTime: "2025-08-12T14:00:00Z",
    status: "open",
    creatorId: "user_1",
    rules: "Draft a squad of 15 players. Manage your team weekly with transfers. Top scorer at season end wins.",
    prizes: [
      { place: 1, amount: 75000 },
      { place: 2, amount: 40000 },
      { place: 3, amount: 25000 },
      { place: 4, amount: 15000 },
      { place: 5, amount: 10000 },
    ],
  },
  {
    id: "7",
    name: "NHL Daily Shootout",
    sport: "NHL",
    type: "daily",
    entryFee: 5,
    prizePool: 5000,
    maxEntries: 1500,
    currentEntries: 987,
    startTime: "2025-02-08T19:00:00Z",
    status: "live",
    creatorId: "user_3",
    rules: "Select 6 skaters and 1 goalie within salary cap. Points for goals, assists, saves, and shutouts.",
    prizes: [
      { place: 1, amount: 1500 },
      { place: 2, amount: 750 },
      { place: 3, amount: 500 },
      { place: 4, amount: 250 },
      { place: 5, amount: 150 },
    ],
  },
  {
    id: "8",
    name: "MLB Home Run Derby",
    sport: "MLB",
    type: "pickem",
    entryFee: 15,
    prizePool: 15000,
    maxEntries: 1200,
    currentEntries: 1200,
    startTime: "2025-02-01T20:00:00Z",
    status: "completed",
    creatorId: "user_2",
    rules: "Predict total home runs for each player in the derby. Closest total wins.",
    prizes: [
      { place: 1, amount: 7500 },
      { place: 2, amount: 3500 },
      { place: 3, amount: 2000 },
      { place: 4, amount: 1000 },
      { place: 5, amount: 500 },
    ],
  },
];

export const mockEntries: Entry[] = [
  {
    id: "e1",
    contestId: "1",
    userId: "user_10",
    userName: "ProPicker22",
    userAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=propicker",
    picks: ["J. Allen", "D. Henry", "J. Chase", "T. Hill", "G. Kittle"],
    points: 187.5,
    rank: 1,
    status: "active",
  },
  {
    id: "e2",
    contestId: "1",
    userId: "user_11",
    userName: "FantasyKing",
    userAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=fantasyking",
    picks: ["P. Mahomes", "S. Barkley", "A. Brown", "D. Adams", "T. Kelce"],
    points: 175.2,
    rank: 2,
    status: "active",
  },
  {
    id: "e3",
    contestId: "1",
    userId: "user_12",
    userName: "GridironGuru",
    userAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=gridriron",
    picks: ["L. Jackson", "J. Taylor", "S. Diggs", "M. Evans", "M. Andrews"],
    points: 168.8,
    rank: 3,
    status: "active",
  },
  {
    id: "e4",
    contestId: "1",
    userId: "user_13",
    userName: "DailyWinner",
    userAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=dailywinner",
    picks: ["J. Burrow", "C. McCaffrey", "J. Jefferson", "C. Lamb", "D. Waller"],
    points: 162.3,
    rank: 4,
    status: "active",
  },
  {
    id: "e5",
    contestId: "1",
    userId: "user_14",
    userName: "TouchdownTom",
    userAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=touchdown",
    picks: ["T. Lawrence", "A. Ekeler", "A. St. Brown", "D. Moore", "P. Freiermuth"],
    points: 155.1,
    rank: 5,
    status: "active",
  },
];

export const mockUserStats: UserStats = {
  contestsEntered: 47,
  contestsWon: 8,
  totalWinnings: 12450,
  winRate: 17,
};

export const mockMyEntries = [
  {
    id: "me1",
    contestId: "1",
    contestName: "NFL Sunday Million",
    sport: "NFL",
    entryFee: 25,
    status: "active" as const,
    currentRank: 127,
    totalEntries: 4127,
    points: 142.5,
    potentialWinnings: 0,
  },
  {
    id: "me2",
    contestId: "7",
    contestName: "NHL Daily Shootout",
    sport: "NHL",
    entryFee: 5,
    status: "active" as const,
    currentRank: 45,
    totalEntries: 987,
    points: 28.5,
    potentialWinnings: 250,
  },
  {
    id: "me3",
    contestId: "8",
    contestName: "MLB Home Run Derby",
    sport: "MLB",
    entryFee: 15,
    status: "won" as const,
    currentRank: 3,
    totalEntries: 1200,
    points: 47,
    potentialWinnings: 2000,
  },
];

export function getContest(id: string): Contest | undefined {
  return contests.find((c) => c.id === id);
}

export function getContestsByFilter(options: {
  sport?: string;
  type?: string;
  status?: string;
}): Contest[] {
  let filtered = [...contests];

  if (options.sport && options.sport !== "All") {
    filtered = filtered.filter((c) => c.sport === options.sport);
  }
  if (options.type && options.type !== "all") {
    filtered = filtered.filter((c) => c.type === options.type);
  }
  if (options.status && options.status !== "all") {
    filtered = filtered.filter((c) => c.status === options.status);
  }

  return filtered;
}

export function getContestEntries(contestId: string): Entry[] {
  return mockEntries.filter((e) => e.contestId === contestId);
}
