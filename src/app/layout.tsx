import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import BootLoader from "@/components/ui/BootLoader";
import CommandPalette from "@/components/ui/CommandPalette";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saru-pol-web.vercel.app"),
  title: "සරුපොල් (SaruPol) | Coconut Research Intelligence Platform",
  description:
    "AI & IoT-driven Decision Support for Sri Lankan Coconut Plantations. Unified soil intelligence, pathology diagnostics, yield forecasting, and CRI-grounded agronomist advisory.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/brand/logo-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "සරුපොල් (SaruPol) - Coconut Research Intelligence Platform",
    description: "Enterprise multi-tier intelligence suite for Sri Lankan coconut plantations.",
    images: [{ url: "/brand/logo-icon.png", width: 512, height: 512, alt: "SaruPol Brand Logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jakarta.variable} ${jetbrains.variable} antialiased min-h-screen selection:bg-emerald-neon/20`}
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          backgroundColor: "#030705",
          color: "#e8efe8",
        }}
      >
        <LanguageProvider>
          <CustomCursor />
          <BootLoader />
          <CommandPalette />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
