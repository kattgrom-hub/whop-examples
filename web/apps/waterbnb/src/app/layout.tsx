import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { KonamiEasterEgg } from "@/components/konami";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waterbnb - Rent boats from local hosts",
  description: "Rent boats from verified local hosts with embedded chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-[#222222] min-h-screen bg-[#F7F7F7]">
        <AuthProvider>
          <Nav />
          {children}
          <KonamiEasterEgg />
        </AuthProvider>
      </body>
    </html>
  );
}
