import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWhopApi } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, brand, colorway, condition, size, price, stock } = body;

  if (!name || !brand || !price) {
    return NextResponse.json(
      { error: "Name, brand, and price are required" },
      { status: 400 }
    );
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive number" },
      { status: 400 }
    );
  }

  const parsedStock = stock ? parseInt(stock, 10) : undefined;
  if (parsedStock !== undefined && (isNaN(parsedStock) || parsedStock < 1)) {
    return NextResponse.json(
      { error: "Stock must be a positive integer" },
      { status: 400 }
    );
  }

  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID not configured" },
      { status: 500 }
    );
  }

  try {
    const client = getWhopApi();

    const metadata = {
      type: "sockx_listing",
      brand,
      colorway: colorway || "",
      condition: condition || "New / Deadstock",
      size: size || "One Size",
      seller_id: session.user.id,
      seller_name: session.user.name || session.user.email || "",
    };

    const product = await client.products.create({
      company_id: companyId,
      title: `${brand} - ${name}`,
      description: JSON.stringify(metadata),
      visibility: "visible",
    });

    const plan = await client.plans.create({
      company_id: companyId,
      product_id: product.id,
      plan_type: "one_time",
      initial_price: parsedPrice,
      visibility: "visible",
      release_method: "buy_now",
      ...(parsedStock !== undefined && { stock: parsedStock }),
    });

    return NextResponse.json({
      success: true,
      productId: product.id,
      planId: plan.id,
      purchaseUrl: plan.purchase_url,
    });
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
