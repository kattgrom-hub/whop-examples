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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  },
  {
    id: "designer",
    name: "Designer",
    description: "Luxury socks from top fashion houses",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=600&fit=crop",
  },
  {
    id: "limited-edition",
    name: "Limited Edition",
    description: "Rare drops and exclusive releases",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=600&fit=crop",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Classic and retro sock styles",
    image: "https://images.unsplash.com/photo-1617606002806-94e279c22567?w=600&h=600&fit=crop",
  },
  {
    id: "collab",
    name: "Collab",
    description: "Brand collaborations and special editions",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop",
  },
  {
    id: "basics",
    name: "Basics",
    description: "Everyday essentials with streetwear flair",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop",
  },
];
