import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtreeHeading = Figtree({ subsets: ['latin'], variable: '--font-heading' });

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import siteData from "@/data/site.json";

export const metadata: Metadata = {
  title: {
    default: siteData.siteName,
    template: `%s | ${siteData.siteName}`,
  },
  description: siteData.description,
  metadataBase: new URL(siteData.url),
  openGraph: {
    title: siteData.siteName,
    description: siteData.description,
    url: siteData.url,
    siteName: siteData.siteName,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteData.siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.siteName,
    description: siteData.description,
    creator: "@uygullama",
    site: "@uygullama",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteData.lang}
      className={cn("h-full", "antialiased", "scroll-smooth", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, figtreeHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">

        <div className="relative min-h-screen text-foreground">
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="mx-auto h-full max-w-7xl border-x border-border/60" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
