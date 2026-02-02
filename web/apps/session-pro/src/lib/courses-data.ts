export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  lessons: number;
  duration: string;
  students: number;
  status: "draft" | "published";
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "text" | "quiz";
  completed: boolean;
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Valorant Aim Fundamentals",
    description: "Master the basics of aim training, crosshair placement, and pre-aim techniques.",
    thumbnail: "https://placehold.co/400x225/1f2937/6366f1?text=Aim+Fundamentals",
    price: 49,
    lessons: 12,
    duration: "2h 30m",
    students: 234,
    status: "published",
  },
  {
    id: "c2",
    title: "Advanced Game Sense",
    description: "Learn to read the game, predict enemy movements, and make better decisions.",
    thumbnail: "https://placehold.co/400x225/1f2937/6366f1?text=Game+Sense",
    price: 79,
    lessons: 18,
    duration: "4h 15m",
    students: 156,
    status: "published",
  },
  {
    id: "c3",
    title: "Agent Mastery: Jett",
    description: "Everything you need to dominate with Jett - movement, abilities, and lineups.",
    thumbnail: "https://placehold.co/400x225/1f2937/6366f1?text=Jett+Mastery",
    price: 39,
    lessons: 8,
    duration: "1h 45m",
    students: 0,
    status: "draft",
  },
];

export const mockLessons: Lesson[] = [
  { id: "l1", title: "Introduction to Aim Training", duration: "5:30", type: "video", completed: true },
  { id: "l2", title: "Understanding Sensitivity", duration: "12:45", type: "video", completed: true },
  { id: "l3", title: "Crosshair Placement Basics", duration: "18:20", type: "video", completed: false },
  { id: "l4", title: "Pre-aim Common Angles", duration: "15:00", type: "video", completed: false },
  { id: "l5", title: "Quiz: Crosshair Placement", duration: "5 questions", type: "quiz", completed: false },
];
