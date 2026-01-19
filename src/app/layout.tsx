import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lo.la app",
  description: "Experience everything beauty in one app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


