import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trout Tournaments Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout for embedded-in-Whop admin view -- no Nav, no sidebar
  return (
    <div className="min-h-screen bg-surface-base text-text-primary p-6">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
