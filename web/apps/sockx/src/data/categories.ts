export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "athletic",
    name: "Athletic",
    description: "Performance socks for sport and training",
    image: "https://images.unsplash.com/photo-1615486364462-ef6363adbc18?w=600&h=600&fit=crop",
  },
  {
    id: "designer",
    name: "Designer",
    description: "Luxury socks from top fashion houses",
    image: "https://images.unsplash.com/photo-1598818432520-f57c636e9301?w=600&h=600&fit=crop",
  },
  {
    id: "limited-edition",
    name: "Limited Edition",
    description: "Rare drops and exclusive releases",
    image: "https://images.unsplash.com/photo-1566563634870-d566ab58a4df?w=600&h=600&fit=crop",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Classic and retro sock styles",
    image: "https://images.unsplash.com/photo-1633950646153-0ba646405a6d?w=600&h=600&fit=crop",
  },
  {
    id: "collab",
    name: "Collab",
    description: "Brand collaborations and special editions",
    image: "https://images.unsplash.com/photo-1734522874304-97e48df1d4c8?w=600&h=600&fit=crop",
  },
  {
    id: "basics",
    name: "Basics",
    description: "Everyday essentials with streetwear flair",
    image: "https://images.unsplash.com/photo-1640348307421-83b15b62a73d?w=600&h=600&fit=crop",
  },
];
