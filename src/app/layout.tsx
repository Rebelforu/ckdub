import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CKDub - Asian Drama Streaming",
  description: "Hindi/English dubbed C-Dramas and K-Dramas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background text-textMain min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              CKDub
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/request" className="hover:text-primary transition-colors">Request Drama</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-surface py-8 mt-12 border-t border-surface">
          <div className="container mx-auto px-4 text-center text-textMuted">
            <p>&copy; {new Date().getFullYear()} CKDub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
