"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Leaf, FlaskConical, BarChart3, MessageCircle, Map, Microscope } from "lucide-react";

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
      <nav className="fixed top-0 left-0 w-full z-50 border-b"
        style={{
          background: "rgba(3, 7, 5, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(0, 255, 157, 0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,157,0.15), rgba(0,255,157,0.05))",
                border: "1px solid rgba(0,255,157,0.15)",
              }}
            >
              <Leaf className="w-4 h-4" style={{ color: "#00FF9D" }} />
            </div>
            <span className="text-sm font-medium tracking-[0.15em] uppercase"
              style={{ color: "rgba(232, 239, 232, 0.9)" }}
            >
              SaruPol
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="relative px-3 py-2 rounded-lg text-xs tracking-wide smooth-transition flex items-center gap-2"
                style={{
                  color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.4)",
                  background: isActive(link.path) ? "rgba(0,255,157,0.08)" : "transparent",
                }}
              >
                <span style={{ color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.25)" }}>
                  {link.icon}
                </span>
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[1px]"
                    style={{ background: "#00FF9D" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Enterprise Profile / CRI Station Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-white/70">CRI Station Kurunegala</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-xs font-mono font-medium text-emerald-400">
              SP
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 smooth-transition"
            style={{ color: "rgba(232,239,232,0.7)" }}
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 lg:hidden"
            style={{
              background: "rgba(3, 7, 5, 0.97)",
              backdropFilter: "blur(30px)",
            }}
          >
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
                  className="flex items-center gap-3 text-lg font-light tracking-widest uppercase smooth-transition"
                  style={{ color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.35)" }}
                >
                  {link.icon}
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
