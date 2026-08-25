"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { BarChart3, TrendingUp, Thermometer, Droplets, TreePine, Heart, RotateCcw } from "lucide-react";

interface Params {
  temperature: number;
  humidity: number;
  soil_moisture: number;
  palm_age: number;
  palm_health: number;
}

export default function YieldPage() {
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
    await new Promise(r => setTimeout(r, 2000));

    const { temperature, humidity, soil_moisture, palm_age, palm_health } = params;

    // Mock RF + LSTM + Hybrid prediction
    const baseline = 7.5;
    const factor = (soil_moisture / 45) * 1.2 + (temperature / 28) * 0.9 + (palm_health / 5) * 1.5 + (palm_age > 5 && palm_age < 30 ? 1.2 : 0.8);
    const rf = Math.round((baseline * factor * 1.03) * 10) / 10;
    const lstm = Math.round((baseline * factor * 0.95) * 10) / 10;
    const hybrid = Math.round((0.6 * rf + 0.4 * lstm) * 10) / 10;

    const diff = Math.abs(rf - lstm) / hybrid;
    const confidence = diff < 0.1 ? "High" : diff < 0.2 ? "Moderate" : "Low";
    const status = hybrid > 10 ? "Excellent Yield" : hybrid > 6 ? "Good Yield" : "Below Average";

    const recommendations: string[] = [];
    if (soil_moisture < 25) recommendations.push("Apply organic mulching to improve moisture retention");
    if (palm_health < 3) recommendations.push("Apply recommended booster nitrogen doses");
    if (humidity > 85) recommendations.push("Monitor for fungal infections in high humidity");
    if (recommendations.length === 0) recommendations.push("All parameters are optimal. Maintain current practices.");

    setResult({ rf, lstm, hybrid, confidence, status, recommendations });
    setIsLoading(false);
  };

  const update = (key: keyof Params, val: number) => setParams(prev => ({ ...prev, [key]: val }));

  const sliders = [
    { key: "temperature" as const, label: "Temperature", icon: <Thermometer className="w-4 h-4" />, min: 20, max: 40, step: 0.5, unit: "°C", color: "#FF4C4C" },
    { key: "humidity" as const, label: "Humidity", icon: <Droplets className="w-4 h-4" />, min: 30, max: 100, step: 1, unit: "%", color: "#00E5FF" },
    { key: "soil_moisture" as const, label: "Soil Moisture", icon: <Droplets className="w-4 h-4" />, min: 5, max: 60, step: 0.5, unit: "%", color: "#00FF9D" },
    { key: "palm_age" as const, label: "Palm Age", icon: <TreePine className="w-4 h-4" />, min: 1, max: 60, step: 1, unit: "yrs", color: "#E6AF2E" },
    { key: "palm_health" as const, label: "Palm Health", icon: <Heart className="w-4 h-4" />, min: 1, max: 5, step: 0.5, unit: "/5", color: "#A78BFA" },
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
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>CocoCastAI</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(0,229,255,0.5)" }}>
                Hybrid RF + LSTM 45-Day Yield Prediction
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parameter Sliders */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-6 space-y-5">
              <h3 className="text-sm font-medium mb-4" style={{ color: "rgba(232,239,232,0.7)" }}>Input Parameters</h3>
              {sliders.map(s => (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: `${s.color}80` }}>{s.icon}</span>
                      <span className="text-xs" style={{ color: "rgba(232,239,232,0.5)" }}>{s.label}</span>
                    </div>
                    <span className="text-sm font-mono" style={{ color: s.color }}>
                      {params[s.key]}{s.unit}
                    </span>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} step={s.step} value={params[s.key]}
                    onChange={(e) => update(s.key, parseFloat(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${((params[s.key] - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.06) ${((params[s.key] - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.06) 100%)`,
                    }}
                  />
                </div>
              ))}

              <button onClick={handlePredict} disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium smooth-transition mt-4"
                style={{ background: "rgba(0,229,255,0.12)", border: "1px solid rgba(0,229,255,0.15)", color: "#00E5FF" }}
              >
                {isLoading ? (
                  <><RotateCcw className="w-4 h-4 animate-spin" /> Forecasting...</>
                ) : (
                  <><TrendingUp className="w-4 h-4" /> Predict 45-Day Yield</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {result ? (
              <div className="space-y-5">
                {/* Model Comparison */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium mb-4" style={{ color: "rgba(232,239,232,0.7)" }}>Model Predictions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Random Forest", val: result.rf, r2: "R²=0.9845", color: "#00FF9D" },
                      { label: "LSTM", val: result.lstm, r2: "R²=0.8629", color: "#00E5FF" },
                      { label: "Hybrid (Production)", val: result.hybrid, r2: "0.6×RF + 0.4×LSTM", color: "#E6AF2E" },
                    ].map(m => (
                      <div key={m.label} className="text-center p-4 rounded-xl" style={{ background: `${m.color}08`, border: `1px solid ${m.color}12` }}>
                        <p className="text-2xl font-mono font-light" style={{ color: m.color }}>{m.val}</p>
                        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>nuts/palm</p>
                        <p className="text-[9px] font-mono mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>{m.r2}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs" style={{ color: "rgba(232,239,232,0.5)" }}>Yield Status</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,157,0.08)", color: "#00FF9D" }}>
                      {result.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs" style={{ color: "rgba(232,239,232,0.5)" }}>Confidence Level</span>
                    <span className="text-xs font-mono" style={{ color: result.confidence === "High" ? "#00FF9D" : result.confidence === "Moderate" ? "#E6AF2E" : "#FF4C4C" }}>
                      {result.confidence}
                    </span>
                  </div>

                  <h4 className="text-[10px] uppercase tracking-wider mb-2 font-mono" style={{ color: "rgba(0,229,255,0.4)" }}>Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "rgba(232,239,232,0.5)" }}>
                        <span style={{ color: "rgba(0,255,157,0.4)" }}>•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[420px]">
                <BarChart3 className="w-12 h-12 mb-4" style={{ color: "rgba(255,255,255,0.08)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>Adjust parameters and run prediction</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
