import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Community Triage — Supabase",
  description: "Review and manage community thread actions",
};

const outfit = Outfit({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin"],
});

function SupabaseMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 109 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.1935C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#sb-mark-gradient)"
      />
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.1935C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#sb-mark-overlay)"
        fillOpacity="0.2"
      />
      <path
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient
          id="sb-mark-gradient"
          x1="53.9738"
          y1="54.974"
          x2="94.1635"
          y2="71.8295"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="sb-mark-overlay"
          x1="36.1558"
          y1="30.578"
          x2="54.4844"
          y2="65.0806"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.className} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <header>
            <nav
              className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40"
              aria-label="Main navigation"
            >
              <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <SupabaseMark className="h-[18px] w-auto" />
                  <div className="h-4 w-px bg-border/60" aria-hidden="true" />
                  <span className="text-sm font-display font-medium tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                    Community Triage
                  </span>
                </Link>
                <ThemeSwitcher />
              </div>
            </nav>
          </header>

          <main
            id="main-content"
            className="sb-glow min-h-[calc(100vh-4rem)] mx-auto w-full max-w-6xl px-6 py-10"
            tabIndex={-1}
          >
            <div className="relative z-10">{children}</div>
          </main>

          <footer className="border-t border-border/40 py-5">
            <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <SupabaseMark className="h-3 w-auto opacity-40" />
                <span>Community Reply Helper</span>
              </div>
              <ThemeSwitcher />
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
