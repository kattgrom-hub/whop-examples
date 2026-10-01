import { products } from "@/data/products";

export class InvalidCartError extends Error {}
export function priceCart(input: unknown) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 20) {
    throw new InvalidCartError("Choose between 1 and 20 cart items");
  }
  const seen = new Set<string>();
  const items = input.map(item => {
    if (!item || typeof item.productId !== "string" ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 ||
        seen.has(item.productId)) throw new InvalidCartError("Invalid cart item");
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new InvalidCartError("Unknown product");
    seen.add(item.productId);
    return { productId: product.id, name: product.name,
      unitPriceMinor: Math.round(product.price * 100), quantity: item.quantity };
  });
  const totalMinor = items.reduce((sum, item) => sum + item.unitPriceMinor * item.quantity, 0);
  if (!Number.isSafeInteger(totalMinor) || totalMinor <= 0 || totalMinor > 1000000) {
    throw new InvalidCartError("Cart total exceeds the checkout limit");
  }
  return { items, totalMinor, currency: "usd" as const };
}
