"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sun, Calendar, Settings2, Check, X, Compass } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface AgroContextPanelProps {
  zone: string;
  season: string;
  isAutoGps: boolean;
  onZoneChange: (zone: string) => void;
  onSeasonChange: (season: string) => void;
  onToggleAutoGps: (auto: boolean) => void;
}

const ESTATES = [
  { name: "Makandura Experimental Estate", zone: "Intermediate Zone", lat: 7.3215, lon: 79.9824 },
  { name: "Lunuwila CRI Headquarters", zone: "Wet Zone", lat: 7.3392, lon: 79.8887 },
  { name: "Puttalam Seed Garden", zone: "Dry Zone", lat: 8.0362, lon: 79.8283 },
  { name: "Kurunegala Commercial Block", zone: "Intermediate Zone", lat: 7.4863, lon: 80.3623 },
  { name: "Ratnapura High-Rainfall Estate", zone: "Wet Zone", lat: 6.6828, lon: 80.4036 },
  { name: "Batticaloa Coastal Plantation", zone: "Dry Zone", lat: 7.7170, lon: 81.7000 },
];

export default function AgroContextPanel({
  zone,
  season,
  isAutoGps,
  onZoneChange,
  onSeasonChange,
  onToggleAutoGps,
}: AgroContextPanelProps) {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Concise localized labels for the top pill
  const getShortZone = (z: string) => {
    if (z.includes("Wet")) return language === "si" ? "තෙත් කලාපය" : language === "ta" ? "ஈர மண்டலம்" : "Wet Zone";
    if (z.includes("Intermediate")) return language === "si" ? "අතරමැදි කලාපය" : language === "ta" ? "இடைநிலை மண்டலம்" : "Intermediate Zone";
    if (z.includes("Dry")) return language === "si" ? "වියළි කලාපය" : language === "ta" ? "உலர் மண்டலம்" : "Dry Zone";
    return z;
  };

  const getShortSeason = (s: string) => {
    if (s.includes("Yala")) return language === "si" ? "යල කන්නය" : language === "ta" ? "யால பருவம்" : "Yala Season";
    if (s.includes("Maha")) return language === "si" ? "මහ කන්නය" : language === "ta" ? "மகா பருவம்" : "Maha Season";
    return s;
  };

  return (
    <>
      {/* Top Context Pill Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono smooth-transition hover:opacity-90 shadow-sm whitespace-nowrap flex-shrink-0"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          color: "var(--text-primary)",
        }}
      >
        <div className="flex items-center gap-1.5 font-bold" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>
          <Compass className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{getShortZone(zone)}</span>
        </div>
        <span className="opacity-40" style={{ color: "var(--text-muted)" }}>•</span>
        <div className="flex items-center gap-1.5 font-medium" style={{ color: theme === "dark" ? "#E6AF2E" : "#B45309" }}>
          <Sun className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{getShortSeason(season)}</span>
        </div>
        <Settings2 className="w-3.5 h-3.5 ml-0.5 opacity-60 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full glass-card p-6 rounded-3xl border shadow-2xl space-y-5"
              style={{
                borderColor: "var(--card-border)",
                background: theme === "dark" ? "rgba(10, 20, 14, 0.95)" : "rgba(255, 255, 255, 0.98)",
              }}
            >
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl" style={{ background: "rgba(0, 255, 157, 0.15)", color: "#00FF9D" }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                      {t.advisory.manualContext}
                    </h3>
                    <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                      Agro-climatic calibration for CRI dosage calculations
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Auto GPS vs Manual toggle */}
              <div className="flex gap-2 p-1 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <button
                  onClick={() => onToggleAutoGps(true)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all"
                  style={{
                    background: isAutoGps ? "rgba(0, 255, 157, 0.15)" : "transparent",
                    color: isAutoGps ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-muted)",
                    fontWeight: isAutoGps ? "700" : "400",
                  }}
                >
                  {t.advisory.autoGps}
                </button>
                <button
                  onClick={() => onToggleAutoGps(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all"
                  style={{
                    background: !isAutoGps ? "rgba(230, 175, 46, 0.15)" : "transparent",
                    color: !isAutoGps ? (theme === "dark" ? "#E6AF2E" : "#B45309") : "var(--text-muted)",
                    fontWeight: !isAutoGps ? "700" : "400",
                  }}
                >
                  Manual Preset Override
                </button>
              </div>

              {/* Quick Estate Selector */}
              <div>
                <label className="text-[11px] font-mono uppercase font-bold block mb-2" style={{ color: "var(--text-muted)" }}>
                  Empirical Research Estates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ESTATES.map((est) => {
                    const isSelected = zone === est.zone;
                    return (
                      <button
                        key={est.name}
                        onClick={() => {
                          onZoneChange(est.zone);
                          onToggleAutoGps(false);
                        }}
                        className="text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between"
                        style={{
                          background: isSelected ? "rgba(0, 255, 157, 0.1)" : "var(--card-bg)",
                          borderColor: isSelected ? "rgba(0, 255, 157, 0.4)" : "var(--card-border)",
                          color: isSelected ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
                        }}
                      >
                        <div>
                          <p className="font-medium">{est.name.split(" ")[0]}</p>
                          <span className="text-[10px] opacity-70">{est.zone}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropdown Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold block mb-1" style={{ color: "var(--text-muted)" }}>
                    {t.advisory.zoneLabel}
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => {
                      onZoneChange(e.target.value);
                      onToggleAutoGps(false);
                    }}
                    className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                    style={{
                      background: "var(--input-bg)",
                      borderColor: "var(--input-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="Wet Zone">Wet Zone (South-West)</option>
                    <option value="Intermediate Zone">Intermediate Zone (Coconut Triangle)</option>
                    <option value="Dry Zone">Dry Zone (North & East)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase font-bold block mb-1" style={{ color: "var(--text-muted)" }}>
                    {t.advisory.seasonLabel}
                  </label>
                  <select
                    value={season}
                    onChange={(e) => onSeasonChange(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                    style={{
                      background: "var(--input-bg)",
                      borderColor: "var(--input-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="Yala">Yala Season (May–Sep)</option>
                    <option value="Maha">Maha Season (Oct–Apr)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: "linear-gradient(135deg, #00FF9D, #00B0FF)",
                    color: "#030705",
                  }}
                >
                  Apply Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
