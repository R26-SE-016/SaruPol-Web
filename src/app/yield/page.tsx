"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { BarChart3, TrendingUp, Thermometer, Droplets, TreePine, Heart, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Params {
  temperature: number;
  humidity: number;
  soil_moisture: number;
  palm_age: number;
  palm_health: number;
}

export default function YieldPage() {
  const { t } = useTranslation();
  const [params, setParams] = useState<Params>({
    temperature: 28, humidity: 78, soil_moisture: 32, palm_age: 12, palm_health: 4.5,
  });
  const [result, setResult] = useState<{
    rf: number; lstm: number; hybrid: number; confidence: string; status: string;
    recommendations: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1800));

    const { temperature, humidity, soil_moisture, palm_age, palm_health } = params;

    // Mock RF + LSTM + Hybrid prediction
    const baseline = 7.5;
    const factor = (soil_moisture / 45) * 1.2 + (temperature / 28) * 0.9 + (palm_health / 5) * 1.5 + (palm_age > 5 && palm_age < 30 ? 1.2 : 0.8);
    const rf = Math.round((baseline * factor * 1.03) * 10) / 10;
    const lstm = Math.round((baseline * factor * 0.95) * 10) / 10;
    const hybrid = Math.round((0.6 * rf + 0.4 * lstm) * 10) / 10;

    const diff = Math.abs(rf - lstm) / hybrid;
    const confidence = diff < 0.1 ? "High (±4%)" : diff < 0.2 ? "Moderate (±8%)" : "Low (±15%)";
    const status = hybrid > 10 ? "Excellent Yield" : hybrid > 6 ? "Good Yield" : "Below Average";

    const recommendations: string[] = [];
    if (soil_moisture < 25) recommendations.push("Apply organic mulching around root zone to improve moisture retention");
    if (palm_health < 3) recommendations.push("Apply CRI recommended booster nitrogen + potassium fertilizer doses");
    if (humidity > 85) recommendations.push("Monitor for fungal pathogens and leaf rot under sustained high humidity");
    if (recommendations.length === 0) recommendations.push("All environmental parameters are optimal. Maintain current irrigation schedule.");

    setResult({ rf, lstm, hybrid, confidence, status, recommendations });
    setIsLoading(false);
  };

  const update = (key: keyof Params, val: number) => setParams(prev => ({ ...prev, [key]: val }));

  const sliders = [
    { key: "temperature" as const, label: t.yield.temp, icon: <Thermometer className="w-4 h-4" />, min: 20, max: 40, step: 0.5, unit: "°C", color: "#FF4C4C" },
    { key: "humidity" as const, label: t.yield.humidity, icon: <Droplets className="w-4 h-4" />, min: 30, max: 100, step: 1, unit: "%", color: "#00E5FF" },
    { key: "soil_moisture" as const, label: t.yield.soilMoisture, icon: <Droplets className="w-4 h-4" />, min: 5, max: 60, step: 0.5, unit: "%", color: "#00FF9D" },
    { key: "palm_age" as const, label: t.yield.palmAge, icon: <TreePine className="w-4 h-4" />, min: 1, max: 60, step: 1, unit: "yrs", color: "#E6AF2E" },
    { key: "palm_health" as const, label: t.yield.palmHealth, icon: <Heart className="w-4 h-4" />, min: 1, max: 5, step: 0.5, unit: "/5", color: "#A78BFA" },
  ];

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(0,229,255,0.1)" }}>
              <BarChart3 className="w-5 h-5" style={{ color: "#00E5FF" }} />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>{t.yield.title}</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(0,229,255,0.4)" }}>
                {t.yield.subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(232,239,232,0.6)" }}>
            {t.yield.description}
          </p>
        </motion.div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {sliders.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-xs uppercase tracking-wider font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                </div>
                <span className="text-sm font-mono font-medium" style={{ color: s.color }}>
                  {params[s.key]} {s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) => update(s.key, parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, ${s.color} ${(params[s.key] - s.min) / (s.max - s.min) * 100}%, var(--card-border) 0%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Predict Button */}
        <div className="mb-10">
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-mono font-medium smooth-transition shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,255,157,0.25))",
              color: "var(--text-primary)",
              border: "1px solid rgba(0,229,255,0.4)",
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <>
                <span>{t.yield.predictBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-mono font-light text-cyan-500">{result.hybrid}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
                  {t.yield.cycleForecast} (Nuts / Palm)
                </p>
                <span className="text-[9px] font-mono text-cyan-500">{result.status}</span>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-mono font-light text-emerald-500">{Math.round(result.hybrid * 8.1)}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
                  {t.yield.annualYield}
                </p>
                <span className="text-[9px] font-mono text-emerald-500">{t.yield.nutsPerPalm}</span>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-mono font-light text-amber-500">{result.confidence}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
                  {t.yield.ensembleConfidence}
                </p>
                <span className="text-[9px] font-mono text-amber-500">RF: {result.rf} · LSTM: {result.lstm}</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                {t.yield.directivesTitle}
              </h2>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs font-mono flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
