"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  FlaskConical, Microscope, BarChart3, MessageCircle, Map,
  ArrowRight, Activity, Cpu, Database, Wifi, TrendingUp
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const modules = [
    {
      title: t.home.modules.soilTitle,
      subtitle: t.home.modules.soilSub,
      description: t.home.modules.soilDesc,
      href: "/soil",
      icon: <FlaskConical className="w-6 h-6" />,
      tag: "S1",
      accent: "#00FF9D",
    },
    {
      title: t.home.modules.pathologyTitle,
      subtitle: t.home.modules.pathologySub,
      description: t.home.modules.pathologyDesc,
      href: "/pathology",
      icon: <Microscope className="w-6 h-6" />,
      tag: "S2",
      accent: "#FF4C4C",
    },
    {
      title: t.home.modules.yieldTitle,
      subtitle: t.home.modules.yieldSub,
      description: t.home.modules.yieldDesc,
      href: "/yield",
      icon: <BarChart3 className="w-6 h-6" />,
      tag: "S3",
      accent: "#00E5FF",
    },
    {
      title: t.home.modules.advisoryTitle,
      subtitle: t.home.modules.advisorySub,
      description: t.home.modules.advisoryDesc,
      href: "/advisory",
      icon: <MessageCircle className="w-6 h-6" />,
      tag: "S4",
      accent: "#E6AF2E",
    },
    {
      title: t.home.modules.operationsTitle,
      subtitle: t.home.modules.operationsSub,
      description: t.home.modules.operationsDesc,
      href: "/operations",
      icon: <Map className="w-6 h-6" />,
      tag: "S5",
      accent: "#A78BFA",
    },
  ];

  const telemetryStats = [
    { label: t.home.stats.activeSubsystems, value: "6", icon: <Cpu className="w-5 h-5" /> },
    { label: t.home.stats.mlModels, value: "4", icon: <Activity className="w-5 h-5" /> },
    { label: t.home.stats.gatewayUptime, value: "99.9%", icon: <Wifi className="w-5 h-5" /> },
    { label: t.home.stats.cloudFunctions, value: "8 ACTIVE", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
        <Navbar />

      {/* Background luxury gold & emerald glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--ambient-gold) 0%, var(--ambient-emerald) 45%, transparent 70%)",
        }}
      />

      {/* Telemetry grid */}
      <div className="absolute inset-0 telemetry-grid opacity-25 pointer-events-none" />

      {/* Grand Hero Section with Centered Massive Brand Identity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-5xl px-4 mt-24 mb-14 flex flex-col items-center select-none"
      >
        {/* Pure Luxury Gold Icon Mark (Enlarged, Radiant Ambient Aura, No Artificial Outer Box) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative -mb-4 sm:-mb-6 md:-mb-8 z-20 flex items-center justify-center"
        >
          {/* Radiant Ambient Halo */}
          <div
            className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--ambient-gold) 0%, var(--ambient-emerald) 50%, transparent 80%)",
              transform: "scale(1.25)",
            }}
          />
          <Image
            src="/brand/logo-icon.png"
            alt="SaruPol Palm Icon"
            width={180}
            height={180}
            className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain drop-shadow-[0_0_35px_rgba(212,175,55,0.55)] transition-transform duration-500 hover:scale-105"
            priority
          />
        </motion.div>

        {/* Grand 3D Embossed Text Logo Connected Directly */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mb-5 w-full max-w-[420px] sm:max-w-[580px] md:max-w-[680px] flex justify-center z-10"
        >
          <Image
            src="/brand/logo-text.png"
            alt="සරුපොල් (SaruPol)"
            width={680}
            height={180}
            className="w-full h-auto object-contain"
            style={{
              filter: theme === "dark"
                ? "drop-shadow(0 12px 36px rgba(212,175,55,0.55))"
                : "drop-shadow(0 0 12px rgba(0,0,0,0.85)) drop-shadow(0 6px 22px rgba(0,0,0,0.6))"
            }}
            priority
          />
        </motion.div>

        {/* Crisp Subtitle */}
        <motion.p
          key={t.home.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl font-light mb-5 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.home.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex items-center justify-center gap-3"
        >
          <kbd
            className="text-[11px] px-3 py-1.5 rounded-lg font-mono font-bold"
            style={{
              background: "rgba(212,175,55,0.1)",
              color: "#E6AF2E",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            ⌘ + K
          </kbd>
          <span className="text-xs tracking-widest uppercase font-mono" style={{ color: "var(--text-muted)" }}>
            {t.home.commandPalette}
          </span>
        </motion.div>
      </motion.div>

      {/* Telemetry Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full max-w-6xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 z-10 mb-12"
      >
        {telemetryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="glass-panel p-4 flex items-center gap-3"
          >
            <span style={{ color: "#D4AF37" }}>{stat.icon}</span>
            <div>
              <p className="text-lg font-medium font-mono" style={{ color: "#00FF9D" }}>
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-mono" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Module Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full max-w-6xl px-4 sm:px-6 z-10 mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
              <Link href={mod.href} className="block group">
                <div className="glass-card p-7 relative overflow-hidden transition-all duration-300 group-hover:border-amber-500/30">
                  {/* Hover glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${mod.accent}15, transparent 70%)` }}
                  />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{
                        background: `${mod.accent}12`,
                        color: mod.accent,
                        border: `1px solid ${mod.accent}25`,
                      }}
                    >
                      {mod.icon}
                    </div>
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] font-mono px-2 py-1 rounded border"
                      style={{
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {mod.tag}
                    </span>
                  </div>

                  <h2
                    className="text-xl font-medium mb-1 smooth-transition relative z-10 group-hover:text-emerald-400"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      color: "var(--text-primary)",
                    }}
                  >
                    {mod.title}
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: `${mod.accent}` }}>
                    {mod.subtitle}
                  </p>
                  <p className="text-sm mb-5 leading-relaxed relative z-10" style={{ color: "var(--text-secondary)" }}>
                    {mod.description}
                  </p>

                  <div
                    className="flex items-center gap-2 text-xs tracking-widest uppercase smooth-transition relative z-10 font-mono"
                    style={{ color: "#D4AF37" }}
                  >
                    <span>{t.home.modules.launchModule}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom telemetry bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="w-full max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 z-10 mb-16"
      >
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Database className="w-5 h-5 mb-3" style={{ color: "#D4AF37" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "var(--text-primary)" }}>
            {t.home.telemetryBar.subsystemsTitle}
          </h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {t.home.telemetryBar.subsystemsDesc}
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Cpu className="w-5 h-5 mb-3" style={{ color: "#00FF9D" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "var(--text-primary)" }}>
            {t.home.telemetryBar.mlTitle}
          </h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {t.home.telemetryBar.mlDesc}
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <TrendingUp className="w-5 h-5 mb-3" style={{ color: "#D4AF37" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "var(--text-primary)" }}>
            {t.home.telemetryBar.criTitle}
          </h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {t.home.telemetryBar.criDesc}
          </p>
        </div>
      </motion.div>

      {/* Branded Footer */}
      <footer
        className="w-full border-t py-8 px-6 text-center z-10 flex flex-col items-center gap-3 select-none smooth-transition"
        style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-icon.png"
            alt="SaruPol Footer Icon"
            width={36}
            height={36}
            className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          />
          <Image
            src="/brand/logo-text.png"
            alt="සරුපොල් (SaruPol)"
            width={130}
            height={36}
            className="h-7 w-auto object-contain"
            style={{
              filter: theme === "dark"
                ? "drop-shadow(0 2px 10px rgba(212,175,55,0.45))"
                : "drop-shadow(0 0 6px rgba(0,0,0,0.85)) drop-shadow(0 2px 8px rgba(0,0,0,0.55))"
            }}
          />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "var(--text-muted)" }}>
          {t.home.footer}
        </p>
      </footer>
    </main>
    </AuthGuard>
  );
}
