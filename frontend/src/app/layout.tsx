import type { Metadata } from "next";
import { AuthProvider } from "@/modules/auth";
import { Navbar } from "@/modules/cms-sections/Navbar";
import { Footer } from "@/modules/cms-sections/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GBR — Global Business Registry",
  description: "Connecting companies, investors, and experts across the globe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-gray-50">
        <AuthProvider>
          <header className="bg-gray-50">
            <Navbar />
            {/* Accent bar */}
            <div style={{ height: "8px", background: "#0083ae" }} />
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
