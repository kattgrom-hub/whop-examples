import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Whop can append a payment client_secret to off-site return URLs.
  // Keep it out of referrers to scripts, assets and outbound links.
  referrer: "no-referrer",
  title: "Kattassie — Digital Creator Kits",
  description:
    "Explore Coastal Creator Toolkit and Viral Gold Video Kit. Digital resources for lifestyle creators and short-form storytellers, A$29.99 each.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
