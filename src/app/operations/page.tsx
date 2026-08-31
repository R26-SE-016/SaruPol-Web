"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { TreePine, Map, Layers, Radio } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const MOCK_TREES = [
  { tree_no: 1, zone: "Block A (Sector 01)", age: 15, health: 4.5, last_harvest: "2026-07-12" },
  { tree_no: 2, zone: "Block A (Sector 02)", age: 12, health: 3.8, last_harvest: "2026-07-15" },
  { tree_no: 3, zone: "Block B (Sector 01)", age: 22, health: 4.2, last_harvest: "2026-07-08" },
  { tree_no: 4, zone: "Block B (Sector 02)", age: 8, health: 4.9, last_harvest: "2026-07-20" },
  { tree_no: 5, zone: "Block C (Sector 03)", age: 18, health: 2.1, last_harvest: "2026-06-28" },
];

export default function OperationsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(167,139,250,0.1)" }}>
              <TreePine className="w-5 h-5" style={{ color: "#A78BFA" }} />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>{t.operations.title}</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(167,139,250,0.5)" }}>
                {t.operations.subtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Spatial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs uppercase font-mono text-white/70">{t.operations.treeInventory}</span>
            </div>
            <p className="text-2xl font-mono font-light text-purple-400">1,248</p>
            <p className="text-[10px] text-white/40 font-mono mt-1">Tagged Palms across 3 Blocks</p>
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase font-mono text-white/70">{t.operations.droneSurvey}</span>
            </div>
            <p className="text-2xl font-mono font-light text-emerald-400">100%</p>
            <p className="text-[10px] text-white/40 font-mono mt-1">Orthomosaic Coverage (Kurunegala)</p>
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-mono text-white/70">{t.operations.activeHotspots}</span>
            </div>
            <p className="text-2xl font-mono font-light text-amber-400">2 Active</p>
            <p className="text-[10px] text-white/40 font-mono mt-1">Field Dispatches In-Flight</p>
          </div>
        </div>

        {/* Inventory Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Tree", "Zone", "Age (Yrs)", "Health Index", "Last Harvest Date"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider font-mono"
                      style={{ color: "rgba(167,139,250,0.5)" }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TREES.map((tree, i) => (
                  <motion.tr key={tree.tree_no}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="smooth-transition"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td className="px-5 py-3 text-sm font-mono" style={{ color: "#A78BFA" }}>#{tree.tree_no}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: "rgba(232,239,232,0.6)" }}>{tree.zone}</td>
                    <td className="px-5 py-3 text-xs font-mono" style={{ color: "rgba(232,239,232,0.8)" }}>{tree.age}</td>
                    <td className="px-5 py-3 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded text-[11px]"
                        style={{
                          background: tree.health > 4 ? "rgba(0,255,157,0.1)" : tree.health > 3 ? "rgba(230,175,46,0.1)" : "rgba(255,76,76,0.1)",
                          color: tree.health > 4 ? "#00FF9D" : tree.health > 3 ? "#E6AF2E" : "#FF4C4C",
                          border: `1px solid ${tree.health > 4 ? "rgba(0,255,157,0.2)" : tree.health > 3 ? "rgba(230,175,46,0.2)" : "rgba(255,76,76,0.2)"}`,
                        }}
                      >
                        {tree.health} / 5.0
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{tree.last_harvest}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
