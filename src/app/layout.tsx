import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";
import { ToastProvider } from "@/components/ui/toast";
import { CartDrawer } from "@/components/storefront/cart-drawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AURA Living | Curated Minimalist Home & Lifestyle",
    template: "%s | AURA Living",
  },
  description:
    "Timeless Japanese and Scandinavian craftsmanship. Discover artisanal furniture, warm architectural lighting, hand-thrown ceramics, and organic Belgian linen textiles.",
  keywords: [
    "minimalist home",
    "Japandi furniture",
    "Scandinavian lighting",
    "artisan stoneware",
    "Belgian linen",
    "sustainable decor",
  ],
  authors: [{ name: "AURA Living" }],
  creator: "AURA Living",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://auraliving.com",
    title: "AURA Living | Curated Minimalist Home & Lifestyle",
    description:
      "Timeless Japanese and Scandinavian craftsmanship curated for modern sanctuaries.",
    siteName: "AURA Living",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA Living",
    description: "Curated minimalist furniture and lifestyle goods.",
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                {children}
                <CartDrawer />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
