import { products } from "@/data/products";

export const creatorBundle = {
  name: "Coastal Creator All-Access Bundle",
  price: 49.99,
  checkoutUrl: "https://whop.com/checkout/plan_BlhWmxBPGOOeC/",
  productIds: ["coastal-creator-toolkit", "viral-gold-video-kit"],
} as const;

// Only the exact pair can use the bundle: its Whop product grants both Downloads apps.
export function getHostedCartOffer(productIds: string[]) {
  if (productIds.length === 1) return products.find(p => p.id === productIds[0]) ?? null;
  if (productIds.length === creatorBundle.productIds.length &&
      creatorBundle.productIds.every(id => productIds.includes(id))) return creatorBundle;
  return null;
}
