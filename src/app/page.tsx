"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import {
  Leaf, FlaskConical, Microscope, BarChart3, MessageCircle, Map,
  ArrowRight, Activity, Cpu, Database, Wifi, TrendingUp
} from "lucide-react";

const modules = [
  {
    title: "Soil Intelligence",
    subtitle: "CRI Differential Fertilizer Recommendation Engine",
    description: "3-point spatial triangulation converting IoT soil NPK to 14th Frond Leaf NPK with CRI-grade Urea, ERP, MOP, and Dolomite dosing.",
    href: "/soil",
    icon: <FlaskConical className="w-6 h-6" />,
    tag: "S1",
    accent: "#00FF9D",
  },
  {
    title: "Pathology Lab",
    subtitle: "CNN Vision Diagnostics & Treatment Dossier",
    description: "Real-time disease classification for Bud Rot, Stem Bleeding, Gray Leaf Spot, and Leaf Rot with CRI treatment protocols.",
    href: "/pathology",
    icon: <Microscope className="w-6 h-6" />,
    tag: "S2",
    accent: "#FF4C4C",
  },
  {
    title: "CocoCastAI",
    subtitle: "Hybrid RF + LSTM Yield Forecasting",
    description: "45-day harvest cycle prediction using Random Forest (R²=0.98) and LSTM (R²=0.86) ensemble with confidence intervals.",
    href: "/yield",
    icon: <BarChart3 className="w-6 h-6" />,
    tag: "S3",
    accent: "#00E5FF",
  },
  {
    title: "Advisory AI",
    subtitle: "Multi-LLM Consensus RAG Engine",
    description: "Knowledge-grounded agronomist chat with CRI citation tags. Supports English, Sinhala, and Tamil with voice synthesis.",
    href: "/advisory",
    icon: <MessageCircle className="w-6 h-6" />,
    tag: "S4",
    accent: "#E6AF2E",
  },
  {
    title: "Field Operations",
    subtitle: "Canopy Hotspot Monitoring & Tree Inventory",
    description: "Aerial spectral analysis with NDVI/VARI heatmaps, hotspot alerts, and digital twin plantation management.",
    href: "/operations",
    icon: <Map className="w-6 h-6" />,
    tag: "S5",
    accent: "#A78BFA",
  },
];

const telemetryStats = [
  { label: "Active Subsystems", value: "6", icon: <Cpu className="w-5 h-5" /> },
  { label: "ML Models Loaded", value: "4", icon: <Activity className="w-5 h-5" /> },
  { label: "Gateway Uptime", value: "99.9%", icon: <Wifi className="w-5 h-5" /> },
  { label: "Cloud Functions", value: "8 ACTIVE", icon: <TrendingUp className="w-5 h-5" /> },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      <Navbar />

      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(0,255,157,0.03) 40%, transparent 65%)",
        }}
      />

      {/* Telemetry grid */}
      <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl px-4 mt-24 mb-12 flex flex-col items-center"
      >
        {/* Brand Icon Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-6"
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-3 flex items-center justify-center relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(24,28,24,0.9), rgba(8,12,9,0.95))",
              border: "1px solid rgba(212,175,55,0.35)",
              boxShadow: "0 0 50px rgba(212,175,55,0.2), 0 0 80px rgba(0,255,157,0.1)",
            }}
          >
            <Image
              src="/brand/logo-icon.png"
              alt="SaruPol Palm Icon"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
              priority
            />
          </div>
        </motion.div>

        {/* 3D Embossed Text Logo Brand Header */}
        <div className="relative mb-4 max-w-[320px] sm:max-w-[420px]">
          <Image
            src="/brand/logo-text.png"
            alt="සරුපොල් (SaruPol)"
            width={420}
            height={110}
            className="w-auto h-16 sm:h-20 object-contain drop-shadow-[0_8px_28px_rgba(212,175,55,0.4)]"
            priority
          />
        </div>

        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          <span style={{ color: "#e8efe8" }}>Precision Coconut Research </span>
          <span style={{ color: "#00FF9D" }}>Intelligence</span>
        </h1>

        <p
          className="text-sm sm:text-base md:text-lg font-light mb-4 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(232, 239, 232, 0.65)" }}
        >
          Unified AI & IoT decision support system for Sri Lankan coconut plantations.
          Precision soil triangulation, pathology diagnostics, hybrid yield forecasting, and agronomist advisory.
        </p>

        <div className="flex items-center justify-center gap-3 mt-2">
          <kbd
            className="text-[10px] px-2.5 py-1 rounded-md font-mono"
            style={{
              background: "rgba(212,175,55,0.08)",
              color: "#E6AF2E",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            ⌘ + K
          </kbd>
          <span className="text-[11px] tracking-widest uppercase font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            Quick Command Palette
          </span>
        </div>
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
            <span style={{ color: "rgba(212,175,55,0.7)" }}>{stat.icon}</span>
            <div>
              <p className="text-lg font-medium font-mono" style={{ color: "#00FF9D" }}>
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
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
                      className="text-[10px] uppercase tracking-[0.2em] font-mono px-2 py-1 rounded bg-white/5 border border-white/10"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {mod.tag}
                    </span>
                  </div>

                  <h2
                    className="text-xl font-light mb-1 smooth-transition relative z-10 group-hover:text-emerald-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      color: "rgba(232,239,232,0.95)",
                    }}
                  >
                    {mod.title}
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: `${mod.accent}90` }}>
                    {mod.subtitle}
                  </p>
                  <p className="text-sm mb-5 leading-relaxed relative z-10" style={{ color: "rgba(232,239,232,0.5)" }}>
                    {mod.description}
                  </p>

                  <div
                    className="flex items-center gap-2 text-xs tracking-widest uppercase smooth-transition relative z-10 font-mono"
                    style={{ color: "rgba(212,175,55,0.8)" }}
                  >
                    <span>Launch Module</span>
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
          <Database className="w-5 h-5 mb-3" style={{ color: "rgba(212,175,55,0.7)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "rgba(232,239,232,0.8)" }}>
            6 AI Research Subsystems
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Soil · Pathology · Yield · Advisory · Operations · Analytics
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Cpu className="w-5 h-5 mb-3" style={{ color: "rgba(0,255,157,0.7)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "rgba(232,239,232,0.8)" }}>
            Hybrid ML Architecture
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Random Forest · LSTM · CNN · Multi-LLM RAG Consensus
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Leaf className="w-5 h-5 mb-3" style={{ color: "rgba(212,175,55,0.7)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1 font-mono" style={{ color: "rgba(232,239,232,0.8)" }}>
            CRI Research Grade
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Validated against Coconut Research Institute Sri Lanka guidelines
          </p>
        </div>
      </motion.div>

      {/* Branded Footer */}
      <footer
        className="w-full border-t py-8 px-6 text-center z-10 flex flex-col items-center gap-3 select-none"
        style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(3,7,5,0.9)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg p-1 bg-black/60 border border-amber-500/30 flex items-center justify-center">
            <Image
              src="/brand/logo-icon.png"
              alt="SaruPol Footer Icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <Image
            src="/brand/logo-text.png"
            alt="සරුපොල් (SaruPol)"
            width={100}
            height={26}
            className="h-5 w-auto object-contain"
          />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
          සරුපොල් (SaruPol) Precision Coconut Research Initiative · 2026
        </p>
      </footer>
    </main>
  );
}
