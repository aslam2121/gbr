import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B Platform",
  description: "B2B platform connecting companies, investors, and experts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
