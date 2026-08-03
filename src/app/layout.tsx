import type { Metadata } from "next";
import { Fraunces, Inter, Amiri, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTA, WhatsAppBubble } from "@/components/layout/mobile-cta";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/forms/client-forms";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "International Online Islamic Academy | Live Quran Classes",
    template: "%s | Islamic Academy",
  },
  description:
    "Live one-on-one Quran, Tajweed, Hifz, and Islamic Studies classes with certified teachers. Book a free trial — timezone-aware scheduling in 17+ countries.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${arabic.variable} ${mono.variable} min-h-screen pb-20 md:pb-0`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileCTA />
          <WhatsAppBubble />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
