import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/shared/lib/tanstack-query/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MathAI — JEE & NEET Math Practice",
    template: "%s | MathAI",
  },
  description:
    "AI-powered mathematics practice platform for Class 12 JEE & NEET students. Get instant analysis, personalised feedback, and track your progress.",
  keywords: [
    "JEE mathematics",
    "NEET mathematics",
    "Class 12 math",
    "NCERT math",
    "AI math tutor",
    "Indian students",
  ],
  authors: [{ name: "MathAI" }],
  creator: "MathAI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "MathAI",
    title: "MathAI — JEE & NEET Math Practice",
    description: "AI-powered math practice for Class 12 JEE & NEET students",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  classNames: {
                    toast:
                      "bg-card border-border text-card-foreground shadow-xl",
                    title: "text-foreground font-medium",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-secondary text-secondary-foreground",
                    error: "border-destructive/50",
                    success: "border-primary/50",
                  },
                }}
              />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
