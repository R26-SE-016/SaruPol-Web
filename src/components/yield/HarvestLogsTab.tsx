"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Building2,
  TreePine,
  TrendingUp,
  Scale,
  Sparkles
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export interface HarvestLogRecord {
  id: string;
  date: string;
  actual_yield_nuts: number;
  predicted_yield_nuts: number;
  grade_a_nuts?: number;
  grade_b_nuts?: number;
  grade_c_nuts?: number;
  notes?: string;
}

interface HarvestLogsTabProps {
  logs: HarvestLogRecord[];
  onAddLog: (log: Omit<HarvestLogRecord, "id">) => void;
  onDeleteLog: (id: string) => void;
  calibrationFactor: number;
  estate: string;
  treesCount: number;
}

export default function HarvestLogsTab({
  logs,
  onAddLog,
  onDeleteLog,
  calibrationFactor,
  estate,
  treesCount
}: HarvestLogsTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actualNuts, setActualNuts] = useState<number>(1750);
  const [predictedNuts, setPredictedNuts] = useState<number>(1620);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<string>("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualNuts || !harvestDate) return;

    onAddLog({
      date: harvestDate,
      actual_yield_nuts: actualNuts,
      predicted_yield_nuts: predictedNuts || actualNuts,
      notes: notes || undefined,
    });

    setIsModalOpen(false);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Farm Personalization & Calibration Dossier */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
        style={{
          background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(230, 175, 46, 0.04))",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="md:col-span-2 space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
              Farm-Specific Calibration Engine
            </h3>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold"
              style={{
                background: "rgba(0, 255, 157, 0.15)",
                borderColor: "rgba(0, 255, 157, 0.3)",
                color: theme === "dark" ? "#00FF9D" : "#00875A",
              }}
            >
              Active ({calibrationFactor.toFixed(2)}x)
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Logging actual harvest picks automatically recalibrates the Hybrid Ensemble to your estate&apos;s specific soil micro-climate and management practices.
          </p>
        </div>

        <div className="flex md:justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold smooth-transition shadow-md cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,157,0.25), rgba(0,229,255,0.25))",
              border: "1px solid rgba(0,255,157,0.4)",
              color: "var(--text-primary)",
            }}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{t.yield.logHarvestBtn}</span>
          </button>
        </div>
      </div>

      {/* Harvest History Table */}
      <div
        className="rounded-2xl border backdrop-blur-xl shadow-md overflow-hidden"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
              Harvest Log History ({logs.length} Recorded Picks)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted">
            {estate} • {treesCount} palms
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Scale className="w-8 h-8 text-amber-500/60 mx-auto" />
            <p className="text-xs font-mono text-muted">
              No harvest records logged yet. Log at least 2 picks to enable automated AI calibration.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--card-border)", background: "rgba(0,0,0,0.03)" }}>
                  <th className="p-3.5 font-medium text-muted">Harvest Date</th>
                  <th className="p-3.5 font-medium text-muted">Actual Harvested</th>
                  <th className="p-3.5 font-medium text-muted">Model Predicted</th>
                  <th className="p-3.5 font-medium text-muted">Variance</th>
                  <th className="p-3.5 font-medium text-muted">Notes</th>
                  <th className="p-3.5 font-medium text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                {logs.map((log) => {
                  const variance = log.predicted_yield_nuts > 0
                    ? ((log.actual_yield_nuts - log.predicted_yield_nuts) / log.predicted_yield_nuts) * 100
                    : 0;

                  return (
                    <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-bold" style={{ color: "var(--text-primary)" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-muted" />
                          <span>{log.date}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        {log.actual_yield_nuts.toLocaleString()} nuts
                      </td>
                      <td className="p-3.5 text-cyan-400">
                        {log.predicted_yield_nuts.toLocaleString()} nuts
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            variance >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {variance >= 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted max-w-xs truncate">
                        {log.notes || "Standard 45-day cycle pick"}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="p-1.5 rounded-lg border text-red-400 hover:opacity-80 transition-opacity"
                          style={{ borderColor: "rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.1)" }}
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4"
              style={{
                background: theme === "dark" ? "rgba(10, 20, 14, 0.96)" : "rgba(255, 255, 255, 0.98)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
                <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  Log Actual Harvest Record
                </h3>
                <span className="text-[10px] font-mono text-muted">{estate}</span>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono block mb-1 text-muted">Harvest Pick Date</label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs font-mono"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono block mb-1 text-emerald-400 font-bold">
                    Actual Harvested Yield (Nuts)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={actualNuts}
                    onChange={(e) => setActualNuts(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border text-xs font-mono"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono block mb-1 text-cyan-400 font-bold">
                    Model Predicted Yield (Nuts)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={predictedNuts}
                    onChange={(e) => setPredictedNuts(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border text-xs font-mono"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono block mb-1 text-muted">Observations / Weather Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Good rainfall in previous month, minimal pest damage..."
                    className="w-full p-2.5 rounded-xl border text-xs font-mono resize-none"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl border text-xs font-mono"
                    style={{ borderColor: "var(--card-border)", color: "var(--text-muted)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl text-xs font-mono font-bold"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,255,157,0.3), rgba(0,229,255,0.3))",
                      border: "1px solid rgba(0,255,157,0.5)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Save & Calibrate
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
