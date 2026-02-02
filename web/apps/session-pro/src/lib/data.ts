export type Coach = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
  skills: string[];
};

export const categories = [
  "Gaming",
  "Music",
  "Fitness",
  "Business",
  "Design",
  "Programming",
];

export const coaches: Coach[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
    title: "Pro Valorant Coach",
    category: "Gaming",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 75,
    bio: "Former pro player with 5+ years coaching experience. Helped 50+ students reach Immortal rank. Specializing in aim training, game sense, and mental fortitude.",
    skills: ["Valorant", "Aim Training", "Game Sense", "VOD Review"],
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
    title: "Guitar Instructor",
    category: "Music",
    rating: 5.0,
    reviewCount: 89,
    hourlyRate: 60,
    bio: "Berklee graduate with 10 years of teaching experience. From beginner chords to advanced jazz improvisation, I'll help you find your sound.",
    skills: ["Acoustic Guitar", "Electric Guitar", "Music Theory", "Songwriting"],
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcus",
    title: "Certified Personal Trainer",
    category: "Fitness",
    rating: 4.8,
    reviewCount: 203,
    hourlyRate: 50,
    bio: "NASM certified trainer specializing in strength training and nutrition. Whether you want to lose weight or build muscle, I've got a plan for you.",
    skills: ["Strength Training", "Nutrition", "Weight Loss", "HIIT"],
  },
  {
    id: "4",
    name: "Emily Park",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emily",
    title: "Startup Advisor",
    category: "Business",
    rating: 4.9,
    reviewCount: 56,
    hourlyRate: 150,
    bio: "Ex-YC founder, raised $10M+. I help early-stage founders with fundraising, pitch decks, and go-to-market strategy.",
    skills: ["Fundraising", "Pitch Decks", "GTM Strategy", "Product"],
  },
  {
    id: "5",
    name: "Jordan Lee",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jordan",
    title: "UI/UX Design Mentor",
    category: "Design",
    rating: 4.7,
    reviewCount: 94,
    hourlyRate: 80,
    bio: "Senior designer at a Fortune 500. I'll teach you the design thinking process, Figma mastery, and portfolio building for landing your dream job.",
    skills: ["Figma", "Design Systems", "Prototyping", "Portfolio Review"],
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=david",
    title: "Full-Stack Developer",
    category: "Programming",
    rating: 4.9,
    reviewCount: 142,
    hourlyRate: 100,
    bio: "10+ years building web apps. I teach React, Node, and system design. Let's debug your code or level up your architecture skills.",
    skills: ["React", "Node.js", "System Design", "TypeScript"],
  },
];

export function getCoach(id: string): Coach | undefined {
  return coaches.find((c) => c.id === id);
}

export function getCoachesByCategory(category: string): Coach[] {
  if (category === "All") return coaches;
  return coaches.filter((c) => c.category === category);
}
