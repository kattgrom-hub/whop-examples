export type Analyst = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  sports: string[];
  monthlyPrice: number;
  record: { wins: number; losses: number; pushes: number };
  roi: number;
  streak: number;
  subscriberCount: number;
  verified: boolean;
};

export type Pick = {
  id: string;
  analystId: string;
  sport: string;
  league: string;
  matchup: string;
  pickType: string;
  pick: string;
  odds: string;
  units: number;
  analysis: string;
  result?: "win" | "loss" | "push" | "pending";
  createdAt: string;
  gameTime: string;
};

export const sports = [
  { id: "nfl", name: "NFL", emoji: "🏈" },
  { id: "nba", name: "NBA", emoji: "🏀" },
  { id: "mlb", name: "MLB", emoji: "⚾" },
  { id: "nhl", name: "NHL", emoji: "🏒" },
  { id: "soccer", name: "Soccer", emoji: "⚽" },
  { id: "tennis", name: "Tennis", emoji: "🎾" },
];

export const analysts: Analyst[] = [
  {
    id: "1",
    name: "Mike Sharp",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mikesharp",
    bio: "Former Vegas oddsmaker with 15+ years experience. Specializing in NFL spreads and totals. My edge comes from understanding line movement and sharp money.",
    sports: ["NFL", "NBA"],
    monthlyPrice: 79,
    record: { wins: 287, losses: 198, pushes: 15 },
    roi: 12.4,
    streak: 5,
    subscriberCount: 2847,
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Hoops",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarahhoops",
    bio: "NBA specialist since 2015. Former D1 basketball player turned analyst. I focus on player props and live betting angles.",
    sports: ["NBA"],
    monthlyPrice: 49,
    record: { wins: 412, losses: 301, pushes: 8 },
    roi: 9.2,
    streak: 3,
    subscriberCount: 1923,
    verified: true,
  },
  {
    id: "3",
    name: "Tommy Touchdown",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=tommytd",
    bio: "NFL expert with a focus on primetime games. Over 60% win rate on Sunday/Monday night games. Let's cash some tickets.",
    sports: ["NFL"],
    monthlyPrice: 59,
    record: { wins: 156, losses: 112, pushes: 7 },
    roi: 8.7,
    streak: -2,
    subscriberCount: 1456,
    verified: true,
  },
  {
    id: "4",
    name: "Ice King",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=iceking",
    bio: "NHL specialist since 2010. Former minor league player with deep knowledge of the game. Puck lines and totals are my bread and butter.",
    sports: ["NHL"],
    monthlyPrice: 39,
    record: { wins: 198, losses: 157, pushes: 12 },
    roi: 7.8,
    streak: 4,
    subscriberCount: 876,
    verified: false,
  },
  {
    id: "5",
    name: "Diamond Picks",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=diamondpicks",
    bio: "MLB and soccer specialist. I use advanced analytics and models to find value. Consistent profits over flashy plays.",
    sports: ["MLB", "Soccer"],
    monthlyPrice: 69,
    record: { wins: 324, losses: 256, pushes: 18 },
    roi: 6.9,
    streak: 1,
    subscriberCount: 1234,
    verified: true,
  },
  {
    id: "6",
    name: "Ace Analyst",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aceanalyst",
    bio: "Tennis expert covering ATP, WTA, and Grand Slams. Surface specialist with deep knowledge of player matchups.",
    sports: ["Tennis"],
    monthlyPrice: 45,
    record: { wins: 267, losses: 203, pushes: 5 },
    roi: 11.2,
    streak: 7,
    subscriberCount: 945,
    verified: true,
  },
  {
    id: "7",
    name: "Goal Machine",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=goalmachine",
    bio: "European soccer specialist covering Premier League, La Liga, and Champions League. Early morning value plays are my specialty.",
    sports: ["Soccer"],
    monthlyPrice: 55,
    record: { wins: 189, losses: 142, pushes: 9 },
    roi: 10.5,
    streak: 2,
    subscriberCount: 1567,
    verified: true,
  },
  {
    id: "8",
    name: "The Professor",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=professor",
    bio: "Data scientist turned sports analyst. I use machine learning models across all major sports. Quality over quantity.",
    sports: ["NFL", "NBA", "MLB"],
    monthlyPrice: 99,
    record: { wins: 445, losses: 312, pushes: 22 },
    roi: 14.1,
    streak: 6,
    subscriberCount: 3421,
    verified: true,
  },
];

export const picks: Pick[] = [
  {
    id: "p1",
    analystId: "1",
    sport: "NFL",
    league: "NFL",
    matchup: "Chiefs vs Bills",
    pickType: "Spread",
    pick: "Chiefs -3.5",
    odds: "-110",
    units: 3,
    analysis: "Chiefs are 8-2 ATS as road favorites this season. Buffalo's defense has struggled against mobile QBs, and Mahomes is playing at an MVP level.",
    result: "pending",
    createdAt: "2025-02-02T10:30:00Z",
    gameTime: "2025-02-02T18:30:00Z",
  },
  {
    id: "p2",
    analystId: "2",
    sport: "NBA",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    pickType: "Over/Under",
    pick: "Over 224.5",
    odds: "-105",
    units: 2,
    analysis: "Both teams playing on zero rest and historically these matchups see high scores. Combined 5 of last 6 meetings have gone over.",
    result: "pending",
    createdAt: "2025-02-02T09:15:00Z",
    gameTime: "2025-02-02T20:00:00Z",
  },
  {
    id: "p3",
    analystId: "1",
    sport: "NFL",
    league: "NFL",
    matchup: "Eagles vs Cowboys",
    pickType: "Moneyline",
    pick: "Eagles ML",
    odds: "-145",
    units: 4,
    analysis: "Eagles are the better team and have dominated this rivalry recently. Cowboys dealing with key injuries on defense.",
    result: "win",
    createdAt: "2025-02-01T14:00:00Z",
    gameTime: "2025-02-01T16:25:00Z",
  },
  {
    id: "p4",
    analystId: "3",
    sport: "NFL",
    league: "NFL",
    matchup: "49ers vs Seahawks",
    pickType: "Spread",
    pick: "49ers -6.5",
    odds: "-110",
    units: 2,
    analysis: "San Francisco has owned this matchup at home. CMC is healthy and Purdy is playing like a top-5 QB.",
    result: "loss",
    createdAt: "2025-02-01T12:00:00Z",
    gameTime: "2025-02-01T16:25:00Z",
  },
  {
    id: "p5",
    analystId: "4",
    sport: "NHL",
    league: "NHL",
    matchup: "Bruins vs Rangers",
    pickType: "Puck Line",
    pick: "Bruins -1.5",
    odds: "+145",
    units: 1,
    analysis: "Value play here. Bruins are 12-4 at home covering the puck line. Rangers on a back-to-back.",
    result: "win",
    createdAt: "2025-02-01T11:00:00Z",
    gameTime: "2025-02-01T19:00:00Z",
  },
  {
    id: "p6",
    analystId: "2",
    sport: "NBA",
    league: "NBA",
    matchup: "Bucks vs Heat",
    pickType: "Spread",
    pick: "Heat +7.5",
    odds: "-110",
    units: 2,
    analysis: "Heat always play Milwaukee tough, especially at home. Jimmy Butler is back and Giannis is questionable.",
    result: "win",
    createdAt: "2025-02-01T10:30:00Z",
    gameTime: "2025-02-01T19:30:00Z",
  },
  {
    id: "p7",
    analystId: "5",
    sport: "MLB",
    league: "MLB",
    matchup: "Yankees vs Red Sox",
    pickType: "Moneyline",
    pick: "Yankees ML",
    odds: "-130",
    units: 3,
    analysis: "Cole on the mound gives Yankees the edge. Yanks are 15-4 when Cole starts against division rivals.",
    result: "pending",
    createdAt: "2025-02-02T08:00:00Z",
    gameTime: "2025-02-02T19:10:00Z",
  },
  {
    id: "p8",
    analystId: "6",
    sport: "Tennis",
    league: "ATP",
    matchup: "Djokovic vs Alcaraz",
    pickType: "Moneyline",
    pick: "Alcaraz ML",
    odds: "+120",
    units: 2,
    analysis: "Alcaraz has won their last 3 meetings on hard court. Djokovic showing signs of fatigue this tournament.",
    result: "pending",
    createdAt: "2025-02-02T06:00:00Z",
    gameTime: "2025-02-02T14:00:00Z",
  },
  {
    id: "p9",
    analystId: "7",
    sport: "Soccer",
    league: "Premier League",
    matchup: "Arsenal vs Man City",
    pickType: "Both Teams Score",
    pick: "Yes",
    odds: "-125",
    units: 2,
    analysis: "These two have combined for 15 goals in their last 4 meetings. Both sides have elite attacking talent.",
    result: "win",
    createdAt: "2025-02-01T05:00:00Z",
    gameTime: "2025-02-01T12:30:00Z",
  },
  {
    id: "p10",
    analystId: "8",
    sport: "NBA",
    league: "NBA",
    matchup: "Nuggets vs Suns",
    pickType: "Player Prop",
    pick: "Jokic Over 11.5 Rebounds",
    odds: "-115",
    units: 3,
    analysis: "Jokic averages 14.2 boards vs Suns. Phoenix lacks rim protection and Jokic feasts on the glass.",
    result: "win",
    createdAt: "2025-02-01T13:00:00Z",
    gameTime: "2025-02-01T21:30:00Z",
  },
];

export function getAnalyst(id: string): Analyst | undefined {
  return analysts.find((a) => a.id === id);
}

export function getAnalystsBySport(sport: string): Analyst[] {
  if (sport === "All") return analysts;
  return analysts.filter((a) => a.sports.includes(sport));
}

export function getPicksByAnalyst(analystId: string): Pick[] {
  return picks.filter((p) => p.analystId === analystId);
}

export function getRecentPicks(limit = 10): Pick[] {
  return [...picks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getPendingPicks(): Pick[] {
  return picks.filter((p) => p.result === "pending");
}

export function getAnalystRecord(analystId: string): { wins: number; losses: number; pushes: number; roi: number } {
  const analyst = getAnalyst(analystId);
  if (!analyst) return { wins: 0, losses: 0, pushes: 0, roi: 0 };
  return { ...analyst.record, roi: analyst.roi };
}
