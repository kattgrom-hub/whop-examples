import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MessagesClient } from "./page.client";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/messages");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 spinner-airbnb rounded-full animate-spin" />
        </div>
      }
    >
      <MessagesClient />
    </Suspense>
  );
}
