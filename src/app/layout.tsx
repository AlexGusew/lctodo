import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { JotaiProvider } from "@/components/JotaiProvider";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";

import "./globals.css";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetCode Todo list",
  description: "A simple todo list",
};

export default function RootLayout({
  children,
  todos,
}: Readonly<{
  children: React.ReactNode;
  todos: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} antialiased dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <JotaiProvider>
              <div className="min-h-screen p-8 sm:pt-2 sm:p-20 font-[family-name:var(--font-inter)]">
                <main className="max-w-2xl mx-auto">
                  {children}
                  {todos}
                </main>
              </div>
              <hr className="mb-2" />
              <Footer />
            </JotaiProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
