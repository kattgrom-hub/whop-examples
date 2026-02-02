import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SessionPro - Learn from the best, live",
  description: "Book 1:1 coaching sessions with verified experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white min-h-screen">
        <Nav />
        {children}
      </body>
    </html>
  );
}
