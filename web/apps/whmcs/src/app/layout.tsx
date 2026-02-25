import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WHMCS | Web Hosting Billing & Automation Platform",
  description: "All the tools you need to start a web hosting business today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
