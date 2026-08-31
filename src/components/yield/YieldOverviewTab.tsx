"use client";

import React, { useState } from "react";
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
  };
  onParamChange: (key: string, value: number | string) => void;
  onPredict: () => void;
  isLoading: boolean;
  result: YieldPredictionResponse | null;
  cdaRates: CdaRatesResponse | null;
  calibrationFactor: number;
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
  cdaRates,
  calibrationFactor
}: YieldOverviewTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showAdvancedNutrients, setShowAdvancedNutrients] = useState(false);

  // Price calculations based on CDA market rates
  const avgNutPrice = cdaRates ? (cdaRates.a_grade_price * 0.5 + cdaRates.b_grade_price * 0.35 + cdaRates.c_grade_price * 0.15) : 138;
  const harvestRevenue = result ? Math.round(result.predicted_next_pick_yield_nuts * avgNutPrice) : 0;
  const annualRevenue = result ? Math.round(result.predicted_annual_yield_nuts * avgNutPrice) : 0;

  const sliders = [
    { key: "temperature", label: t.yield.temp, icon: <Thermometer className="w-4 h-4 text-red-500" />, min: 20, max: 40, step: 0.5, unit: "°C", color: "#FF4C4C" },
    { key: "humidity", label: t.yield.humidity, icon: <Droplets className="w-4 h-4 text-cyan-400" />, min: 30, max: 100, step: 1, unit: "%", color: "#00E5FF" },
    { key: "soil_moisture", label: t.yield.soilMoisture, icon: <Droplets className="w-4 h-4 text-emerald-400" />, min: 5, max: 60, step: 0.5, unit: "%", color: "#00FF9D" },
    { key: "rainfall", label: t.yield.rainfall, icon: <CloudRain className="w-4 h-4 text-sky-400" />, min: 20, max: 350, step: 5, unit: "mm", color: "#38BDF8" },
    { key: "palm_age", label: t.yield.palmAge, icon: <TreePine className="w-4 h-4 text-amber-400" />, min: 1, max: 60, step: 1, unit: "yrs", color: "#E6AF2E" },
    { key: "palm_health", label: t.yield.palmHealth, icon: <Heart className="w-4 h-4 text-purple-400" />, min: 1, max: 5, step: 0.5, unit: "/5", color: "#A78BFA" },
    { key: "fertilizer", label: t.yield.fertilizer, icon: <Sprout className="w-4 h-4 text-emerald-500" />, min: 0, max: 5, step: 0.25, unit: "kg/palm", color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Configuration Bar: Estate Selection & Tree Count */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 smooth-transition"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Estate Selector */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.yield.estateSelect}</span>
          </label>
          <select
            value={params.estate}
            onChange={(e) => onParamChange("estate", e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none smooth-transition cursor-pointer"
            style={{
              background: "var(--background)",
              borderColor: "var(--card-border)",
              color: "var(--text-primary)",
            }}
          >
            {BENCHMARK_ESTATES.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name}
              </option>
            ))}
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
      </div>

      {/* Climate & Agronomic Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-2xl border backdrop-blur-md shadow-sm smooth-transition"
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
                {params[s.key as keyof typeof params]} {s.unit}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={params[s.key as keyof typeof params] as number}
              onChange={(e) => onParamChange(s.key, parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${s.color} ${((params[s.key as keyof typeof params] as number - s.min) / (s.max - s.min)) * 100}%, var(--card-border) 0%)`,
              }}
            />
          </motion.div>
        ))}

        {/* Advanced Soil NPK Leaf Penalty Toggle Card */}
        <div
          className="p-4 rounded-2xl border backdrop-blur-md shadow-sm smooth-transition flex flex-col justify-between"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                Soil NPK Calibration
              </span>
            </div>
            <button
              onClick={() => setShowAdvancedNutrients(!showAdvancedNutrients)}
              className="text-[10px] font-mono px-2 py-1 rounded-lg border text-amber-500 flex items-center gap-1 hover:opacity-80 cursor-pointer"
              style={{ borderColor: "var(--card-border)", background: "rgba(230,175,46,0.1)" }}
            >
              <span>{showAdvancedNutrients ? "Hide" : "Expand"}</span>
              {showAdvancedNutrients ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
            Soil-to-leaf nutrient penalty modeling for 14th frond deficiency adjustment.
          </p>
        </div>
      </div>

      {/* Advanced Soil NPK Inputs (Collapsible) */}
      {showAdvancedNutrients && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ background: "rgba(0, 255, 157, 0.03)", borderColor: "rgba(0, 255, 157, 0.2)" }}
        >
          <div>
            <label className="text-[11px] font-mono block mb-1 text-emerald-400 font-bold">Soil N (mg/kg)</label>
            <input
              type="number"
              value={params.soil_n}
              onChange={(e) => onParamChange("soil_n", parseFloat(e.target.value) || 0)}
              className="w-full p-2 rounded-xl border text-xs font-mono"
              style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label className="text-[11px] font-mono block mb-1 text-amber-400 font-bold">Soil P (mg/kg)</label>
            <input
              type="number"
              value={params.soil_p}
              onChange={(e) => onParamChange("soil_p", parseFloat(e.target.value) || 0)}
              className="w-full p-2 rounded-xl border text-xs font-mono"
              style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label className="text-[11px] font-mono block mb-1 text-sky-400 font-bold">Soil K (mg/kg)</label>
            <input
              type="number"
              value={params.soil_k}
              onChange={(e) => onParamChange("soil_k", parseFloat(e.target.value) || 0)}
              className="w-full p-2 rounded-xl border text-xs font-mono"
              style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
          </div>
        </motion.div>
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
                    {t.yield.cycleForecast}
                  </span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-3xl font-mono font-bold text-cyan-400">
                  {result.predicted_next_pick_yield_nuts.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {t.yield.cycleForecastSub} ({params.trees_count} palms)
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t flex justify-between text-[11px] font-mono" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Per Palm Yield:</span>
                <span className="font-bold text-cyan-400">
                  {(result.predicted_next_pick_yield_nuts / params.trees_count).toFixed(1)} nuts
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
                <span style={{ color: "var(--text-secondary)" }}>Nutrient Penalty:</span>
                <span className={`font-bold ${result.penalty_percent && result.penalty_percent > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {result.penalty_percent ? `-${result.penalty_percent}%` : "0% Optimal"}
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
