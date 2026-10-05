export interface Product {
  id: string; whopProductId: string; checkoutUrl: string; name: string; category: string; price: number;
  description: string; headline: string; features: string[]; tone: "coastal" | "gold";
}
export const products: Product[] = [
  { id: "coastal-creator-toolkit", whopProductId: "prod_lW8tQxG87dsKP", checkoutUrl: "https://whop.com/checkout/plan_jXJDMD5T3MKJD/", name: "Coastal Creator Toolkit", category: "Lifestyle & coastal content", price: 29.99, tone: "coastal",
    headline: "A little more flow. A lot less guesswork.",
    description: "Plan and film coastal lifestyle content with a practical guide, ready-to-adapt scripts, captions and a four-week planner.",
    features: ["12-lesson PDF guide and editable text edition", "12 video scripts and 24 caption options", "Four-week planner, shot list and review log", "Editable workbook", "Six editable SVG layouts and six PNG cards"] },
  { id: "viral-gold-video-kit", whopProductId: "prod_IjbZFclq4nnH4", checkoutUrl: "https://whop.com/checkout/plan_iTC5mUal2nJw5/", name: "Viral Gold Video Kit", category: "Short-form video", price: 29.99, tone: "gold",
    headline: "Give your next video a stronger start.",
    description: "Give TikTok videos, Instagram Reels and YouTube Shorts a clearer structure with hook formulas, timed scripts and practical analytics tools.",
    features: ["14-lesson PDF guide and editable text edition", "30 hook formulas with examples", "12 timed video scripts", "Six editable SVG layouts and six PNG cards", "Workbook, analytics log and trend scorecard", "Offline analytics calculator"] },
];
export const formatPrice = (price: number) => `A$${price.toFixed(2)}`;
