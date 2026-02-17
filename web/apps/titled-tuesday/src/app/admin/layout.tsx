import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWhopApi } from "@/lib/whop-sdk";

export const metadata: Metadata = {
  title: "Titled Tuesday Admin",
};

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !PLATFORM_COMPANY_ID) {
    redirect("/");
  }

  const email = session?.user?.email || "";
  const isWhopEmail = email.endsWith("@whop.com");

  if (!isWhopEmail) {
    const client = getWhopApi();
    const access = await client.users.checkAccess(PLATFORM_COMPANY_ID, {
      id: userId,
    });

    if (access.access_level !== "admin") {
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-surface-base text-text-primary p-6">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
