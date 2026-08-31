"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Award,
  Sparkles,
  Layers,
  Activity
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

const FEATURE_IMPORTANCES = [
  { feature: "Rainfall_Lag_12m", name: "12-Month Rainfall Lag", importance: 32.4, color: "#00E5FF" },
  { feature: "Soil_Moisture_Root", name: "Root Zone Soil Moisture", importance: 26.1, color: "#00FF9D" },
  { feature: "Solar_Radiation", name: "Solar Radiation Exposure", importance: 18.7, color: "#E6AF2E" },
  { feature: "Palm_Health_Score", name: "Empirical Palm Health (1-5)", importance: 11.2, color: "#A78BFA" },
  { feature: "Temperature_Range", name: "Diurnal Temperature Range", importance: 6.5, color: "#FF4C4C" },
  { feature: "NPK_Fertilizer_Dosage", name: "Soil NPK Balance Ratio", importance: 5.1, color: "#10B981" },
];

export default function ModelDossierTab() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Random Forest Model */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 255, 157, 0.02))",
            borderColor: "rgba(0, 255, 157, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">Random Forest Regressor</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-emerald-400" style={{ borderColor: "rgba(0,255,157,0.3)" }}>
              Tabular Best
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">R² Score:</span>
              <span className="font-bold text-emerald-400">0.9845</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Mean Absolute Error (MAE):</span>
              <span className="font-bold">106.29 nuts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Mean Absolute % Error (MAPE):</span>
              <span className="font-bold">5.09%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Estimators:</span>
              <span className="font-bold">100 Trees (Depth 15)</span>
            </div>
          </div>
        </div>

        {/* LSTM Neural Network */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(230, 175, 46, 0.08), rgba(230, 175, 46, 0.02))",
            borderColor: "rgba(230, 175, 46, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-500">LSTM Sequential Network</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-amber-500" style={{ borderColor: "rgba(230,175,46,0.3)" }}>
              Temporal
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">R² Score:</span>
              <span className="font-bold text-amber-500">0.8629</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Mean Absolute Error (MAE):</span>
              <span className="font-bold">315.09 nuts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Mean Absolute % Error (MAPE):</span>
              <span className="font-bold">14.80%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Architecture:</span>
              <span className="font-bold">LSTM(64) → LSTM(32) → Dense</span>
            </div>
          </div>
        </div>

        {/* Hybrid Production Model */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(0, 229, 255, 0.02))",
            borderColor: "rgba(0, 229, 255, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">Hybrid Ensemble (Production)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-cyan-400" style={{ borderColor: "rgba(0,229,255,0.3)" }}>
              Formula 0.6+0.4
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">R² Score:</span>
              <span className="font-bold text-cyan-400">0.9658</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Mean Absolute Error (MAE):</span>
              <span className="font-bold">124.50 nuts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ensemble Formula:</span>
              <span className="font-bold text-cyan-400">0.6 × RF + 0.4 × LSTM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Variance Guard:</span>
              <span className="font-bold">High Confidence (&lt;10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Breakdown */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl shadow-md space-y-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
          <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Random Forest Gini Feature Importance Breakdown</span>
          </h3>
          <span className="text-[10px] font-mono text-muted">39 Feature Dimension Analysis</span>
        </div>

        <div className="space-y-3">
          {FEATURE_IMPORTANCES.map((item) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.importance}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--card-border)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.importance}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Dataset Dossier */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
            Empirical Benchmark Dataset Specifications
          </h3>
        </div>
        <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
          The machine learning models are trained and cross-validated on authentic Coconut Research Institute (CRI) trial blocks across 7 agro-climatic benchmark estates (Makandura, Mellawa, Muruthenge, Hewana, Saliya, Maliga, and Jawatta). The dataset incorporates 12-to-24 month cumulative rainfall lag features, satellite-derived solar radiation, and root zone soil moisture sensor telemetry.
        </p>
      </div>
    </div>
  );
}
