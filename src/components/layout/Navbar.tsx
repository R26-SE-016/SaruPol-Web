"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, FlaskConical, BarChart3, MessageCircle, Map, Microscope, Globe, User, Sun, Moon } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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

  const activeColor = theme === "dark" ? "#00FF9D" : "#00875A";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 border-b select-none smooth-transition"
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "var(--nav-border)",
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
                className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: theme === "dark"
                    ? "drop-shadow(0 4px 18px rgba(212,175,55,0.55))"
                    : "drop-shadow(0 4px 12px rgba(10,27,16,0.2)) drop-shadow(0 1px 3px rgba(197,155,39,0.35))"
                }}
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
                  color: isActive(link.path) ? activeColor : "var(--text-secondary)",
                  background: isActive(link.path) ? (theme === "dark" ? "rgba(0,255,157,0.08)" : "rgba(0,135,90,0.08)") : "transparent",
                }}
              >
                <span style={{ color: isActive(link.path) ? activeColor : "var(--text-muted)" }}>
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

          {/* Tri-Language Switcher, Theme Toggle & Profile Section */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Tri-Language Switcher (Segmented Glass Pill) */}
            <div
              className="flex items-center p-1 rounded-xl border relative smooth-transition"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
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
                      color: isSelected ? "#030705" : "var(--text-secondary)",
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

            {/* Theme Toggle Button (Sun / Moon) */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden border"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                boxShadow: "var(--card-shadow)",
              }}
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="dark-sun"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light-moon"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Circular Profile Avatar Section */}
            <div 
              className="relative group cursor-pointer"
              title="User Profile & Settings"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] shadow-md border"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <User className="w-4 h-4 transition-colors group-hover:text-[#00FF9D]" style={{ color: "#D4AF37" }} />
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 border-2"
                style={{
                  backgroundColor: "#00FF9D",
                  borderColor: "var(--background)",
                  boxShadow: "0 0 6px #00FF9D",
                }}
              />
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center border"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 smooth-transition rounded-lg hover:bg-white/5"
              style={{ color: "var(--text-primary)" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
              background: "var(--nav-bg)",
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
                className="h-12 w-auto object-contain"
                style={{
                  filter: theme === "dark"
                    ? "drop-shadow(0 4px 20px rgba(212,175,55,0.55))"
                    : "drop-shadow(0 4px 12px rgba(10,27,16,0.2)) drop-shadow(0 1px 3px rgba(197,155,39,0.35))"
                }}
              />
            </div>

            {/* Mobile Language Switcher */}
            <div
              className="flex items-center p-1 rounded-xl border gap-1 mb-3"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
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
                      color: isSelected ? "#030705" : "var(--text-secondary)",
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
                      color: isActive(link.path) ? activeColor : "var(--text-secondary)",
                      background: isActive(link.path) ? (theme === "dark" ? "rgba(0,255,157,0.1)" : "rgba(0,135,90,0.1)") : "var(--card-bg)",
                      border: isActive(link.path) ? `1px solid ${activeColor}` : "1px solid var(--card-border)",
                    }}
                  >
                    <span style={{ color: isActive(link.path) ? activeColor : "#D4AF37" }}>
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
