"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Map, AlertTriangle, CheckCircle2, Eye, TreePine, Radio } from "lucide-react";

interface Hotspot {
  id: string;
  location: { lat: number; lng: number };
  severity: "critical" | "high" | "moderate";
  mean_index_value: number;
  radius_meters: number;
  recommended_action: string;
  status: "pending" | "inspected" | "resolved";
}

const MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: "HS-001", location: { lat: 7.2914, lng: 80.6342 },
    severity: "critical", mean_index_value: 0.28, radius_meters: 6.4,
    recommended_action: "Immediate on-site mobile leaf scan required for Bud Rot necrosis.",
    status: "pending",
  },
  {
    id: "HS-002", location: { lat: 7.2928, lng: 80.6325 },
    severity: "high", mean_index_value: 0.42, radius_meters: 4.8,
    recommended_action: "Crown chlorosis detected. Inspect for Potassium deficiency.",
    status: "pending",
  },
  {
    id: "HS-003", location: { lat: 7.2895, lng: 80.6358 },
    severity: "moderate", mean_index_value: 0.45, radius_meters: 3.5,
    recommended_action: "Slight canopy thinning. Monitor during next irrigation cycle.",
    status: "inspected",
  },
];

const MOCK_TREES = [
  { tree_no: 1, zone: "Block A", age: 15, health: 4.5, last_harvest: "2026-07-12" },
  { tree_no: 2, zone: "Block A", age: 12, health: 3.8, last_harvest: "2026-07-15" },
  { tree_no: 3, zone: "Block B", age: 22, health: 4.2, last_harvest: "2026-07-08" },
  { tree_no: 4, zone: "Block B", age: 8, health: 4.9, last_harvest: "2026-07-20" },
  { tree_no: 5, zone: "Block C", age: 18, health: 2.1, last_harvest: "2026-06-28" },
];

const sevColors: Record<string, string> = { critical: "#FF4C4C", high: "#FF8C00", moderate: "#E6AF2E" };
const statusColors: Record<string, string> = { pending: "#FF4C4C", inspected: "#E6AF2E", resolved: "#00FF9D" };

export default function OperationsPage() {
  const [hotspots] = useState<Hotspot[]>(MOCK_HOTSPOTS);
  const [tab, setTab] = useState<"hotspots" | "inventory">("hotspots");

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(167,139,250,0.1)" }}>
              <Map className="w-5 h-5" style={{ color: "#A78BFA" }} />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Field Operations</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(167,139,250,0.5)" }}>
                Canopy Hotspot Monitoring & Tree Inventory
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Switch */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex gap-1 p-1 rounded-full w-fit mb-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { id: "hotspots" as const, label: "Canopy Hotspots", icon: <Radio className="w-3.5 h-3.5" /> },
            { id: "inventory" as const, label: "Tree Inventory", icon: <TreePine className="w-3.5 h-3.5" /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs smooth-transition"
              style={{
                background: tab === t.id ? "rgba(167,139,250,0.12)" : "transparent",
                color: tab === t.id ? "#A78BFA" : "rgba(255,255,255,0.3)",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </motion.div>

        {/* Hotspots Tab */}
        {tab === "hotspots" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Critical", count: hotspots.filter(h => h.severity === "critical").length, color: "#FF4C4C" },
                { label: "High", count: hotspots.filter(h => h.severity === "high").length, color: "#FF8C00" },
                { label: "Moderate", count: hotspots.filter(h => h.severity === "moderate").length, color: "#E6AF2E" },
              ].map(s => (
                <div key={s.label} className="glass-panel p-4 text-center">
                  <p className="text-3xl font-mono font-light" style={{ color: s.color }}>{s.count}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Hotspot Cards */}
            {hotspots.map((hs, i) => (
              <motion.div key={hs.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: sevColors[hs.severity] }} />
                    <span className="text-sm font-medium" style={{ color: "rgba(232,239,232,0.85)" }}>{hs.id}</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono"
                      style={{ background: `${sevColors[hs.severity]}15`, color: sevColors[hs.severity] }}
                    >
                      {hs.severity}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono flex items-center gap-1.5"
                    style={{ color: statusColors[hs.status] }}
                  >
                    {hs.status === "resolved" ? <CheckCircle2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {hs.status}
                  </span>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(232,239,232,0.5)" }}>
                  {hs.recommended_action}
                </p>
                <div className="flex gap-4 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                  <span>NDVI: {hs.mean_index_value.toFixed(2)}</span>
                  <span>Radius: {hs.radius_meters}m</span>
                  <span>GPS: {hs.location.lat.toFixed(4)}, {hs.location.lng.toFixed(4)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Inventory Tab */}
        {tab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Tree", "Zone", "Age", "Health", "Last Harvest"].map(h => (
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
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: "rgba(232,239,232,0.5)" }}>{tree.age} yrs</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                          style={{
                            background: tree.health >= 4 ? "rgba(0,255,157,0.08)" : tree.health >= 3 ? "rgba(230,175,46,0.08)" : "rgba(255,76,76,0.08)",
                            color: tree.health >= 4 ? "#00FF9D" : tree.health >= 3 ? "#E6AF2E" : "#FF4C4C",
                          }}
                        >
                          {tree.health}/5
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: "rgba(232,239,232,0.35)" }}>{tree.last_harvest}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
