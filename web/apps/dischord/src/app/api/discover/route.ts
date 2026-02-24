import Whop from "@whop/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.WHOP_API_KEY;
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!apiKey || !companyId) {
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  const whop = new Whop({ apiKey });

  try {
    const products: Array<{
      id: string;
      name: string;
      visibility: string;
    }> = [];

    for await (const product of whop.products.list({
      company_id: companyId,
    })) {
      products.push({
        id: product.id,
        name: product.title,
        visibility: product.visibility,
      });
    }

    const plans: Array<{
      id: string;
      accessPassId: string;
      price: number;
      currency: string;
      type: string;
      purchaseUrl: string;
      billingPeriodDays: number | null;
      visibility: string;
    }> = [];

    for await (const plan of whop.plans.list({
      company_id: companyId,
    })) {
      plans.push({
        id: plan.id,
        accessPassId: plan.product?.id ?? "",
        price: plan.initial_price,
        currency: plan.currency ?? "usd",
        type: plan.plan_type,
        purchaseUrl: plan.purchase_url,
        billingPeriodDays: plan.billing_period ?? null,
        visibility: plan.visibility,
      });
    }

    const communities = products.map((product) => {
      const productPlans = plans.filter(
        (plan) => plan.accessPassId === product.id
      );
      return {
        id: product.id,
        name: product.name,
        visibility: product.visibility,
        plans: productPlans,
      };
    });

    return NextResponse.json({ communities });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}
