import Whop from "@whop/sdk";
import { NextRequest, NextResponse } from "next/server";

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
    const servers: { id: string; name: string }[] = [];

    for await (const company of whop.companies.list({
      parent_company_id: parentCompanyId,
    })) {
      servers.push({ id: company.id, name: company.title });
    }

    return NextResponse.json({ servers });
  } catch {
    return NextResponse.json(
      { error: "Failed to list servers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.WHOP_API_KEY;
  const parentCompanyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!apiKey || !parentCompanyId) {
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { title, email } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const whop = new Whop({ apiKey });
    const company = await whop.companies.create({
      parent_company_id: parentCompanyId,
      title,
      ...(email ? { email } : {}),
    });

    return NextResponse.json({
      server: { id: company.id, name: company.title },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create server" },
      { status: 500 }
    );
  }
}
