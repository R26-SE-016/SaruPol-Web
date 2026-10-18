"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  TreePine,
  Heart,
  CloudRain,
  Sprout,
  ArrowRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import type { YieldPredictionResponse, CdaRatesResponse } from "@/lib/api";

interface YieldOverviewTabProps {
  params: {
    estate: string;
    trees_count: number;
    temperature: number;
    humidity: number;
    soil_moisture: number;
    rainfall: number;
    palm_age: number;
    palm_health: number;
    fertilizer: number;
    soil_n: number;
    soil_p: number;
    soil_k: number;
    soil_ph?: number;
    variety?: string;
    ageRange?: string;
    fronds?: number;
  };
  onParamChange: (key: string, value: number | string) => void;
  onPredict: () => void;
  isLoading: boolean;
  result: YieldPredictionResponse | null;
  baselineResult?: YieldPredictionResponse | null;
  cdaRates: CdaRatesResponse | null;
  calibrationFactor: number;
  farms?: any[];
  selectedFarmId?: string;
  onSelectFarm?: (farmId: string) => void;
  onOpenAddFarm?: () => void;
  iotTelemetry?: any | null;
  isIotLive?: boolean;
  onApplyIotTelemetry?: () => void;
  trees?: any[];
  selectedTreeId?: string;
  onSelectTree?: (treeId: string) => void;
}

const BENCHMARK_ESTATES = [
  { id: "Makandura", name: "Makandura Experimental Block (Intermediate)", zone: "Intermediate Zone" },
  { id: "Mellawa", name: "Mellawa Coastal Plantation (North Western)", zone: "Intermediate Zone" },
  { id: "Muruthenge", name: "Muruthenge Interior Agro-Estate", zone: "Intermediate Zone" },
  { id: "Hewana", name: "Hewana Sabaragamuwa Foothills", zone: "Wet Zone" },
  { id: "Saliya", name: "Saliya Dry-Zone Research Station", zone: "Dry Zone" },
  { id: "Maliga estate", name: "Maliga Southern Lowlands", zone: "Intermediate Zone" },
  { id: "Jawatta", name: "Jawatta Western Wet-Belt", zone: "Wet Zone" },
];

export default function YieldOverviewTab({
  params,
  onParamChange,
  onPredict,
  isLoading,
  result,
  baselineResult,
  cdaRates,
  calibrationFactor,
  farms = [],
  selectedFarmId = "",
  onSelectFarm,
  onOpenAddFarm,
  iotTelemetry = null,
  isIotLive = false,
  onApplyIotTelemetry,
  trees = [],
  selectedTreeId = "all",
  onSelectTree,
}: YieldOverviewTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showAdvancedNutrients, setShowAdvancedNutrients] = useState(true);

  // Keep calibration inputs expanded whenever Tree-Wise individual mode is active
  useEffect(() => {
    if (selectedTreeId !== "all") {
      setShowAdvancedNutrients(true);
    }
  }, [selectedTreeId]);

  // Price calculations based on CDA market rates
  const avgNutPrice = cdaRates ? (cdaRates.a_grade_price * 0.5 + cdaRates.b_grade_price * 0.35 + cdaRates.c_grade_price * 0.15) : 138;
  const harvestRevenue = result ? Math.round(result.predicted_next_pick_yield_nuts * avgNutPrice) : 0;
  const annualRevenue = result ? Math.round(result.predicted_annual_yield_nuts * avgNutPrice) : 0;

  const sliders = [
    { key: "temperature", label: t.yield.temp, icon: <Thermometer className="w-4 h-4 text-red-500" />, min: 20, max: 40, step: 0.5, unit: "°C", color: "#FF4C4C", badge: "Live Sensor (ESP32)", isLive: true },
    { key: "humidity", label: t.yield.humidity, icon: <Droplets className="w-4 h-4 text-cyan-400" />, min: 30, max: 100, step: 1, unit: "%", color: "#00E5FF", badge: "Live Sensor (ESP32)", isLive: true },
    { key: "soil_moisture", label: t.yield.soilMoisture, icon: <Droplets className="w-4 h-4 text-emerald-400" />, min: 5, max: 60, step: 0.5, unit: "%", color: "#00FF9D", badge: "Live Sensor (ESP32)", isLive: true },
    { key: "rainfall", label: t.yield.rainfall, icon: <CloudRain className="w-4 h-4 text-sky-400" />, min: 20, max: 350, step: 5, unit: "mm", color: "#38BDF8", badge: "Regional Climate (CRI)", isLive: false },
    { key: "palm_age", label: t.yield.palmAge, icon: <TreePine className="w-4 h-4 text-amber-400" />, min: 1, max: 60, step: 1, unit: "yrs", color: "#E6AF2E", badge: selectedTreeId !== "all" ? "Tree Age" : "Plantation Profile", isLive: false },
    { key: "palm_health", label: t.yield.palmHealth, icon: <Heart className="w-4 h-4 text-purple-400" />, min: 1, max: 5, step: 0.5, unit: "/5", color: "#A78BFA", badge: "Agronomic Health", isLive: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Configuration Bar: Estate / Registered Farm Selection & Tree Count */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 smooth-transition"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Estate & Farm Selector */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.yield.estateSelect} & Registered Farms</span>
            </label>
            {onOpenAddFarm && (
              <button
                type="button"
                onClick={onOpenAddFarm}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                + Register New Farm
              </button>
            )}
          </div>
          <select
            value={selectedFarmId || params.estate}
            onChange={(e) => {
              const val = e.target.value;
              const matchingFarm = farms.find((f) => f.id === val);
              if (matchingFarm && onSelectFarm) {
                onSelectFarm(val);
              } else {
                onParamChange("estate", val);
              }
            }}
            className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none smooth-transition cursor-pointer"
            style={{
              background: "var(--background)",
              borderColor: "var(--card-border)",
              color: "var(--text-primary)",
            }}
          >
            {farms.length > 0 && (
              <optgroup label="Registered Farms (Database)">
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} • {f.locationName} ({f.totalTrees} palms{f.deviceIds?.[0] ? ` • IoT: ${f.deviceIds[0]}` : ""})
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Benchmark Estates (CRI Stations)">
              {BENCHMARK_ESTATES.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Tree Count Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
            <span className="flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.yield.treeCount}</span>
            </span>
            <span className="text-[10px] font-bold text-amber-500">{params.trees_count} palms</span>
          </label>
          <input
            type="number"
            min={1}
            max={5000}
            value={params.trees_count}
            onChange={(e) => onParamChange("trees_count", parseInt(e.target.value) || 1)}
            className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none smooth-transition"
            style={{
              background: "var(--background)",
              borderColor: "var(--card-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Prediction Scope Toggle: Whole Farm Aggregate vs Individual Tree-Wise */}
        <div className="md:col-span-3 pt-3 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>Forecast Scope:</span>
            <div className="inline-flex p-1 rounded-xl border" style={{ background: "rgba(0,0,0,0.2)", borderColor: "var(--card-border)" }}>
              <button
                type="button"
                onClick={() => onSelectTree && onSelectTree("all")}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedTreeId === "all"
                    ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm"
                    : "text-muted hover:text-white"
                }`}
              >
                Whole Farm Aggregate ({trees?.length || params.trees_count} Palms)
              </button>
              <button
                type="button"
                onClick={() => onSelectTree && onSelectTree(trees[0]?.id || "tree-1")}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedTreeId !== "all"
                    ? "bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm"
                    : "text-muted hover:text-white"
                }`}
              >
                Tree-Wise Individual Palm
              </button>
            </div>
          </div>

          {selectedTreeId !== "all" && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-cyan-400 font-bold">Target Palm:</span>
              <select
                value={selectedTreeId}
                onChange={(e) => onSelectTree && onSelectTree(e.target.value)}
                className="p-2 rounded-xl border text-xs font-mono cursor-pointer outline-none smooth-transition"
                style={{
                  background: "var(--background)",
                  borderColor: "rgba(0, 229, 255, 0.4)",
                  color: "var(--text-primary)",
                }}
              >
                {(trees && trees.length > 0 ? trees : [{ id: "tree-1", number: 1, status: "Bearing", health: "Healthy" }]).map((t, idx) => {
                  const tId = String(t?.id || `tree-${idx + 1}`);
                  const tNum = t?.number ?? (tId.includes("tree-") ? tId.replace("tree-", "") : idx + 1);
                  return (
                    <option key={tId} value={tId}>
                      Tree #{tNum} • {t?.status || "Bearing"} ({t?.health || "Healthy"})
                    </option>
                  );
                })}
              </select>
              <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                Firebase Telemetry Linked
              </span>
            </div>
          )}
        </div>
      </div>

      {/* IoT Telemetry Live Stream Banner & Sensor Dashboard */}
      {iotTelemetry && (
        <div className="space-y-3">
          <div
            className="p-3.5 rounded-2xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-md smooth-transition"
            style={{
              background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 229, 255, 0.05))",
              borderColor: "rgba(0, 255, 157, 0.25)",
            }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full ${isIotLive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span className="text-xs font-mono font-bold text-emerald-400">
                ESP32 Node ({iotTelemetry.deviceId}) {isIotLive ? "• Firebase Real-Time Stream" : "• Last Cached Reading"}
              </span>
              <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                Timestamp: <b className="text-amber-400">{iotTelemetry.timestamp || "Live"}</b> • Status: <b className="text-emerald-400">{iotTelemetry.status || "board_alive"}</b>
              </span>
            </div>

            {onApplyIotTelemetry && (
              <button
                type="button"
                onClick={onApplyIotTelemetry}
                className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 229, 255, 0.1))",
                  borderColor: "rgba(0, 255, 157, 0.4)",
                  color: theme === "dark" ? "#00FF9D" : "#00875A",
                }}
              >
                ⚡ Sync Real-Time Telemetry
              </button>
            )}
          </div>

          {/* 4-Card Live Sensor Readings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className="p-3 rounded-xl border backdrop-blur-md space-y-1"
              style={{ background: "rgba(0, 255, 157, 0.04)", borderColor: "rgba(0, 255, 157, 0.2)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Soil Moisture</span>
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl font-mono font-bold text-emerald-400">
                {iotTelemetry.soilMoisturePercent || params.soil_moisture}%
              </p>
              <p className="text-[9px] font-mono text-muted">
                Raw: {iotTelemetry.soilMoistureRaw || "Calibrated"} • Optimal
              </p>
            </div>

            <div
              className="p-3 rounded-xl border backdrop-blur-md space-y-1"
              style={{ background: "rgba(255, 76, 76, 0.04)", borderColor: "rgba(255, 76, 76, 0.2)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">Temperature</span>
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
              </div>
              <p className="text-xl font-mono font-bold text-red-400">
                {iotTelemetry.temperatureC || params.temperature}°C
              </p>
              <p className="text-[9px] font-mono text-muted">
                Ambient Air Sensor • Thermal
              </p>
            </div>

            <div
              className="p-3 rounded-xl border backdrop-blur-md space-y-1"
              style={{ background: "rgba(0, 229, 255, 0.04)", borderColor: "rgba(0, 229, 255, 0.2)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-mono font-bold text-cyan-400">
                {iotTelemetry.humidityPercent || params.humidity}%
              </p>
              <p className="text-[9px] font-mono text-muted">
                Relative Air RH • Vapor
              </p>
            </div>

            <div
              className="p-3 rounded-xl border backdrop-blur-md space-y-1"
              style={{ background: "rgba(230, 175, 46, 0.04)", borderColor: "rgba(230, 175, 46, 0.2)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold">Sunlight</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-xl font-mono font-bold text-amber-500">
                {iotTelemetry.lightLux || 106} Lux
              </p>
              <p className="text-[9px] font-mono text-muted">
                Canopy Solar Intensity
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Climate & Agronomic Telemetry Meters (Read-Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((s, i) => {
          const val = (params[s.key as keyof typeof params] as number) ?? s.min;
          const pct = Math.min(100, Math.max(0, ((val - s.min) / (s.max - s.min)) * 100));

          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-2xl border backdrop-blur-md shadow-sm smooth-transition flex flex-col justify-between"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex items-center gap-2">
                  <span>{s.icon}</span>
                  <span className="text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>
                  {val} {s.unit}
                </span>
              </div>

              {/* Non-draggable Real-Time Progress Bar */}
              <div
                className="w-full h-2 rounded-full overflow-hidden relative"
                style={{ background: "rgba(255, 255, 255, 0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(90deg, ${s.color}66, ${s.color})`,
                    boxShadow: `0 0 10px ${s.color}66`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                <span>{s.min} {s.unit}</span>
                <span className={`font-bold flex items-center gap-1 ${s.isLive ? "text-emerald-400" : "text-amber-400/90"}`}>
                  {s.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {s.badge}
                </span>
                <span>{s.max} {s.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Soil Chemistry & Palm Biology Calibration Card — ONLY rendered in Tree-Wise mode */}
      {selectedTreeId !== "all" ? (
        <div
          className="p-4 rounded-2xl border backdrop-blur-md shadow-sm smooth-transition space-y-4"
          style={{
            background: "var(--card-bg)",
            borderColor: "rgba(0, 229, 255, 0.3)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm"
                style={{ background: "rgba(0, 255, 157, 0.12)", borderColor: "rgba(0, 255, 157, 0.3)" }}
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                    Tree-Wise Biological & Soil Calibration
                  </span>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full border text-cyan-400"
                    style={{ background: "rgba(0, 229, 255, 0.08)", borderColor: "rgba(0, 229, 255, 0.25)" }}
                  >
                    Individual Palm Precision ML
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted">
                  Dynamically alters single palm yield via root-zone NPK deficiencies, pH gating, crown fronds count, and cultivar genetics.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdvancedNutrients(!showAdvancedNutrients)}
              className="text-[11px] font-mono px-3 py-1.5 rounded-xl border text-cyan-400 flex items-center gap-1.5 hover:opacity-80 cursor-pointer font-bold transition-all shadow-sm"
              style={{ borderColor: "rgba(0, 229, 255, 0.3)", background: "rgba(0, 229, 255, 0.1)" }}
            >
              <span>{showAdvancedNutrients ? "Collapse Calibration" : "Calibrate Parameters"}</span>
              {showAdvancedNutrients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Calibration Inputs Grid */}
          {showAdvancedNutrients && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
              style={{ borderColor: "var(--card-border)" }}
            >
              <div
                className="col-span-1 sm:col-span-2 lg:col-span-4 p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
                style={{ background: "rgba(0, 229, 255, 0.08)", borderColor: "rgba(0, 229, 255, 0.3)", color: "var(--text-primary)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>
                    <b>Individual Palm Calibration Active:</b> Tree #{trees.find((t) => String(t?.id) === String(selectedTreeId))?.number || String(selectedTreeId || "").replace("tree-", "") || "1"}
                  </span>
                  <span className="text-[11px] text-muted">• Health: <b className="text-emerald-400">{trees.find((t) => String(t?.id) === String(selectedTreeId))?.health || "Healthy"}</b></span>
                </div>
                <span className="text-[11px] text-cyan-300 font-bold">
                  Status: {trees.find((t) => t.id === selectedTreeId)?.status || "Bearing"} • Single Palm Yield Mode (1 Palm)
                </span>
              </div>

              {/* Soil Nitrogen (N) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-emerald-400 font-bold">Soil N (mg/kg)</label>
                <input
                  type="number"
                  value={params.soil_n}
                  onChange={(e) => onParamChange("soil_n", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Optimal: 30 - 60 mg/kg</span>
              </div>

              {/* Soil Phosphorus (P) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-amber-400 font-bold">Soil P (mg/kg)</label>
                <input
                  type="number"
                  value={params.soil_p}
                  onChange={(e) => onParamChange("soil_p", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Optimal: 15 - 30 mg/kg</span>
              </div>

              {/* Soil Potassium (K) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-sky-400 font-bold">Soil K (mg/kg)</label>
                <input
                  type="number"
                  value={params.soil_k}
                  onChange={(e) => onParamChange("soil_k", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Optimal: 90 - 150 mg/kg</span>
              </div>

              {/* Root-Zone Soil Moisture (%) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-cyan-400 font-bold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Soil Moisture (%)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="70"
                  value={params.soil_moisture}
                  onChange={(e) => onParamChange("soil_moisture", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Optimal: 18% - 35% volumetric</span>
              </div>

              {/* Soil pH */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-purple-400 font-bold">Soil pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="9.5"
                  value={params.soil_ph ?? 6.5}
                  onChange={(e) => onParamChange("soil_ph", parseFloat(e.target.value) || 6.5)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Gating penalty if &lt;5.0 or &gt;8.0</span>
              </div>

              {/* Palm Cultivar / Variety */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-emerald-400 font-bold">Palm Cultivar / Variety</label>
                <select
                  value={params.variety ?? "Tall"}
                  onChange={(e) => onParamChange("variety", e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none cursor-pointer"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                >
                  <option value="Tall">Sri Lanka Tall (Typica • 1.0x)</option>
                  <option value="Hybrid">CRIC65 Hybrid (High-Yield • 1.20x)</option>
                  <option value="Dwarf">Dwarf Cultivar (Kundira • 0.85x)</option>
                </select>
                <span className="text-[9px] font-mono text-muted block">Applies genetic bio-modifier</span>
              </div>

              {/* Active Green Fronds Count */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-amber-400 font-bold">Crown Fronds Count</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={params.fronds ?? 32}
                  onChange={(e) => onParamChange("fronds", parseInt(e.target.value) || 32)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Standard: 30 - 36 fronds</span>
              </div>

              {/* Palm Age Bracket */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-sky-400 font-bold">Age Bracket Stage</label>
                <select
                  value={params.ageRange ?? "15-30"}
                  onChange={(e) => onParamChange("ageRange", e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none cursor-pointer"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                >
                  <option value="15-30">15 - 30 yrs (Peak Bearing • 1.0x)</option>
                  <option value="31-45">31 - 45 yrs (Mature Bearing • 1.0x)</option>
                  <option value="46-60">46 - 60 yrs (Late Bearing • 0.85x)</option>
                  <option value="50+">&gt; 50 yrs (Senescent • 0.65x)</option>
                </select>
                <span className="text-[9px] font-mono text-muted block">Age modifier curve</span>
              </div>

              {/* Palm Age (Years) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-amber-400 font-bold">Palm Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={params.palm_age}
                  onChange={(e) => {
                    const age = parseInt(e.target.value) || 1;
                    onParamChange("palm_age", age);
                    if (age <= 30) onParamChange("ageRange", "15-30");
                    else if (age <= 45) onParamChange("ageRange", "31-45");
                    else if (age <= 60) onParamChange("ageRange", "46-60");
                    else onParamChange("ageRange", "50+");
                  }}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Direct plantation age</span>
              </div>

              {/* Fertilizer Dosage */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono block text-purple-400 font-bold">Fertilizer (kg/palm/yr)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="10"
                  value={params.fertilizer}
                  onChange={(e) => onParamChange("fertilizer", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
                <span className="text-[9px] font-mono text-muted block">Recommended CRI APN: 2.0 - 3.0 kg</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div
          className="p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs font-mono shadow-sm smooth-transition"
          style={{ background: "rgba(0, 229, 255, 0.04)", borderColor: "rgba(0, 229, 255, 0.2)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0"
              style={{ background: "rgba(0, 229, 255, 0.12)", borderColor: "rgba(0, 229, 255, 0.3)" }}
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-400">Whole Farm Baseline Mode Active</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  Macro Agro-Climatic Model
                </span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Predicting standard estate-level harvest baseline across all {params.trees_count} palms. To inspect or calibrate individual palm root-zone soil NPK, pH, and tree biology, select <b>Tree-Wise Individual Palm</b> above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button & Calibration Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onPredict}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-mono font-bold smooth-transition shadow-lg cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,255,157,0.3))",
            color: "var(--text-primary)",
            border: "1px solid rgba(0,229,255,0.5)",
          }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span>{t.yield.calculating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t.yield.predictBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        {/* Calibration Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold shadow-sm"
            style={{
              background: calibrationFactor !== 1.0 ? "rgba(0,255,157,0.12)" : "rgba(230,175,46,0.12)",
              borderColor: calibrationFactor !== 1.0 ? "rgba(0,255,157,0.3)" : "rgba(230,175,46,0.3)",
              color: calibrationFactor !== 1.0 ? (theme === "dark" ? "#00FF9D" : "#00875A") : (theme === "dark" ? "#E6AF2E" : "#B45309"),
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {calibrationFactor !== 1.0
                ? `${t.yield.calibrationBadge} (${calibrationFactor.toFixed(2)}x)`
                : t.yield.uncalibratedBadge}
            </span>
          </span>
        </div>
      </div>

      {/* Primary KPI Results Cards */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 45-Day Harvest Pick Forecast */}
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(0, 255, 157, 0.04))",
                borderColor: "rgba(0, 229, 255, 0.25)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400">
                    {selectedTreeId !== "all" ? "Single Palm 45-Day Yield" : t.yield.cycleForecast}
                  </span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-3xl font-mono font-bold text-cyan-400">
                  {result.predicted_next_pick_yield_nuts.toLocaleString()} <span className="text-xs font-normal text-muted">nuts</span>
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {selectedTreeId !== "all"
                    ? `Tree #${trees.find((t) => String(t?.id) === String(selectedTreeId))?.number || String(selectedTreeId || "").replace("tree-", "") || "1"} Precision Pick Forecast`
                    : `${t.yield.cycleForecastSub} (${params.trees_count} palms)`}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t flex justify-between text-[11px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {selectedTreeId !== "all" ? "Baseline vs Calibrated:" : "Per Palm Yield:"}
                </span>
                <span className="font-bold text-cyan-400">
                  {selectedTreeId !== "all" && baselineResult ? (
                    <span>
                      Base: {(baselineResult.predicted_next_pick_yield_nuts / (baselineResult.trees_count || 1)).toFixed(1)} → Palm: {result.predicted_next_pick_yield_nuts}
                    </span>
                  ) : (
                    `${(result.predicted_next_pick_yield_nuts / params.trees_count).toFixed(1)} nuts`
                  )}
                </span>
              </div>
            </div>

            {/* Projected Annual Yield */}
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 255, 157, 0.02))",
                borderColor: "rgba(0, 255, 157, 0.25)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                    {t.yield.annualYield}
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-mono font-bold text-emerald-400">
                  {result.predicted_annual_yield_nuts.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {t.yield.annualYieldSub}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t flex justify-between text-[11px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Annual Per Tree:</span>
                <span className="font-bold text-emerald-400">
                  {(result.predicted_annual_yield_nuts / params.trees_count).toFixed(0)} nuts/yr
                </span>
              </div>
            </div>

            {/* CDA Gross Revenue Forecast */}
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(230, 175, 46, 0.08), rgba(230, 175, 46, 0.02))",
                borderColor: "rgba(230, 175, 46, 0.25)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500">
                    {t.yield.cdaRevenue}
                  </span>
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-mono font-bold text-amber-500">
                  LKR {harvestRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {t.yield.cdaRevenueSub} (LKR {Math.round(avgNutPrice)}/nut)
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t flex justify-between text-[11px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Annual Gross:</span>
                <span className="font-bold text-amber-500">
                  LKR {annualRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Ensemble Model Confidence & Penalties */}
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex flex-col justify-between"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-purple-400">
                    {t.yield.ensembleConfidence}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-3xl font-mono font-bold text-purple-400">
                  {result.confidence_percentage}%
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {t.yield.hybridFormula}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t flex justify-between text-[11px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {selectedTreeId !== "all" ? "Tree Nutrient Penalty:" : "Macro Model Status:"}
                </span>
                <span className={`font-bold ${result.penalty_percent && result.penalty_percent > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {result.penalty_percent && result.penalty_percent > 0 ? `-${result.penalty_percent}%` : (selectedTreeId !== "all" ? "0% (Optimal Soil)" : "Baseline Standard")}
                </span>
              </div>
            </div>

          </div>

          {/* Agronomic Recommendations Box */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                  {t.yield.directivesTitle}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border flex items-start gap-2.5 text-xs font-mono"
                    style={{ background: "rgba(0, 255, 157, 0.04)", borderColor: "rgba(0, 255, 157, 0.15)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                    <span style={{ color: "var(--text-secondary)" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
