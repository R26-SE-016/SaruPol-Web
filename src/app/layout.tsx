import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import BootLoader from "@/components/ui/BootLoader";
import CommandPalette from "@/components/ui/CommandPalette";

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
  title: "SaruPol | Coconut Research Intelligence Platform",
  description:
    "AI & IoT-driven Decision Support for Sri Lankan Coconut Plantations. Unified soil intelligence, pathology diagnostics, yield forecasting, and agronomist advisory.",
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
        <CustomCursor />
        <BootLoader />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
