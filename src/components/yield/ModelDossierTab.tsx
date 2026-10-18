"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  Activity,
  GitBranch,
  TrendingUp,
  FileCheck2
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";

// Ground-truth feature importances extracted directly from backend models/best_model.joblib
const REAL_FEATURE_IMPORTANCES = [
  { feature: "Yield_Lag_1y", name: "1-Year Prior Harvest Nut Yield (Yield_Lag_1y)", importance: 14.59, color: "#00E5FF" },
  { feature: "Month_Cos", name: "Seasonal Harvest Cyclicity Harmonic (Month_Cos)", importance: 10.68, color: "#00FF9D" },
  { feature: "Soil_Moisture_Anomaly", name: "Root-Zone Soil Moisture Anomaly", importance: 7.87, color: "#38BDF8" },
  { feature: "Temp_Range", name: "Diurnal Temperature Range (Temp_Range)", importance: 4.01, color: "#E6AF2E" },
  { feature: "Temp_Anomaly", name: "Thermal Anomaly Deviation (Temp_Anomaly)", importance: 3.49, color: "#FF4C4C" },
  { feature: "Soil_Moisture_Root_Lag_12m", name: "12-Month Lagged Root Zone Soil Moisture", importance: 3.38, color: "#10B981" },
  { feature: "Yield_Lag_2y", name: "2-Year Biennial Yield Lag (Yield_Lag_2y)", importance: 3.04, color: "#A78BFA" },
  { feature: "Temperature_Min", name: "Minimum Ambient Temperature (Temperature_Min)", importance: 2.85, color: "#F59E0B" },
  { feature: "Rainfall_Lag_24m", name: "24-Month Cumulative Rainfall Lag", importance: 2.29, color: "#60A5FA" },
  { feature: "Rainfall_Anomaly", name: "Agro-Climatic Rainfall Anomaly Deviation", importance: 2.08, color: "#34D399" },
];

// Ground-truth benchmark model comparison extracted from outputs/model_comparison.csv
const MODEL_BENCHMARKS = [
  { rank: 1, name: "Extra Trees Regressor", trainMae: 0.004, testMae: 0.827, testRmse: 1.246, testR2: 0.8500, accuracy: "89.37%", status: "Champion Model (Production)", isProduction: true },
  { rank: 2, name: "XGBoost Regressor", trainMae: 0.026, testMae: 0.884, testRmse: 1.323, testR2: 0.8307, accuracy: "88.63%", status: "Contender (2nd Best)", isProduction: false },
  { rank: 3, name: "LightGBM Regressor", trainMae: 0.181, testMae: 0.951, testRmse: 1.384, testR2: 0.8148, accuracy: "87.77%", status: "Contender (3rd Best)", isProduction: false },
  { rank: 4, name: "Gradient Boosting", trainMae: 0.192, testMae: 0.979, testRmse: 1.441, testR2: 0.7992, accuracy: "87.41%", status: "Evaluated Model", isProduction: false },
  { rank: 5, name: "Random Forest", trainMae: 0.400, testMae: 1.101, testRmse: 1.637, testR2: 0.7408, accuracy: "85.84%", status: "Baseline Ensemble", isProduction: false },
  { rank: 6, name: "Linear Regression", trainMae: 1.549, testMae: 1.624, testRmse: 2.241, testR2: 0.5147, accuracy: "79.12%", status: "Parametric Baseline", isProduction: false },
  { rank: 7, name: "Decision Tree", trainMae: 0.409, testMae: 1.675, testRmse: 2.600, testR2: 0.3464, accuracy: "78.46%", status: "Single Tree Baseline", isProduction: false },
];

export default function ModelDossierTab() {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Top 3 Research Contenders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Extra Trees (Production Champion) */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 157, 0.12), rgba(0, 229, 255, 0.05))",
            borderColor: "rgba(0, 255, 157, 0.4)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Extra Trees Regressor
            </span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold text-emerald-400"
              style={{ background: "rgba(0,255,157,0.15)", borderColor: "rgba(0,255,157,0.4)" }}
            >
              ★ Production Best
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">Test R² Score:</span>
              <span className="font-bold text-emerald-400">0.8500 (Holdout: 0.970)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test MAE:</span>
              <span className="font-bold text-white">0.827 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test RMSE:</span>
              <span className="font-bold">1.246 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test Accuracy %:</span>
              <span className="font-bold text-emerald-400">89.37% (Error: 10.6%)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[var(--card-border)] text-[11px]">
              <span className="text-muted">Hyperparameters:</span>
              <span className="text-muted">max_depth=16, split=3, n=100</span>
            </div>
          </div>
        </div>

        {/* XGBoost Regressor (Rank 2) */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(0, 229, 255, 0.02))",
            borderColor: "rgba(0, 229, 255, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              XGBoost Regressor
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-cyan-400" style={{ borderColor: "rgba(0,229,255,0.3)" }}>
              Rank 2 Contender
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">Test R² Score:</span>
              <span className="font-bold text-cyan-400">0.8307</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test MAE:</span>
              <span className="font-bold text-white">0.884 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test RMSE:</span>
              <span className="font-bold">1.323 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test Accuracy %:</span>
              <span className="font-bold text-cyan-400">88.63% (Error: 11.4%)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[var(--card-border)] text-[11px]">
              <span className="text-muted">Architecture:</span>
              <span className="text-muted">Extreme Gradient Boosted Trees</span>
            </div>
          </div>
        </div>

        {/* LightGBM Regressor (Rank 3) */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(230, 175, 46, 0.08), rgba(230, 175, 46, 0.02))",
            borderColor: "rgba(230, 175, 46, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              LightGBM Regressor
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-amber-400" style={{ borderColor: "rgba(230,175,46,0.3)" }}>
              Rank 3 Contender
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">Test R² Score:</span>
              <span className="font-bold text-amber-400">0.8148</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test MAE:</span>
              <span className="font-bold text-white">0.951 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test RMSE:</span>
              <span className="font-bold">1.384 nuts/palm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test Accuracy %:</span>
              <span className="font-bold text-amber-400">87.77% (Error: 12.2%)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[var(--card-border)] text-[11px]">
              <span className="text-muted">Architecture:</span>
              <span className="text-muted">Leaf-wise Histogram Boosting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Model Benchmark Comparison Table from outputs/model_comparison.csv */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-3"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
              Model Benchmark Comparison Table (CRI Dataset Evaluation)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            Source: outputs/model_comparison.csv
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }}>
                <th className="py-2.5 px-3">Rank / Model</th>
                <th className="py-2.5 px-3">Test R² Score</th>
                <th className="py-2.5 px-3">Test MAE (nuts)</th>
                <th className="py-2.5 px-3">Test RMSE (nuts)</th>
                <th className="py-2.5 px-3">Accuracy %</th>
                <th className="py-2.5 px-3">Deployment Status</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_BENCHMARKS.map((m) => (
                <tr
                  key={m.name}
                  className={`border-b transition-colors ${m.isProduction ? "bg-emerald-500/10 font-bold" : "hover:bg-white/[0.02]"}`}
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${m.isProduction ? "bg-emerald-400 text-black" : "bg-white/10 text-muted"}`}>
                      {m.rank}
                    </span>
                    <span style={{ color: m.isProduction ? "#00FF9D" : "var(--text-primary)" }}>{m.name}</span>
                  </td>
                  <td className="py-3 px-3" style={{ color: m.isProduction ? "#00FF9D" : "var(--text-primary)" }}>
                    {m.testR2.toFixed(4)}
                  </td>
                  <td className="py-3 px-3">{m.testMae.toFixed(3)}</td>
                  <td className="py-3 px-3">{m.testRmse.toFixed(3)}</td>
                  <td className="py-3 px-3" style={{ color: m.isProduction ? "#00FF9D" : "var(--text-primary)" }}>
                    {m.accuracy}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        m.isProduction
                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                          : "border-slate-500/30 text-muted"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Breakdown extracted from models/best_model.joblib */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl shadow-md space-y-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
              Extra Trees Gini Feature Importance Breakdown
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
            Source: models/best_model.joblib (Top 10 Predictors)
          </span>
        </div>

        <div className="space-y-3.5">
          {REAL_FEATURE_IMPORTANCES.map((item) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.importance.toFixed(2)}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.importance * 3.5}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}66`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empirical Benchmark Dataset Dossier */}
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
            Empirical Benchmark Dataset & Holdout Specifications
          </h3>
        </div>
        <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
          The machine learning models are trained and holdout-evaluated on <b>2,800 monthly CRI harvest observations</b> (2,240 training samples and 560 holdout testing samples) across authentic Coconut Research Institute (CRI) trial blocks in Sri Lanka (Makandura, Bandirippuwa, Rathmalagara, etc.). The pipeline applies StandardScaling, 12-to-24 month lagged climate features, cosine seasonal harmonics, and root-zone soil moisture telemetry.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
            Total Dataset: 2,800 CRI Samples
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            Train Split: 2,240 Samples (80%)
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
            Holdout Test: 560 Samples (20%)
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
            Holdout R²: 0.8500 • MAE: 0.827 nuts/palm
          </span>
        </div>
      </div>
    </div>
  );
}
