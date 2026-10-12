import type { Metadata, Viewport } from "next";
import { Sofia_Sans, Sofia_Sans_Condensed } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Sofia_Sans_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Sofia_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "INNOE — одяг, взуття, аксесуари",
    template: "%s — INNOE",
  },
  description:
    "Демонстраційний прототип інтернет-магазину INNOE. Ціни, залишки та замовлення не є реальними.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f3f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <a className="skip" href="#content">
            До вмісту
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
