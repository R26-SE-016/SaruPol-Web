"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { FlaskConical, Beaker, Droplets, Leaf, ArrowRight, RotateCcw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface NPKPoint {
  N: string; P: string; K: string; pH: string;
}

const defaultPoint = (): NPKPoint => ({ N: "0.016", P: "0.340", K: "0.063", pH: "6.4" });

export default function SoilPage() {
  const { t } = useTranslation();
  const [treeNo, setTreeNo] = useState("104");
  const [zoneId, setZoneId] = useState("Block A");
  const [pointA, setPointA] = useState<NPKPoint>(defaultPoint());
  const [pointB, setPointB] = useState<NPKPoint>({ N: "0.015", P: "0.350", K: "0.060", pH: "6.5" });
  const [pointC, setPointC] = useState<NPKPoint>({ N: "0.017", P: "0.330", K: "0.065", pH: "6.3" });
  const [result, setResult] = useState<{
    leafN: number; leafP: number; leafK: number;
    urea: number; erp: number; mop: number; dolomite: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate CRI DFR analysis using mock offline calculation
    await new Promise(r => setTimeout(r, 1800));

    const avgN = ([pointA, pointB, pointC].reduce((s, p) => s + parseFloat(p.N), 0) / 3);
    const avgP = ([pointA, pointB, pointC].reduce((s, p) => s + parseFloat(p.P), 0) / 3);
    const avgK = ([pointA, pointB, pointC].reduce((s, p) => s + parseFloat(p.K), 0) / 3);

    // Soil → Leaf NPK regression approximation (CRI empirical coefficients)
    const leafN = 1.82 + avgN * 42.3;
    const leafP = 0.12 + avgP * 0.38;
    const leafK = 0.85 + avgK * 14.2;

    // CRI DFR thresholds (Advisory Circular A5)
    const urea = leafN < 1.8 ? 1500 : leafN < 2.0 ? 1000 : 800;
    const erp = leafP < 0.12 ? 1000 : 600;
    const mop = leafK < 0.8 ? 2500 : leafK < 1.2 ? 2000 : 1600;
    const dolomite = parseFloat(pointA.pH) < 5.5 ? 1500 : 1000;

    setResult({ leafN, leafP, leafK, urea, erp, mop, dolomite });
    setIsAnalyzing(false);
  };

  const updatePoint = (setter: React.Dispatch<React.SetStateAction<NPKPoint>>, key: keyof NPKPoint, val: string) => {
    setter(prev => ({ ...prev, [key]: val }));
  };

  const InputField = ({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit: string }) => (
    <div>
      <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step="0.001"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-2 py-1.5 rounded-lg text-sm font-mono outline-none"
          style={{
            border: "1px solid rgba(0,255,157,0.1)",
            color: "#e8efe8",
          }}
        />
        <span className="text-[10px] font-mono" style={{ color: "rgba(0,255,157,0.3)" }}>{unit}</span>
      </div>
    </div>
  );

  const PointCard = ({ title, point, setter, color }: { title: string; point: NPKPoint; setter: React.Dispatch<React.SetStateAction<NPKPoint>>; color: string }) => (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ background: color }} />
        <h3 className="text-sm font-medium" style={{ color: "rgba(232,239,232,0.8)" }}>{title}</h3>
        <span className="text-[9px] font-mono ml-auto" style={{ color: "rgba(255,255,255,0.15)" }}>120° Manure Circle</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Nitrogen (N)" value={point.N} onChange={(v) => updatePoint(setter, "N", v)} unit="%" />
        <InputField label="Phosphorus (P)" value={point.P} onChange={(v) => updatePoint(setter, "P", v)} unit="%" />
        <InputField label="Potassium (K)" value={point.K} onChange={(v) => updatePoint(setter, "K", v)} unit="%" />
        <InputField label="pH Level" value={point.pH} onChange={(v) => updatePoint(setter, "pH", v)} unit="" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(0,255,157,0.1)" }}>
              <FlaskConical className="w-5 h-5" style={{ color: "#00FF9D" }} />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>{t.soil.title}</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(0,255,157,0.4)" }}>
                {t.soil.subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm max-w-2xl" style={{ color: "rgba(232,239,232,0.35)" }}>
            3-point spatial triangulation around the 1.8m manure circle (120° apart) converts real-time IoT soil NPK readings to 14th Frond Leaf NPK using CRI regression models.
          </p>
        </motion.div>

        {/* Tree & Zone */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-5 mb-6 flex flex-wrap gap-6"
        >
          <div>
            <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Tree No.</label>
            <input type="number" value={treeNo} onChange={(e) => setTreeNo(e.target.value)}
              className="bg-transparent px-3 py-1.5 rounded-lg text-sm font-mono outline-none w-24"
              style={{ border: "1px solid rgba(0,255,157,0.1)", color: "#e8efe8" }}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Zone ID</label>
            <input type="text" value={zoneId} onChange={(e) => setZoneId(e.target.value)}
              className="bg-transparent px-3 py-1.5 rounded-lg text-sm font-mono outline-none w-40"
              style={{ border: "1px solid rgba(0,255,157,0.1)", color: "#e8efe8" }}
            />
          </div>
        </motion.div>

        {/* 3-Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <PointCard title="Point A (0°)" point={pointA} setter={setPointA} color="#00FF9D" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <PointCard title="Point B (120°)" point={pointB} setter={setPointB} color="#00E5FF" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <PointCard title="Point C (240°)" point={pointC} setter={setPointC} color="#E6AF2E" />
          </motion.div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-mono font-medium smooth-transition"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,157,0.2), rgba(0,229,255,0.2))",
              color: "#00FF9D",
              border: "1px solid rgba(0,255,157,0.3)",
            }}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <>
                <span>{t.soil.calculateBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Leaf NPK */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-medium mb-4" style={{ color: "rgba(232,239,232,0.8)" }}>
                {t.soil.leafEst}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-black/40 text-center">
                  <p className="text-2xl font-mono font-light text-emerald-400">{result.leafN.toFixed(2)}%</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Leaf Nitrogen (N)</p>
                  <span className="text-[9px] font-mono text-emerald-400/60">Optimum: 1.9 - 2.1%</span>
                </div>
                <div className="p-4 rounded-lg bg-black/40 text-center">
                  <p className="text-2xl font-mono font-light text-cyan-400">{result.leafP.toFixed(3)}%</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Leaf Phosphorus (P)</p>
                  <span className="text-[9px] font-mono text-cyan-400/60">Optimum: 0.12 - 0.14%</span>
                </div>
                <div className="p-4 rounded-lg bg-black/40 text-center">
                  <p className="text-2xl font-mono font-light text-amber-400">{result.leafK.toFixed(2)}%</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Leaf Potassium (K)</p>
                  <span className="text-[9px] font-mono text-amber-400/60">Optimum: 1.2 - 1.5%</span>
                </div>
              </div>
            </div>

            {/* DFR Dosage */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-medium mb-4" style={{ color: "rgba(232,239,232,0.8)" }}>
                {t.soil.dosingPlan}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{t.soil.urea}</p>
                  <p className="text-xl font-mono text-emerald-400">{result.urea} <span className="text-xs">g</span></p>
                </div>
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{t.soil.erp}</p>
                  <p className="text-xl font-mono text-cyan-400">{result.erp} <span className="text-xs">g</span></p>
                </div>
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{t.soil.mop}</p>
                  <p className="text-xl font-mono text-amber-400">{result.mop} <span className="text-xs">g</span></p>
                </div>
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{t.soil.dolomite}</p>
                  <p className="text-xl font-mono text-purple-400">{result.dolomite} <span className="text-xs">g</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
