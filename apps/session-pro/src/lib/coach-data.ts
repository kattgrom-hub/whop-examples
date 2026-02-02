// Mock data for coach dashboard

export type Session = {
  id: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  time: string;
  duration: number; // minutes
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
};

export const mockSessions: Session[] = [
  {
    id: "s1",
    studentName: "Jamie Wilson",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
    date: "2025-02-03",
    time: "10:00 AM",
    duration: 60,
    amount: 75,
    status: "upcoming",
  },
  {
    id: "s2",
    studentName: "Casey Brown",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=casey",
    date: "2025-02-03",
    time: "2:00 PM",
    duration: 60,
    amount: 75,
    status: "upcoming",
  },
  {
    id: "s3",
    studentName: "Morgan Lee",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=morgan",
    date: "2025-02-01",
    time: "11:00 AM",
    duration: 60,
    amount: 75,
    status: "completed",
  },
  {
    id: "s4",
    studentName: "Taylor Smith",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=taylor",
    date: "2025-01-30",
    time: "3:00 PM",
    duration: 60,
    amount: 75,
    status: "completed",
  },
  {
    id: "s5",
    studentName: "Jordan Park",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jordanp",
    date: "2025-01-28",
    time: "10:00 AM",
    duration: 60,
    amount: 75,
    status: "completed",
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "p1",
    amount: 450,
    status: "completed",
    date: "2025-01-25",
    method: "Bank Account ••••4242",
  },
  {
    id: "p2",
    amount: 375,
    status: "completed",
    date: "2025-01-18",
    method: "Bank Account ••••4242",
  },
  {
    id: "p3",
    amount: 525,
    status: "completed",
    date: "2025-01-11",
    method: "Bank Account ••••4242",
  },
];

export const mockEarnings = {
  availableBalance: 225, // Ready to withdraw
  pendingBalance: 150, // From recent sessions, clearing
  totalEarned: 1575, // All time
  thisMonth: 375,
  lastMonth: 450,
};
