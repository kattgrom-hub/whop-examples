import Whop from "@whop/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.WHOP_API_KEY;
  const parentCompanyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!apiKey || !parentCompanyId) {
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  try {
    const whop = new Whop({ apiKey });
    const communities: {
      id: string;
      name: string;
      plans: { id: string; name: string | null; price: number; purchaseUrl: string; planType: string }[];
    }[] = [];

    for await (const company of whop.companies.list({
      parent_company_id: parentCompanyId,
    })) {
      const plans: {
        id: string;
        name: string | null;
        price: number;
        purchaseUrl: string;
        planType: string;
      }[] = [];

      try {
        for await (const plan of whop.plans.list({
          company_id: company.id,
        })) {
          if (plan.purchase_url) {
            plans.push({
              id: plan.id,
              name: plan.title ?? null,
              price: plan.initial_price ?? 0,
              purchaseUrl: plan.purchase_url,
              planType: plan.plan_type,
            });
          }
        }
      } catch {
        // Company may not have plans configured - skip
      }

      communities.push({
        id: company.id,
        name: company.title,
        plans,
      });
    }

    return NextResponse.json({ communities });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}
