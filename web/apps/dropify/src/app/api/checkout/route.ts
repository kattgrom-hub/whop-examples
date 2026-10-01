import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { createOrderToken } from "@/lib/checkout-token";
import { getWhopApi } from "@/lib/whop-sdk";

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items?: CartItemInput[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (items.length > 20) {
      return NextResponse.json(
        { error: "Too many items in cart" },
        { status: 400 }
      );
    }

    const seen = new Set<string>();
    const canonicalItems = items.map((item) => {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20 ||
        seen.has(item.productId)
      ) {
        throw new Error("Invalid cart item");
      }

      seen.add(item.productId);

      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new Error("Unknown product");
      }

      return {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
      };
    });

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId || companyId === "biz_xxxxx") {
      return NextResponse.json(
        { error: "Whop Company ID not configured" },
        { status: 500 }
      );
    }

    const totalPrice = canonicalItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const client = getWhopApi();

    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      metadata: {
        type: "dropify_order",
      },
      plan: {
        company_id: companyId,
        currency: "usd",
        initial_price: totalPrice,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
      },
    });

    const planId = checkoutConfig.plan?.id;

    if (!planId) {
      return NextResponse.json(
        { error: "Failed to create plan for checkout" },
        { status: 500 }
      );
    }

    const orderToken = createOrderToken({
      v: 1,
      orderId: randomUUID(),
      planId,
      items: canonicalItems,
      totalPrice,
      currency: "usd",
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    return NextResponse.json({
      planId,
      orderToken,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    const message = error instanceof Error ? error.message : String(error);

    if (message === "Invalid cart item" || message === "Unknown product") {
      return NextResponse.json(
        { error: "Your cart contains an invalid item. Please refresh and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong creating the checkout. Please try again." },
      { status: 500 }
    );
  }
}
