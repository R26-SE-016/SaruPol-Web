"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { TreePine } from "lucide-react";

const MOCK_TREES = [
  { tree_no: 1, zone: "Block A", age: 15, health: 4.5, last_harvest: "2026-07-12" },
  { tree_no: 2, zone: "Block A", age: 12, health: 3.8, last_harvest: "2026-07-15" },
  { tree_no: 3, zone: "Block B", age: 22, health: 4.2, last_harvest: "2026-07-08" },
  { tree_no: 4, zone: "Block B", age: 8, health: 4.9, last_harvest: "2026-07-20" },
  { tree_no: 5, zone: "Block C", age: 18, health: 2.1, last_harvest: "2026-06-28" },
];

export default function OperationsPage() {
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
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Field Operations</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(167,139,250,0.5)" }}>
                Tree Inventory & Harvest Logs
              </p>
            </div>
          </div>
        </motion.div>

        {/* Inventory Table */}
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
      </div>
    </main>
  );
}
