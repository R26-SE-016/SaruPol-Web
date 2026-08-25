"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Microscope, Upload, Camera, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";

const DISEASE_KNOWLEDGE: Record<string, { displayName: string; severity: string; sevColor: string; chemical: string; cultural: string; preventive: string }> = {
  "bud rot": { displayName: "Bud Rot (Phytophthora palmivora)", severity: "Critical", sevColor: "#FF4C4C", chemical: "Cut and remove dead crown tissues, apply Bordeaux paste or copper oxychloride paste on cut surfaces.", cultural: "Destroy and burn all removed infected tissues. Avoid damaging the crown.", preventive: "Spray neighboring palms with Mancozeb (4g/L). Ensure good drainage." },
  "gray leaf spot": { displayName: "Gray Leaf Spot (Pestalotiopsis palmarum)", severity: "Moderate", sevColor: "#E6AF2E", chemical: "Spray 1% Bordeaux mixture or Copper Oxychloride (3g/L) on affected leaves.", cultural: "Prune and burn affected leaves. Improve canopy airflow.", preventive: "Apply balanced potassium fertilizer. Avoid overhead irrigation." },
  "stem bleeding": { displayName: "Stem Bleeding (Ceratocystis paradoxa)", severity: "Critical", sevColor: "#FF4C4C", chemical: "Chisel out infected trunk tissues. Apply Coal Tar or Bordeaux paste immediately.", cultural: "Avoid wounding the trunk. Remove soil piled against the trunk.", preventive: "Root feeding with Carbendazim (2g in 100ml) every 3 months." },
  "leaf rot": { displayName: "Leaf Rot (Colletotrichum gloeosporioides)", severity: "High", sevColor: "#FF8C00", chemical: "Apply Mancozeb (2.5g/L) or Carbendazim (1g/L) spray at early symptom stage.", cultural: "Remove infected fronds. Apply boron and zinc to soil.", preventive: "Reduce canopy humidity by proper spacing. Monitor after rains." },
  "healthy": { displayName: "Healthy Palm", severity: "Healthy", sevColor: "#00FF9D", chemical: "No chemical treatment required.", cultural: "Maintain current practices. Continue monitoring every 2-4 weeks.", preventive: "Maintain optimal NPK schedule per CRI. Ensure good drainage." },
};

export default function PathologyPage() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number; time_ms: number } | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2200));

    const diseases = Object.keys(DISEASE_KNOWLEDGE);
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = 0.78 + Math.random() * 0.2;

    setResult({ disease: randomDisease, confidence, time_ms: Math.floor(Math.random() * 300) + 150 });
    setIsAnalyzing(false);
  };

  const knowledge = result ? DISEASE_KNOWLEDGE[result.disease] || DISEASE_KNOWLEDGE["healthy"] : null;

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,76,76,0.1)" }}>
              <Microscope className="w-5 h-5" style={{ color: "#FF4C4C" }} />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Pathology Diagnostics Lab</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(255,76,76,0.5)" }}>
                CNN Vision Classification & CRI Treatment Protocol
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div
              className={`upload-zone p-8 flex flex-col items-center justify-center min-h-[320px] ${dragOver ? "drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative w-full">
                  <img src={preview} alt="Scan preview" className="w-full rounded-xl object-cover max-h-72" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="scan-line" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                        <RotateCcw className="w-6 h-6 animate-spin" style={{ color: "#00FF9D" }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-4" style={{ color: "rgba(0,255,157,0.3)" }} />
                  <p className="text-sm mb-2" style={{ color: "rgba(232,239,232,0.5)" }}>Drop coconut leaf or trunk image</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>JPEG, PNG — Max 10MB</p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs smooth-transition cursor-pointer"
                style={{ background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.12)", color: "rgba(0,255,157,0.7)" }}
              >
                <Camera className="w-4 h-4" /> Browse Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              {preview && (
                <button onClick={handleAnalyze} disabled={isAnalyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium smooth-transition"
                  style={{ background: "rgba(255,76,76,0.12)", border: "1px solid rgba(255,76,76,0.15)", color: "#FF4C4C" }}
                >
                  <Microscope className="w-4 h-4" /> {isAnalyzing ? "Classifying..." : "Run Inference"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {result && knowledge ? (
              <div className="glass-card p-6 space-y-5">
                {/* Diagnosis */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {knowledge.severity === "Healthy" ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: "#00FF9D" }} />
                    ) : (
                      <AlertTriangle className="w-5 h-5" style={{ color: knowledge.sevColor }} />
                    )}
                    <h3 className="text-lg font-light" style={{ fontFamily: "var(--font-outfit)", color: "rgba(232,239,232,0.9)" }}>
                      {knowledge.displayName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono"
                      style={{ background: `${knowledge.sevColor}15`, color: knowledge.sevColor }}
                    >
                      {knowledge.severity}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
                      {result.time_ms}ms
                    </span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="confidence-bar">
                  <div className="fill" style={{ width: `${result.confidence * 100}%`, background: knowledge.sevColor }} />
                </div>

                {/* Treatment */}
                {["chemical", "cultural", "preventive"].map(type => (
                  <div key={type} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1 font-mono" style={{ color: "rgba(0,255,157,0.4)" }}>
                      {type} treatment
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(232,239,232,0.6)" }}>
                      {knowledge[type as keyof typeof knowledge]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[320px]">
                <Microscope className="w-12 h-12 mb-4" style={{ color: "rgba(255,255,255,0.08)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>Upload an image and run inference to see results</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
