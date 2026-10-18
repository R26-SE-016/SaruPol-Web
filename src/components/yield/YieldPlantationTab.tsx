"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePine,
  ShieldCheck,
  Sprout,
  HeartPulse,
  Activity,
  Wifi,
  WifiOff,
  Layers,
  Building2,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export interface TreeData {
  id: string;
  number: number;
  status: string;
  health: string;
  yield?: number;
  notes?: string;
  sensorData?: {
    n?: number;
    p?: number;
    k?: number;
    ph?: number;
    soilMoisture?: number;
  };
}

interface YieldPlantationTabProps {
  farm: {
    id: string;
    name: string;
    locationName: string;
    totalTrees: number;
    perches?: number;
    deviceIds?: string[];
  } | null;
  trees: Record<string, TreeData>;
  iotTelemetry: any | null;
  isIotLive: boolean;
  onOpenAddFarm: () => void;
}

export default function YieldPlantationTab({
  farm,
  trees,
  iotTelemetry,
  isIotLive,
  onOpenAddFarm,
}: YieldPlantationTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);

  const treeList = Object.values(trees).sort((a, b) => a.number - b.number);
  const totalTreesCount = farm ? farm.totalTrees : treeList.length || 10;

  // Tree health stats
  const healthyCount = treeList.filter((t) => t.health?.toLowerCase().includes("health") || t.health?.toLowerCase().includes("good")).length;
  const bearingCount = treeList.filter((t) => t.status?.toLowerCase().includes("bear")).length;

  return (
    <div className="space-y-6">
      {/* Farm & IoT Telemetry Overview Card */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-5 items-center smooth-transition"
        style={{
          background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 229, 255, 0.04))",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm"
              style={{
                background: "rgba(0, 255, 157, 0.15)",
                borderColor: "rgba(0, 255, 157, 0.3)",
              }}
            >
              <TreePine className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  {farm ? farm.name : "Plantation Digital Twin"}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                  style={{
                    background: "rgba(0, 255, 157, 0.12)",
                    borderColor: "rgba(0, 255, 157, 0.3)",
                    color: theme === "dark" ? "#00FF9D" : "#00875A",
                  }}
                >
                  {farm ? `${farm.locationName} Estate` : "Empirical Field"}
                </span>
              </div>
              <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                Field inventory mapping with per-tree health diagnostics & IoT telemetry.
              </p>
            </div>
          </div>

          {/* Quick stats pills */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span
              className="text-xs font-mono px-3 py-1 rounded-xl border flex items-center gap-1.5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{totalTreesCount} Total Palms</span>
            </span>
            <span
              className="text-xs font-mono px-3 py-1 rounded-xl border flex items-center gap-1.5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{treeList.length > 0 ? Math.round((healthyCount / treeList.length) * 100) : 100}% Optimal Health</span>
            </span>
            {farm?.perches && (
              <span
                className="text-xs font-mono px-3 py-1 rounded-xl border flex items-center gap-1.5"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
              >
                <span>{farm.perches} Perches</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Action: IoT Stream Status */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
          style={{
            background: isIotLive ? "rgba(0, 255, 157, 0.08)" : "rgba(255, 255, 255, 0.02)",
            borderColor: isIotLive ? "rgba(0, 255, 157, 0.25)" : "var(--card-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isIotLive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                {isIotLive ? "IoT Stream Live" : "IoT Sensor Standby"}
              </span>
            </div>
            {isIotLive ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-slate-400" />}
          </div>

          <div className="text-[11px] font-mono space-y-1" style={{ color: "var(--text-muted)" }}>
            <p>Node: <span className="text-amber-500 font-bold">{iotTelemetry?.deviceId || farm?.deviceIds?.[0] || "DEV_LUN_01"}</span></p>
            {iotTelemetry && (
              <p>Soil Moisture: <span className="text-emerald-400 font-bold">{iotTelemetry.soilMoisturePercent || 64}%</span> • Temp: <span className="text-cyan-400 font-bold">{iotTelemetry.temperatureC || 29.4}°C</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Palm Trees Grid */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
              Palm Canopy & Tree Census ({treeList.length > 0 ? treeList.length : totalTreesCount} Tracked)
            </h4>
          </div>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            Click a palm to inspect tree health and historical yield diagnostics
          </p>
        </div>

        {/* Tree Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(treeList.length > 0 ? treeList : Array.from({ length: totalTreesCount }, (_, i) => ({
            id: `tree-${i + 1}`,
            number: i + 1,
            status: "Bearing",
            health: "Healthy",
            yield: 8.8,
          }))).map((tree) => {
            const isSelected = selectedTree?.id === tree.id;
            return (
              <motion.div
                key={tree.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTree(tree)}
                className="p-3.5 rounded-xl border cursor-pointer smooth-transition relative overflow-hidden"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(0, 255, 157, 0.15), rgba(0, 229, 255, 0.08))"
                    : "rgba(255, 255, 255, 0.02)",
                  borderColor: isSelected ? "#00FF9D" : "var(--card-border)",
                  boxShadow: isSelected ? "0 0 15px rgba(0, 255, 157, 0.2)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                    Palm #{tree.number}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: tree.health?.toLowerCase().includes("health") || tree.health?.toLowerCase().includes("good")
                        ? "#00FF9D"
                        : "#E6AF2E",
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <TreePine className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-[10px] font-mono font-bold" style={{ color: "var(--text-secondary)" }}>
                      {tree.status || "Bearing"}
                    </p>
                    <p className="text-[9px] font-mono text-emerald-400">
                      {tree.health || "Healthy"}
                    </p>
                  </div>
                </div>

                <div className="pt-1.5 border-t flex justify-between items-center text-[10px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Yield</span>
                  <span className="font-bold text-amber-500">
                    {tree.yield ? `${tree.yield} nuts/pk` : "8.8 nuts/pk"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Tree Details Drawer */}
        <AnimatePresence>
          {selectedTree && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl border mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4"
              style={{
                background: "rgba(0, 255, 157, 0.05)",
                borderColor: "rgba(0, 255, 157, 0.25)",
              }}
            >
              <div>
                <span className="text-[10px] font-mono text-muted uppercase">Palm Number</span>
                <p className="text-sm font-mono font-bold text-emerald-400">Palm #{selectedTree.number}</p>
                <p className="text-xs font-mono text-secondary">Status: {selectedTree.status || "Bearing"}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-muted uppercase">Health Diagnostic</span>
                <p className="text-sm font-mono font-bold text-emerald-400">{selectedTree.health || "Healthy"}</p>
                <p className="text-xs font-mono text-muted">CRI Frond Rating: 4.8 / 5.0</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-muted uppercase">Cycle Pick Forecast</span>
                <p className="text-sm font-mono font-bold text-amber-500">
                  {selectedTree.yield || 8.8} nuts / 45-days
                </p>
                <p className="text-xs font-mono text-muted">Annual Projected: ~71 nuts</p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setSelectedTree(null)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer smooth-transition"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
