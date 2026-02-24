import type { Metadata } from "next";
import { Anton, Epilogue } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SockX - The Sock Market",
  description:
    "Buy & Sell Verified Authentic Socks. The premier marketplace for deadstock designer socks, limited drops, and verified authentic pairs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${epilogue.variable} antialiased bg-sockx-bg text-sockx-text`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
