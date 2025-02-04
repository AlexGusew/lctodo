import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { JotaiProvider } from "@/components/JotaiProvider";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientProviders } from "@/components/ClientProviders";
import { Toaster } from "@/components/ui/toaster";

import "jotai-devtools/styles.css";
import "./globals.css";

const InterVariable = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetCode Todo List",
  description: "A simple todo List",
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
      <body className={`${InterVariable.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            <JotaiProvider>
              <TooltipProvider>
                <div className="min-h-screen p-8 max-sm:p-4 font-[family-name:var(--font-inter)]">
                  <main>
                    {children}
                    {todos}
                  </main>
                </div>
                <hr className="mb-2" />
                <Footer />
                <Toaster />
              </TooltipProvider>
            </JotaiProvider>
          </ClientProviders>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
