import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { KonamiEasterEgg } from "@/components/konami";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masterclass - Learn from the best, live",
  description: "Book 1:1 classes with verified experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-white min-h-screen bg-[#0A0A0A]">
        <AuthProvider>
          <Nav />
          {children}
          <KonamiEasterEgg />
        </AuthProvider>
      </body>
    </html>
  );
}
