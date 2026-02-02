import type { Metadata } from "next";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
