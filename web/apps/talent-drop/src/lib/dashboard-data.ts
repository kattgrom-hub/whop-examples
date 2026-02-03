// Mock data for dashboard views

export type Job = {
  id: string;
  gigId: string;
  gigTitle: string;
  clientName: string;
  clientAvatar: string;
  status: "active" | "completed" | "cancelled";
  startDate: string;
  deadline: string;
  progress: number; // 0-100
  amount: number;
  milestones: { id: string; title: string; completed: boolean }[];
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  date: string;
  method: string;
  gigTitle?: string;
};

export type PostedGig = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  applications: number;
  budget: { min: number; max: number };
  createdAt: string;
  deadline: string;
  hiredTalent?: {
    name: string;
    avatar: string;
  };
};

// Talent dashboard data
export const mockJobs: Job[] = [
  {
    id: "j1",
    gigId: "g2",
    gigTitle: "Product Photography for Online Course Platform",
    clientName: "VeroSkills",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=VS",
    status: "active",
    startDate: "Feb 1, 2025",
    deadline: "Feb 10, 2025",
    progress: 60,
    amount: 1200,
    milestones: [
      { id: "m1", title: "Initial concepts approved", completed: true },
      { id: "m2", title: "Photoshoot completed", completed: true },
      { id: "m3", title: "Editing & retouching", completed: false },
      { id: "m4", title: "Final delivery", completed: false },
    ],
  },
  {
    id: "j2",
    gigId: "g7",
    gigTitle: "Social Media Content Package",
    clientName: "StyleBox",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=SB",
    status: "completed",
    startDate: "Jan 15, 2025",
    deadline: "Jan 28, 2025",
    progress: 100,
    amount: 850,
    milestones: [
      { id: "m1", title: "Content calendar approved", completed: true },
      { id: "m2", title: "First batch delivered", completed: true },
      { id: "m3", title: "Revisions completed", completed: true },
      { id: "m4", title: "Final delivery", completed: true },
    ],
  },
  {
    id: "j3",
    gigId: "g8",
    gigTitle: "Brand Video Production",
    clientName: "TechNova",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=TN",
    status: "completed",
    startDate: "Jan 5, 2025",
    deadline: "Jan 20, 2025",
    progress: 100,
    amount: 2500,
    milestones: [
      { id: "m1", title: "Script finalized", completed: true },
      { id: "m2", title: "Filming completed", completed: true },
      { id: "m3", title: "First cut review", completed: true },
      { id: "m4", title: "Final delivery", completed: true },
    ],
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "p1",
    amount: 850,
    status: "completed",
    date: "Jan 30, 2025",
    method: "Bank Account ****4242",
    gigTitle: "Social Media Content Package",
  },
  {
    id: "p2",
    amount: 2500,
    status: "completed",
    date: "Jan 22, 2025",
    method: "Bank Account ****4242",
    gigTitle: "Brand Video Production",
  },
  {
    id: "p3",
    amount: 600,
    status: "processing",
    date: "Feb 1, 2025",
    method: "Bank Account ****4242",
    gigTitle: "Product Photography (Milestone 2)",
  },
];

export const mockEarnings = {
  availableBalance: 850,
  pendingBalance: 1200, // From active job
  totalEarned: 8750,
  thisMonth: 1450,
  lastMonth: 3350,
};

// Client dashboard data
export const mockPostedGigs: PostedGig[] = [
  {
    id: "pg1",
    title: "UGC Creator for Food Delivery App Launch",
    status: "open",
    applications: 12,
    budget: { min: 500, max: 1000 },
    createdAt: "2 days ago",
    deadline: "Feb 15, 2025",
  },
  {
    id: "pg2",
    title: "Product Photography for Online Course Platform",
    status: "in_progress",
    applications: 8,
    budget: { min: 800, max: 1500 },
    createdAt: "1 week ago",
    deadline: "Feb 10, 2025",
    hiredTalent: {
      name: "James Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=james",
    },
  },
  {
    id: "pg3",
    title: "Social Media Manager - 3 Month Contract",
    status: "completed",
    applications: 24,
    budget: { min: 2000, max: 3000 },
    createdAt: "2 months ago",
    deadline: "Jan 31, 2025",
    hiredTalent: {
      name: "Maya Rodriguez",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=maya",
    },
  },
];

export const clientStats = {
  activeGigs: 2,
  totalSpent: 12500,
  talentHired: 8,
  completedProjects: 6,
};
