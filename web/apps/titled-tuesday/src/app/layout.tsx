import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Nav } from "@/components/nav";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans-3",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Titled Tuesday - Premium Weekly Chess Tournaments",
  description: "The premier weekly blitz chess tournament for titled players, powered by Whop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans3.variable}`}>
      <body className="noise-bg antialiased text-text-primary min-h-screen font-body">
        <AuthProvider>
          <Nav />
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
