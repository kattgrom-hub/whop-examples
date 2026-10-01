"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      sessionStorage.setItem(
        `dropify:checkout:${data.planId}`,
        data.orderToken
      );

      closeCart();
      router.push(`/checkout?planId=${encodeURIComponent(data.planId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-overlay transition-opacity duration-500"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
            <h2 className="text-sm font-light tracking-[0.2em] text-primary">
              CART
            </h2>
            <button
              onClick={closeCart}
              className="p-1 text-secondary transition-colors duration-400 hover:text-primary"
              aria-label="Close cart"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag
                  size={32}
                  strokeWidth={1}
                  className="text-neutral-300 mb-4"
                />
                <p className="text-sm font-light text-secondary">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 bg-neutral-100 rounded-sm flex items-center justify-center">
                      <span className="text-[10px] text-neutral-300 font-light">
                        {item.product.name}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-normal text-primary">
                            {item.product.name}
                          </h3>
                          <p className="text-xs font-light text-secondary mt-0.5">
                            ${item.product.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-neutral-400 transition-colors duration-400 hover:text-primary"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center border border-neutral-200 rounded-sm text-secondary transition-colors duration-400 hover:border-primary hover:text-primary"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="text-sm font-light text-primary w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center border border-neutral-200 rounded-sm text-secondary transition-colors duration-400 hover:border-primary hover:text-primary"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-neutral-100 px-6 py-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-light text-secondary">
                  Subtotal
                </span>
                <span className="text-sm font-normal text-primary">
                  ${totalPrice}
                </span>
              </div>
              {error && (
                <p className="mb-3 text-center text-xs font-light text-red-500">
                  {error}
                </p>
              )}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gold py-3.5 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout with Whop"
                )}
              </button>
              <p className="mt-3 text-center text-[11px] font-light text-neutral-400">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
