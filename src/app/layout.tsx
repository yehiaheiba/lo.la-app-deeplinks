import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Links",
  description: "Open content in the app from the web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


