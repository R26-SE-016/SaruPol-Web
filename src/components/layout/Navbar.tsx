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
          background: "rgba(3, 7, 5, 0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(212, 175, 55, 0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Text Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="relative w-9 h-9 rounded-xl overflow-hidden p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              style={{
                background: "linear-gradient(135deg, rgba(30,34,30,0.9), rgba(12,16,13,0.95))",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Icon"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="relative h-6 sm:h-7 flex items-center">
                <Image
                  src="/brand/logo-text.png"
                  alt="සරුපොල් (SaruPol)"
                  width={110}
                  height={28}
                  className="h-5 sm:h-6 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                  priority
                />
              </div>
              <span className="text-[8px] font-mono tracking-[0.25em] text-emerald-400/80 uppercase -mt-0.5">
                PRECISION SUITE
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="relative px-3 py-2 rounded-lg text-xs tracking-wide smooth-transition flex items-center gap-2"
                style={{
                  color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.6)",
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
                    className="absolute bottom-0 left-3 right-3 h-[1.5px]"
                    style={{
                      background: "linear-gradient(90deg, #00FF9D, #D4AF37)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Enterprise Profile / CRI Station Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-white/70">CRI Station Kurunegala</span>
            </div>
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/30 p-0.5 bg-black/60 flex items-center justify-center">
              <Image
                src="/brand/logo-icon.png"
                alt="Profile Avatar"
                width={28}
                height={28}
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
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-2xl p-2 border border-amber-500/30 bg-black/60 flex items-center justify-center shadow-xl">
                <Image
                  src="/brand/logo-icon.png"
                  alt="SaruPol Icon"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={140}
                height={38}
                className="h-8 w-auto object-contain"
              />
              <span className="text-[10px] font-mono tracking-widest text-emerald-400/80 uppercase">
                Coconut Research Intelligence
              </span>
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
                  className="flex items-center gap-3 text-lg font-light tracking-widest uppercase smooth-transition px-4 py-2 rounded-xl"
                  style={{
                    color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.6)",
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
