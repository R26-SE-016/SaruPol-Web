"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  { label: "Gateway Uptime", value: "99.7%", icon: <Wifi className="w-5 h-5" /> },
  { label: "Predictions Today", value: "142", icon: <TrendingUp className="w-5 h-5" /> },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      <Navbar />

      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,157,0.04) 0%, transparent 60%)" }}
      />

      {/* Telemetry grid */}
      <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl px-4 mt-28 mb-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,157,0.15), rgba(0,255,157,0.05))",
              border: "1px solid rgba(0,255,157,0.2)",
            }}
          >
            <Leaf className="w-7 h-7" style={{ color: "#00FF9D" }} />
            <div className="absolute inset-0 rounded-2xl animate-pulse-emerald" />
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          <span style={{ color: "#e8efe8" }}>Coconut Research</span>
          <br />
          <span style={{ color: "#00FF9D" }}>Intelligence</span>
        </h1>

        <p className="text-base md:text-lg font-light mb-4 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(232, 239, 232, 0.45)" }}
        >
          AI & IoT-driven decision support for Sri Lankan coconut plantations.
          Unified soil intelligence, pathology diagnostics, yield forecasting, and CRI-grounded agronomist advisory.
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <kbd className="text-[10px] px-2 py-1 rounded font-mono"
            style={{
              background: "rgba(0,255,157,0.06)",
              color: "rgba(0,255,157,0.4)",
              border: "1px solid rgba(0,255,157,0.1)",
            }}
          >
            ⌘ + K
          </kbd>
          <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
            Command Palette
          </span>
        </div>
      </motion.div>

      {/* Telemetry Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4 z-10 mb-12"
      >
        {telemetryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="glass-panel p-4 flex items-center gap-3"
          >
            <span style={{ color: "rgba(0,255,157,0.4)" }}>{stat.icon}</span>
            <div>
              <p className="text-lg font-medium font-mono" style={{ color: "#00FF9D" }}>{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
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
        transition={{ delay: 0.6, duration: 1 }}
        className="w-full max-w-6xl px-6 z-10 mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <Link href={mod.href} className="block group">
                <div className="glass-card p-7 relative overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${mod.accent}10, transparent 70%)` }}
                  />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-2 rounded-lg"
                      style={{
                        background: `${mod.accent}10`,
                        color: `${mod.accent}80`,
                      }}
                    >
                      {mod.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono"
                      style={{ color: "rgba(255,255,255,0.15)" }}
                    >
                      {mod.tag}
                    </span>
                  </div>

                  <h2 className="text-xl font-light mb-1 smooth-transition relative z-10"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      color: "rgba(232,239,232,0.9)",
                    }}
                  >
                    {mod.title}
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-3"
                    style={{ color: `${mod.accent}60` }}
                  >
                    {mod.subtitle}
                  </p>
                  <p className="text-sm mb-5 leading-relaxed relative z-10"
                    style={{ color: "rgba(232,239,232,0.35)" }}
                  >
                    {mod.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase smooth-transition relative z-10"
                    style={{ color: "rgba(232,239,232,0.25)" }}
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
        transition={{ delay: 1.2, duration: 1 }}
        className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-4 z-10 mb-12"
      >
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Database className="w-5 h-5 mb-3" style={{ color: "rgba(0,255,157,0.5)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(232,239,232,0.6)" }}>
            6 AI Research Subsystems
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Soil · Pathology · Yield · Advisory · Operations · Analytics
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Cpu className="w-5 h-5 mb-3" style={{ color: "rgba(0,255,157,0.5)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(232,239,232,0.6)" }}>
            Hybrid ML Architecture
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Random Forest · LSTM · CNN · Multi-LLM RAG Consensus
          </p>
        </div>
        <div className="glass-panel p-5 flex flex-col items-center text-center">
          <Leaf className="w-5 h-5 mb-3" style={{ color: "rgba(0,255,157,0.5)" }} />
          <h3 className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(232,239,232,0.6)" }}>
            CRI Research Grade
          </h3>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Validated against Coconut Research Institute standards
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full border-t py-6 text-center z-10"
        style={{ borderColor: "rgba(0,255,157,0.04)" }}
      >
        <p className="text-[10px] tracking-[0.3em] uppercase font-mono"
          style={{ color: "rgba(255,255,255,0.12)" }}
        >
          SaruPol Research Initiative · 2026
        </p>
      </footer>
    </main>
  );
}
