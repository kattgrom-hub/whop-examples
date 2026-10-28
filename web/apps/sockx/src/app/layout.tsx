import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";


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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Epilogue:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased bg-sockx-bg text-sockx-text"
      >
        <Providers>{children}
          <footer style={{ padding: 16, textAlign: "center" }}><a href="/wallet">Wallet balance</a></footer></Providers>
      </body>
    </html>
  );
}
