"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, FlaskConical, BarChart3, MessageCircle, Map, Microscope, Globe, User } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const navLinks = [
    { name: t.nav.dashboard, path: "/", icon: <BarChart3 className="w-4 h-4" /> },
    { name: t.nav.soil, path: "/soil", icon: <FlaskConical className="w-4 h-4" /> },
    { name: t.nav.pathology, path: "/pathology", icon: <Microscope className="w-4 h-4" /> },
    { name: t.nav.yield, path: "/yield", icon: <BarChart3 className="w-4 h-4" /> },
    { name: t.nav.advisory, path: "/advisory", icon: <MessageCircle className="w-4 h-4" /> },
    { name: t.nav.operations, path: "/operations", icon: <Map className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 border-b select-none"
        style={{
          background: "rgba(3, 7, 5, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(212, 175, 55, 0.18)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 py-2 flex items-center justify-between">
          {/* Pure Brand Logo & Text Mark (Direct Emblem & Large Text, No Outer Artificial Box) */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="relative flex items-center justify-center">
              {/* Radiant Ambient Aura */}
              <div
                className="absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)",
                }}
              />
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Icon Logo"
                width={48}
                height={48}
                className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>

            <div className="relative flex items-center">
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={200}
                height={56}
                className="h-11 sm:h-12 md:h-13 w-auto object-contain drop-shadow-[0_4px_18px_rgba(212,175,55,0.55)] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-1.5 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="relative px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide smooth-transition flex items-center gap-2 whitespace-nowrap"
                style={{
                  color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.7)",
                  background: isActive(link.path) ? "rgba(0,255,157,0.08)" : "transparent",
                }}
              >
                <span style={{ color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.4)" }}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
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

          {/* Tri-Language Switcher & Profile Section */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Tri-Language Switcher (Segmented Glass Pill) */}
            <div
              className="flex items-center p-1 rounded-xl border relative"
              style={{
                background: "rgba(10, 15, 12, 0.8)",
                borderColor: "rgba(212,175,55,0.25)",
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="relative px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      color: isSelected ? "#030705" : "rgba(232,239,232,0.6)",
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-lang-pill"
                        className="absolute inset-0 rounded-lg shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{lang.nativeLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Circular Profile Avatar Section */}
            <div 
              className="relative group cursor-pointer"
              title="User Profile & Settings"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] shadow-md"
                style={{
                  background: "linear-gradient(145deg, rgba(28,34,28,0.95), rgba(12,16,13,0.98))",
                  border: "1.5px solid rgba(212,175,55,0.45)",
                }}
              >
                <User className="w-4 h-4 transition-colors group-hover:text-[#00FF9D]" style={{ color: "#D4AF37" }} />
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 border-2"
                style={{
                  backgroundColor: "#00FF9D",
                  borderColor: "#030705",
                  boxShadow: "0 0 6px #00FF9D",
                }}
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 lg:hidden px-4"
            style={{
              background: "rgba(3, 7, 5, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Brand in Mobile Drawer (Pure Emblem & Glow) */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-80 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(212,175,55,0.55) 0%, transparent 70%)",
                  }}
                />
                <Image
                  src="/brand/logo-icon.png"
                  alt="SaruPol Icon"
                  width={80}
                  height={80}
                  className="relative z-10 w-20 h-20 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]"
                />
              </div>
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={220}
                height={60}
                className="h-12 w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.55)]"
              />
            </div>

            {/* Mobile Language Switcher */}
            <div
              className="flex items-center p-1 rounded-xl border gap-1 mb-3"
              style={{
                background: "rgba(15, 20, 16, 0.9)",
                borderColor: "rgba(212,175,55,0.3)",
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #00FF9D, #D4AF37)"
                        : "transparent",
                      color: isSelected ? "#030705" : "rgba(232,239,232,0.7)",
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    {lang.nativeLabel}
                  </button>
                );
              })}
            </div>

            {/* Mobile Nav Links */}
            <div className="w-full max-w-xs space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-base font-light tracking-wide smooth-transition px-4 py-2.5 rounded-xl w-full"
                    style={{
                      color: isActive(link.path) ? "#00FF9D" : "rgba(232,239,232,0.75)",
                      background: isActive(link.path) ? "rgba(0,255,157,0.1)" : "rgba(255,255,255,0.03)",
                      border: isActive(link.path) ? "1px solid rgba(0,255,157,0.3)" : "1px solid transparent",
                    }}
                  >
                    <span style={{ color: isActive(link.path) ? "#00FF9D" : "#D4AF37" }}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
