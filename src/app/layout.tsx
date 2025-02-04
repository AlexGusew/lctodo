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
import { SpeedInsights } from "@vercel/speed-insights/next";

import "jotai-devtools/styles.css";
import "./globals.css";
import { cn } from "@/lib/utils";

const InterVariable = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LC Todo - LeetCode Todo List",
  description:
    "Organize your LeetCode tasks efficiently with LC Todo. Perfect tool for aspiring coders and developers to keep track of their coding problems and solutions.",
  metadataBase: new URL("https://lctodo.alexcoders.com"),
  applicationName: "LC Todo",
  keywords: [
    "LeetCode",
    "LeetCode Todo",
    "LeetCode List",
    "Coding Practice",
    "Coding Problems",
    "Todo List for Coders",
  ],
  authors: [{ name: "Alex Gusev", url: "https://alexcoders.com" }],
  openGraph: {
    title: "LC Todo - LeetCode Todo List",
    description:
      "Organize your LeetCode tasks efficiently with LC Todo. The perfect tool for aspiring coders and developers.",
    url: "https://lctodo.alexcoders.com",
    siteName: "LC Todo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LC Todo - LeetCode Todo List",
    description:
      "Organize your LeetCode tasks efficiently with LC Todo. The perfect tool for aspiring coders and developers.",
    site: "@AlexCoders",
  },
};

export default function RootLayout({
  children,
  todos,
}: Readonly<{
  children: React.ReactNode;
  todos: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(InterVariable.variable, "antialiased")}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>
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
        <SpeedInsights />
      </body>
    </html>
  );
}
