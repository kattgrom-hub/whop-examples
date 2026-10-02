export interface Product {
  id: string; whopProductId: string; name: string; category: string; price: number;
  description: string; headline: string; features: string[]; tone: "coastal" | "gold";
}
export const products: Product[] = [
  { id: "coastal-creator-toolkit", whopProductId: "prod_lW8tQxG87dsKP", name: "Coastal Creator Toolkit", category: "Lifestyle & coastal content", price: 29.99, tone: "coastal",
    headline: "A little more flow. A lot less guesswork.",
    description: "A complete toolkit for coastal and lifestyle creators — templates, editing workflows, and content systems to help you produce beach-worthy content fast, without the guesswork.",
    features: ["Creator templates", "Editing workflows", "Content systems"] },
  { id: "viral-gold-video-kit", whopProductId: "prod_IjbZFclq4nnH4", name: "Viral Gold Video Kit", category: "Short-form video", price: 29.99, tone: "gold",
    headline: "Give your next video a stronger start.",
    description: "Templates, hook formulas, editing techniques, sound strategy and platform blueprints for creators making TikTok videos, Instagram Reels and YouTube Shorts.",
    features: ["Done-for-you templates", "Hook formulas", "Editing techniques", "Sound strategy", "Platform blueprints", "Trend framework", "Analytics checklists"] },
];
export const formatPrice = (price: number) => `A$${price.toFixed(2)}`;
