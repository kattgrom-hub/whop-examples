import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapCash - Your data, your earnings",
  description: "Earn money from your photos and videos when they're licensed for AI training. Passive income from your camera roll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white min-h-screen">
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
