import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentDrop - Connect. Create. Get Paid.",
  description:
    "A talent marketplace connecting businesses with creators and workers. Post gigs, hire talent, and automate payouts when work is completed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <AuthProvider>
          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold text-white">
                    Talent<span className="text-purple-500">Drop</span>
                  </Link>
                  <div className="hidden md:flex items-center gap-6">
                    <Link
                      href="/talent"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Find Talent
                    </Link>
                    <Link
                      href="/gigs"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Browse Gigs
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/messages"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
