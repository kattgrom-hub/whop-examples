"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@whop-examples/auth/client";
import Navbar from "@/components/Navbar";
import {
  Tag,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CONDITIONS = ["New / Deadstock", "Like New", "Gently Used", "Used"];
const CATEGORIES = [
  "Athletic",
  "Designer",
  "Limited Edition",
  "Vintage",
  "Collab",
  "Basics",
];

export default function SellPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    colorway: "",
    condition: "New / Deadstock",
    category: "Athletic",
    size: "M",
    price: "",
    stock: "1",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    purchaseUrl?: string;
    error?: string;
  } | null>(null);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, error: data.error });
      } else {
        setResult({ success: true, purchaseUrl: data.purchaseUrl });
      }
    } catch {
      setResult({ success: false, error: "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-sockx-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <Tag className="h-16 w-16 text-sockx-primary mx-auto mb-6" />
          <h1 className="font-heading text-3xl text-sockx-text uppercase mb-4">
            Start Selling
          </h1>
          <p className="font-body text-purple-400 mb-8">
            Sign in with your Whop account to list socks for sale on the
            marketplace.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-block px-8 py-3 bg-sockx-primary text-white font-body font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Sign In to Sell
          </a>
        </div>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <CheckCircle className="h-16 w-16 text-sockx-cta mx-auto mb-6" />
          <h1 className="font-heading text-3xl text-sockx-text uppercase mb-4">
            Listed!
          </h1>
          <p className="font-body text-purple-400 mb-8">
            Your sock listing is live. Share the checkout link with buyers.
          </p>
          {result.purchaseUrl && (
            <a
              href={result.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sockx-cta text-white font-body font-semibold rounded-xl hover:bg-green-600 transition-colors mb-4"
            >
              View Checkout Link <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <div className="mt-4">
            <button
              onClick={() => {
                setResult(null);
                setForm({
                  name: "",
                  brand: "",
                  colorway: "",
                  condition: "New / Deadstock",
                  category: "Athletic",
                  size: "M",
                  price: "",
                  stock: "1",
                });
              }}
              className="font-body text-sm text-sockx-primary hover:text-purple-700 transition-colors"
            >
              List another pair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="font-body text-sm text-purple-400 mb-4">
            <Link href="/" className="hover:text-sockx-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-sockx-text">Sell</span>
          </nav>
          <h1 className="font-heading text-4xl text-sockx-text uppercase">
            List Your Socks
          </h1>
          <p className="font-body text-purple-400 mt-2">
            Create a listing and start selling on the marketplace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sock Details Card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-sockx-primary" />
              <h2 className="font-heading text-xl text-sockx-text uppercase">
                Sock Details
              </h2>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Air Sock 1 'Triple Black'"
                className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Colorway
                </label>
                <input
                  type="text"
                  value={form.colorway}
                  onChange={(e) => updateField("colorway", e.target.value)}
                  placeholder="e.g. Black/White"
                  className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                Size
              </label>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateField("size", s)}
                    className={`flex-1 py-2.5 rounded-lg font-body text-sm font-semibold transition-colors ${
                      form.size === s
                        ? "bg-sockx-primary text-white"
                        : "bg-purple-50 border border-purple-200 text-sockx-text hover:border-sockx-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-sockx-cta" />
              <h2 className="font-heading text-xl text-sockx-text uppercase">
                Pricing
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Ask Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-purple-400">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-sockx-text mb-1.5">
                  Stock
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <input
                    type="number"
                    min="1"
                    value={form.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg font-body text-sm text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {result?.error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="font-body text-sm text-red-600">{result.error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-sockx-cta text-white font-body font-bold text-base rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Listing...
              </>
            ) : (
              "List for Sale"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
