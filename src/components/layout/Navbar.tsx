"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, FlaskConical, BarChart3, MessageCircle, Map, Microscope } from "lucide-react";

const navLinks = [
  { name: "Dashboard", path: "/", icon: <BarChart3 className="w-4 h-4" /> },
  { name: "Soil Intelligence", path: "/soil", icon: <FlaskConical className="w-4 h-4" /> },
  { name: "Pathology Lab", path: "/pathology", icon: <Microscope className="w-4 h-4" /> },
  { name: "Yield Forecast", path: "/yield", icon: <BarChart3 className="w-4 h-4" /> },
  { name: "Advisory AI", path: "/advisory", icon: <MessageCircle className="w-4 h-4" /> },
  { name: "Operations", path: "/operations", icon: <Map className="w-4 h-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 border-b select-none"
        style={{
          background: "rgba(3, 7, 5, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(212, 175, 55, 0.18)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-2 flex items-center justify-between">
          {/* Pure Brand Logo & Text Mark (Large & Prominent) */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div
              className="relative w-11 h-11 rounded-xl overflow-hidden p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(145deg, rgba(28,32,28,0.95), rgba(10,14,11,0.98))",
                border: "1px solid rgba(212,175,55,0.4)",
                boxShadow: "0 0 20px rgba(212,175,55,0.2)",
              }}
            >
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Icon Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                priority
              />
            </div>
            
            <div className="relative flex items-center">
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={160}
                height={46}
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_4px_14px_rgba(212,175,55,0.45)] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="relative px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide smooth-transition flex items-center gap-2"
                style={{
                  color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.7)",
                  background: isActive(link.path) ? "rgba(0,255,157,0.08)" : "transparent",
                }}
              >
                <span style={{ color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.4)" }}>
                  {link.icon}
                </span>
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px]"
                    style={{
                      background: "linear-gradient(90deg, #00FF9D, #D4AF37)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Enterprise Station Badge & Profile Icon */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-white/80">CRI Station Kurunegala</span>
            </div>
            <div
              className="w-9 h-9 rounded-xl overflow-hidden p-1 flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, rgba(28,32,28,0.9), rgba(10,14,11,0.95))",
                border: "1px solid rgba(212,175,55,0.35)",
              }}
            >
              <Image
                src="/brand/logo-icon.png"
                alt="Profile Avatar"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 smooth-transition rounded-lg hover:bg-white/5"
            style={{ color: "rgba(232,239,232,0.9)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 lg:hidden"
            style={{
              background: "rgba(3, 7, 5, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Brand in Mobile Drawer */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div
                className="w-18 h-18 rounded-2xl p-2.5 flex items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(28,32,28,0.95), rgba(10,14,11,0.98))",
                  border: "1px solid rgba(212,175,55,0.4)",
                  boxShadow: "0 0 30px rgba(212,175,55,0.25)",
                }}
              >
                <Image
                  src="/brand/logo-icon.png"
                  alt="SaruPol Icon"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={180}
                height={50}
                className="h-10 w-auto object-contain drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]"
              />
            </div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-lg font-light tracking-widest uppercase smooth-transition px-5 py-2.5 rounded-xl"
                  style={{
                    color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.7)",
                    background: isActive(link.path) ? "rgba(0,255,157,0.08)" : "transparent",
                  }}
                >
                  <span style={{ color: isActive(link.path) ? "#00FF9D" : "#D4AF37" }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
