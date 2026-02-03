// Main data types and mock data for TalentDrop

export type Talent = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  category: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  projectMinimum: number;
  rating: number;
  reviewCount: number;
  completedGigs: number;
  portfolio: { id: string; title: string; thumbnail: string; type: string }[];
  verified: boolean;
  isPremium: boolean;
};

export type Gig = {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  title: string;
  description: string;
  category: string;
  budget: { min: number; max: number };
  duration: string;
  skills: string[];
  applications: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  deadline: string;
};

export type Application = {
  id: string;
  gigId: string;
  gigTitle: string;
  talentId: string;
  talentName: string;
  talentAvatar: string;
  coverLetter: string;
  proposedRate: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export const categories = [
  "Content Creators",
  "Photographers",
  "Videographers",
  "Writers",
  "Designers",
  "Developers",
];

export const talents: Talent[] = [
  {
    id: "1",
    name: "Maya Rodriguez",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=maya",
    title: "UGC Content Creator",
    category: "Content Creators",
    bio: "Full-time UGC creator with 3+ years experience working with DTC brands. I specialize in authentic, scroll-stopping content for TikTok and Instagram Reels. My content has generated over 50M views for clients including beauty, fashion, and lifestyle brands.",
    skills: ["TikTok", "Instagram Reels", "UGC", "Product Reviews", "Unboxings"],
    hourlyRate: 75,
    projectMinimum: 200,
    rating: 4.9,
    reviewCount: 127,
    completedGigs: 89,
    portfolio: [
      { id: "p1", title: "Beauty Brand Campaign", thumbnail: "https://picsum.photos/seed/maya1/400/300", type: "video" },
      { id: "p2", title: "Fashion Haul", thumbnail: "https://picsum.photos/seed/maya2/400/300", type: "video" },
      { id: "p3", title: "Tech Unboxing", thumbnail: "https://picsum.photos/seed/maya3/400/300", type: "video" },
    ],
    verified: true,
    isPremium: true,
  },
  {
    id: "2",
    name: "James Chen",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=james",
    title: "Commercial Photographer",
    category: "Photographers",
    bio: "Award-winning product and lifestyle photographer based in LA. I bring brands to life through stunning visuals that convert. Worked with Fortune 500 companies and emerging startups alike.",
    skills: ["Product Photography", "Lifestyle", "E-commerce", "Adobe Lightroom", "Studio Lighting"],
    hourlyRate: 150,
    projectMinimum: 500,
    rating: 5.0,
    reviewCount: 84,
    completedGigs: 156,
    portfolio: [
      { id: "p1", title: "Skincare Line Shoot", thumbnail: "https://picsum.photos/seed/james1/400/300", type: "photo" },
      { id: "p2", title: "Tech Product Launch", thumbnail: "https://picsum.photos/seed/james2/400/300", type: "photo" },
      { id: "p3", title: "Food & Beverage", thumbnail: "https://picsum.photos/seed/james3/400/300", type: "photo" },
    ],
    verified: true,
    isPremium: true,
  },
  {
    id: "3",
    name: "Sofia Martinez",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sofia",
    title: "Video Editor & Colorist",
    category: "Videographers",
    bio: "Professional video editor with expertise in color grading and motion graphics. I transform raw footage into cinematic stories. Quick turnaround times without compromising quality.",
    skills: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Color Grading", "Motion Graphics"],
    hourlyRate: 85,
    projectMinimum: 300,
    rating: 4.8,
    reviewCount: 62,
    completedGigs: 94,
    portfolio: [
      { id: "p1", title: "Brand Documentary", thumbnail: "https://picsum.photos/seed/sofia1/400/300", type: "video" },
      { id: "p2", title: "Music Video", thumbnail: "https://picsum.photos/seed/sofia2/400/300", type: "video" },
      { id: "p3", title: "Commercial Spot", thumbnail: "https://picsum.photos/seed/sofia3/400/300", type: "video" },
    ],
    verified: true,
    isPremium: false,
  },
  {
    id: "4",
    name: "Alex Thompson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alext",
    title: "Copywriter & Content Strategist",
    category: "Writers",
    bio: "Words that sell. I craft compelling copy for landing pages, email sequences, and social media. Former agency copywriter now freelancing full-time. Let me help tell your brand's story.",
    skills: ["Copywriting", "Email Marketing", "Landing Pages", "SEO", "Brand Voice"],
    hourlyRate: 100,
    projectMinimum: 250,
    rating: 4.9,
    reviewCount: 93,
    completedGigs: 178,
    portfolio: [
      { id: "p1", title: "SaaS Landing Page", thumbnail: "https://picsum.photos/seed/alex1/400/300", type: "text" },
      { id: "p2", title: "Email Sequence", thumbnail: "https://picsum.photos/seed/alex2/400/300", type: "text" },
      { id: "p3", title: "Brand Manifesto", thumbnail: "https://picsum.photos/seed/alex3/400/300", type: "text" },
    ],
    verified: true,
    isPremium: true,
  },
  {
    id: "5",
    name: "Kim Park",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=kim",
    title: "Brand & UI Designer",
    category: "Designers",
    bio: "I design beautiful, functional brand identities and digital experiences. From logos to full design systems, I help startups and established brands stand out in crowded markets.",
    skills: ["Brand Identity", "Logo Design", "UI/UX", "Figma", "Illustration"],
    hourlyRate: 120,
    projectMinimum: 1000,
    rating: 4.7,
    reviewCount: 56,
    completedGigs: 67,
    portfolio: [
      { id: "p1", title: "Tech Startup Branding", thumbnail: "https://picsum.photos/seed/kim1/400/300", type: "design" },
      { id: "p2", title: "Mobile App UI", thumbnail: "https://picsum.photos/seed/kim2/400/300", type: "design" },
      { id: "p3", title: "Restaurant Identity", thumbnail: "https://picsum.photos/seed/kim3/400/300", type: "design" },
    ],
    verified: true,
    isPremium: false,
  },
  {
    id: "6",
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcusj",
    title: "Full-Stack Developer",
    category: "Developers",
    bio: "I build modern web applications and MVPs for startups. Specializing in React, Node.js, and cloud infrastructure. From idea to launch in weeks, not months.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    hourlyRate: 150,
    projectMinimum: 2000,
    rating: 4.9,
    reviewCount: 41,
    completedGigs: 52,
    portfolio: [
      { id: "p1", title: "E-commerce Platform", thumbnail: "https://picsum.photos/seed/marcus1/400/300", type: "code" },
      { id: "p2", title: "SaaS Dashboard", thumbnail: "https://picsum.photos/seed/marcus2/400/300", type: "code" },
      { id: "p3", title: "Mobile App Backend", thumbnail: "https://picsum.photos/seed/marcus3/400/300", type: "code" },
    ],
    verified: true,
    isPremium: true,
  },
  {
    id: "7",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emma",
    title: "Social Media Content Creator",
    category: "Content Creators",
    bio: "I create thumb-stopping social content that drives engagement. Specializing in lifestyle, wellness, and food content. Let me help grow your social presence.",
    skills: ["Instagram", "TikTok", "Content Strategy", "Photography", "Storytelling"],
    hourlyRate: 65,
    projectMinimum: 150,
    rating: 4.8,
    reviewCount: 78,
    completedGigs: 112,
    portfolio: [
      { id: "p1", title: "Wellness Brand", thumbnail: "https://picsum.photos/seed/emma1/400/300", type: "video" },
      { id: "p2", title: "Food Content", thumbnail: "https://picsum.photos/seed/emma2/400/300", type: "video" },
      { id: "p3", title: "Lifestyle Reel", thumbnail: "https://picsum.photos/seed/emma3/400/300", type: "video" },
    ],
    verified: false,
    isPremium: false,
  },
  {
    id: "8",
    name: "Ryan Lee",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ryan",
    title: "Drone Videographer",
    category: "Videographers",
    bio: "FAA certified drone pilot capturing stunning aerial footage for real estate, events, and commercial projects. Based in Miami but available for travel.",
    skills: ["Drone Operations", "Aerial Photography", "Real Estate", "4K Video", "FAA Part 107"],
    hourlyRate: 200,
    projectMinimum: 500,
    rating: 5.0,
    reviewCount: 34,
    completedGigs: 45,
    portfolio: [
      { id: "p1", title: "Luxury Real Estate", thumbnail: "https://picsum.photos/seed/ryan1/400/300", type: "video" },
      { id: "p2", title: "Beach Resort", thumbnail: "https://picsum.photos/seed/ryan2/400/300", type: "video" },
      { id: "p3", title: "Event Coverage", thumbnail: "https://picsum.photos/seed/ryan3/400/300", type: "video" },
    ],
    verified: true,
    isPremium: true,
  },
  {
    id: "9",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=priya",
    title: "Technical Writer",
    category: "Writers",
    bio: "Making complex topics simple. I write developer documentation, API guides, and technical blog posts. Background in software engineering ensures accuracy and clarity.",
    skills: ["Technical Writing", "API Documentation", "Developer Docs", "Markdown", "Developer Experience"],
    hourlyRate: 90,
    projectMinimum: 400,
    rating: 4.9,
    reviewCount: 47,
    completedGigs: 68,
    portfolio: [
      { id: "p1", title: "API Documentation", thumbnail: "https://picsum.photos/seed/priya1/400/300", type: "text" },
      { id: "p2", title: "Developer Guide", thumbnail: "https://picsum.photos/seed/priya2/400/300", type: "text" },
      { id: "p3", title: "Technical Blog", thumbnail: "https://picsum.photos/seed/priya3/400/300", type: "text" },
    ],
    verified: true,
    isPremium: false,
  },
];

export const gigs: Gig[] = [
  {
    id: "g1",
    clientId: "c1",
    clientName: "FoodFluence",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=FF",
    title: "UGC Creator for Food Delivery App Launch",
    description: "We're launching a new food delivery app and need 5 authentic UGC videos showcasing the ordering experience. Looking for creators who can make everyday moments feel exciting. Videos should be 15-30 seconds, vertical format, ready for TikTok and Reels.",
    category: "Content Creators",
    budget: { min: 500, max: 1000 },
    duration: "1-2 weeks",
    skills: ["UGC", "TikTok", "Food Content", "Mobile Filming"],
    applications: 12,
    status: "open",
    createdAt: "2 days ago",
    deadline: "Feb 15, 2025",
  },
  {
    id: "g2",
    clientId: "c2",
    clientName: "VeroSkills",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=VS",
    title: "Product Photography for Online Course Platform",
    description: "Need high-quality product shots of our learning platform on various devices (laptop, tablet, phone). Should convey professionalism and modern learning. White background and lifestyle shots both needed.",
    category: "Photographers",
    budget: { min: 800, max: 1500 },
    duration: "3-5 days",
    skills: ["Product Photography", "E-commerce", "Tech Photography", "Lifestyle"],
    applications: 8,
    status: "open",
    createdAt: "1 day ago",
    deadline: "Feb 10, 2025",
  },
  {
    id: "g3",
    clientId: "c3",
    clientName: "Hey Amara",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=HA",
    title: "Brand Video for AI Voice Assistant",
    description: "Looking for a videographer/editor to create a 60-second brand video introducing our AI voice assistant. Should feel warm, human, and innovative. We have the script and vision, need someone to bring it to life.",
    category: "Videographers",
    budget: { min: 2000, max: 4000 },
    duration: "2-3 weeks",
    skills: ["Video Production", "Motion Graphics", "Color Grading", "Sound Design"],
    applications: 15,
    status: "open",
    createdAt: "5 hours ago",
    deadline: "Feb 28, 2025",
  },
  {
    id: "g4",
    clientId: "c4",
    clientName: "TechStart Inc",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=TS",
    title: "Website Copy Overhaul",
    description: "Our B2B SaaS website needs a complete copy refresh. Looking for a copywriter who understands tech products and can write compelling, conversion-focused copy. Includes homepage, product pages, and about page.",
    category: "Writers",
    budget: { min: 1500, max: 2500 },
    duration: "1-2 weeks",
    skills: ["Copywriting", "B2B", "SaaS", "Conversion Optimization"],
    applications: 23,
    status: "open",
    createdAt: "3 days ago",
    deadline: "Feb 20, 2025",
  },
  {
    id: "g5",
    clientId: "c5",
    clientName: "GreenLeaf Wellness",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=GW",
    title: "Complete Brand Identity Design",
    description: "New wellness brand launching in Q2 needs complete visual identity. Logo, color palette, typography, brand guidelines, and social media templates. Looking for a designer who can capture calm, natural, premium vibes.",
    category: "Designers",
    budget: { min: 3000, max: 5000 },
    duration: "3-4 weeks",
    skills: ["Brand Identity", "Logo Design", "Brand Guidelines", "Social Media Design"],
    applications: 19,
    status: "open",
    createdAt: "1 week ago",
    deadline: "Mar 1, 2025",
  },
  {
    id: "g6",
    clientId: "c6",
    clientName: "QuickShip Logistics",
    clientAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=QS",
    title: "React Dashboard Development",
    description: "Need a frontend developer to build a real-time tracking dashboard for our logistics platform. Design is ready in Figma. Tech stack: React, TypeScript, Tailwind, connecting to existing GraphQL API.",
    category: "Developers",
    budget: { min: 4000, max: 6000 },
    duration: "2-3 weeks",
    skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
    applications: 11,
    status: "open",
    createdAt: "4 days ago",
    deadline: "Feb 25, 2025",
  },
];

export const applications: Application[] = [
  {
    id: "a1",
    gigId: "g1",
    gigTitle: "UGC Creator for Food Delivery App Launch",
    talentId: "1",
    talentName: "Maya Rodriguez",
    talentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=maya",
    coverLetter: "Hi! I've created UGC content for several food and beverage brands including HelloFresh and DoorDash. My content consistently achieves above-average engagement rates. I'd love to bring the same energy to your app launch!",
    proposedRate: 800,
    status: "pending",
    createdAt: "1 day ago",
  },
  {
    id: "a2",
    gigId: "g1",
    gigTitle: "UGC Creator for Food Delivery App Launch",
    talentId: "7",
    talentName: "Emma Wilson",
    talentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emma",
    coverLetter: "Food content is my specialty! Check out my portfolio for examples of similar work. I can deliver all 5 videos within your timeline and offer unlimited revisions.",
    proposedRate: 650,
    status: "pending",
    createdAt: "2 days ago",
  },
  {
    id: "a3",
    gigId: "g2",
    gigTitle: "Product Photography for Online Course Platform",
    talentId: "2",
    talentName: "James Chen",
    talentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=james",
    coverLetter: "I've shot product photography for several tech and EdTech companies. My studio is fully equipped for the clean, modern aesthetic you're looking for. Happy to do a test shot.",
    proposedRate: 1200,
    status: "accepted",
    createdAt: "12 hours ago",
  },
];

export function getTalent(id: string): Talent | undefined {
  return talents.find((t) => t.id === id);
}

export function getTalentsByCategory(category: string): Talent[] {
  if (category === "All") return talents;
  return talents.filter((t) => t.category === category);
}

export function getGig(id: string): Gig | undefined {
  return gigs.find((g) => g.id === id);
}

export function getGigsByCategory(category: string): Gig[] {
  if (category === "All") return gigs;
  return gigs.filter((g) => g.category === category);
}

export function getApplicationsForGig(gigId: string): Application[] {
  return applications.filter((a) => a.gigId === gigId);
}
