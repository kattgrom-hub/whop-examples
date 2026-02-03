// Mock user data for CampusDrop
import type { User } from "./data";

export const users: User[] = [
  {
    id: "user1",
    name: "Jake Martinez",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jake",
    campus: "UCLA",
    rating: 4.9,
    reviewCount: 47,
    memberSince: "2024-09-01",
    listingsCount: 12,
    salesCount: 34,
    verified: true,
  },
  {
    id: "user2",
    name: "Emma Chen",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emma",
    campus: "USC",
    rating: 5.0,
    reviewCount: 89,
    memberSince: "2024-06-15",
    listingsCount: 28,
    salesCount: 156,
    verified: true,
  },
  {
    id: "user3",
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcus",
    campus: "UCLA",
    rating: 4.8,
    reviewCount: 23,
    memberSince: "2024-10-12",
    listingsCount: 8,
    salesCount: 15,
    verified: true,
  },
  {
    id: "user4",
    name: "Sophie Williams",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sophie",
    campus: "Stanford",
    rating: 4.7,
    reviewCount: 56,
    memberSince: "2024-07-20",
    listingsCount: 15,
    salesCount: 42,
    verified: true,
  },
  {
    id: "user5",
    name: "Alex Kim",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alexk",
    campus: "UC Berkeley",
    rating: 4.6,
    reviewCount: 31,
    memberSince: "2024-08-05",
    listingsCount: 6,
    salesCount: 18,
    verified: true,
  },
  {
    id: "user6",
    name: "Taylor Park",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=taylor",
    campus: "UCLA",
    rating: 4.9,
    reviewCount: 78,
    memberSince: "2024-05-10",
    listingsCount: 22,
    salesCount: 98,
    verified: true,
  },
  {
    id: "user7",
    name: "Jordan Lee",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jordan",
    campus: "UCSD",
    rating: 4.5,
    reviewCount: 19,
    memberSince: "2024-11-01",
    listingsCount: 5,
    salesCount: 8,
    verified: false,
  },
  {
    id: "user8",
    name: "Casey Rivera",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=casey",
    campus: "Cal Poly",
    rating: 4.8,
    reviewCount: 42,
    memberSince: "2024-09-20",
    listingsCount: 11,
    salesCount: 29,
    verified: true,
  },
  {
    id: "user9",
    name: "Morgan Davis",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=morgan",
    campus: "UCSB",
    rating: 4.7,
    reviewCount: 35,
    memberSince: "2024-08-15",
    listingsCount: 9,
    salesCount: 21,
    verified: true,
  },
  {
    id: "user_current",
    name: "Demo User",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=currentuser",
    campus: "UCLA",
    rating: 4.8,
    reviewCount: 12,
    memberSince: "2024-10-01",
    listingsCount: 3,
    salesCount: 5,
    verified: true,
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersByCampus(campus: string): User[] {
  return users.filter((u) => u.campus === campus);
}

export function getTopSellers(limit = 5): User[] {
  return [...users]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit);
}
