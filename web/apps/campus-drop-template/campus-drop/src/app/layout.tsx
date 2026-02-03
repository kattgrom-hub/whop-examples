import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusDrop - Student deals, delivered",
  description: "A campus marketplace for students to buy/sell tickets, fashion, textbooks, and more. Peer-to-peer transactions with secure payments.",
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
