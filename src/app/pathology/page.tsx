"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { UploadCloud, Microscope, Loader2, Plane, Smartphone, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";

interface Hotspot {
  id: string;
  location: { lat: number; lng: number };
  severity: "critical" | "high" | "moderate";
  mean_index_value: number;
  radius_meters: number;
  recommended_action: string;
  status: "pending" | "inspected" | "resolved";
}

const MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: "HS-001", location: { lat: 7.2914, lng: 80.6342 },
    severity: "critical", mean_index_value: 0.28, radius_meters: 6.4,
    recommended_action: "Immediate on-site mobile leaf scan required for Bud Rot necrosis.",
    status: "pending",
  },
  {
    id: "HS-002", location: { lat: 7.2928, lng: 80.6325 },
    severity: "high", mean_index_value: 0.42, radius_meters: 4.8,
    recommended_action: "Crown chlorosis detected. Inspect for Potassium deficiency.",
    status: "pending",
  },
  {
    id: "HS-003", location: { lat: 7.2895, lng: 80.6358 },
    severity: "moderate", mean_index_value: 0.45, radius_meters: 3.5,
    recommended_action: "Slight canopy thinning. Monitor during next irrigation cycle.",
    status: "inspected",
  },
];

const sevColors: Record<string, string> = { critical: "#FF4C4C", high: "#FF8C00", moderate: "#E6AF2E" };
const statusColors: Record<string, string> = { pending: "#FF4C4C", inspected: "#E6AF2E", resolved: "#00FF9D" };

export default function PathologyPage() {
  const [tab, setTab] = useState<"aerial" | "mobile">("aerial");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const hotspots = MOCK_HOTSPOTS;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const runAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setResult({
        disease: "Gray Leaf Spot (Pestalotiopsis palmarum)",
        confidence: 0.94,
        severity: "Moderate",
        chemical: "Spray 1% Bordeaux mixture or Copper Oxychloride (3g/L) on affected leaves.",
        cultural: "Prune and burn severely affected leaves. Improve canopy airflow.",
        preventive: "Apply balanced potassium fertilizer to boost palm resistance."
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen relative">
      <Navbar />
      
      {/* Background Grid */}
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(255, 76, 76, 0.1)" }}>
                <Microscope className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Pathology Diagnostics Lab</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-red-400/50">
                  Multiscale Computer Vision Ecosystem
                </p>
              </div>
            </div>
          </div>

          {/* Tab Switch */}
          <div className="flex gap-1 p-1 rounded-full w-fit bg-white/5 border border-white/10">
            {[
              { id: "aerial" as const, label: "System A (UAV)", icon: <Plane className="w-3.5 h-3.5" /> },
              { id: "mobile" as const, label: "System B (Mobile)", icon: <Smartphone className="w-3.5 h-3.5" /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs smooth-transition"
                style={{
                  background: tab === t.id ? "rgba(255, 76, 76, 0.15)" : "transparent",
                  color: tab === t.id ? "#FF6B6B" : "rgba(255,255,255,0.4)",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "aerial" ? (
            <motion.div key="aerial" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Heatmap Placeholder */}
                <div className="md:col-span-2 glass-card p-1 overflow-hidden relative" style={{ minHeight: "400px" }}>
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center border border-white/5 rounded-xl m-1">
                    <Plane className="w-12 h-12 text-red-400/20 mb-4" />
                    <p className="text-sm font-mono text-white/40 mb-2">UAV Orthomosaic Rendering Engine</p>
                    <p className="text-xs text-white/20">Waiting for drone flight telemetry sync...</p>
                  </div>
                  
                  {/* Overlay Mock Scanline */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      className="w-full h-[2px]"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,76,76,0.5), transparent)", boxShadow: "0 0 10px rgba(255,76,76,0.5)" }}
                      animate={{ y: [0, 400, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Hotspots List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-white/60 mb-2 px-1 flex justify-between items-center">
                    <span>Canopy Hotspots (NDVI)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">Live</span>
                  </h3>
                  
                  {hotspots.map((hs, i) => (
                    <motion.div key={hs.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                      className="glass-panel p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5" style={{ color: sevColors[hs.severity] }} />
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono"
                            style={{ background: `${sevColors[hs.severity]}15`, color: sevColors[hs.severity] }}
                          >
                            {hs.severity}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono flex items-center gap-1.5"
                          style={{ color: statusColors[hs.status] }}
                        >
                          {hs.status === "resolved" ? <CheckCircle2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </span>
                      </div>
                      <p className="text-xs mb-2 leading-relaxed text-white/60">
                        {hs.recommended_action}
                      </p>
                      <div className="flex justify-between text-[9px] font-mono text-white/30">
                        <span>NDVI: {hs.mean_index_value.toFixed(2)}</span>
                        <span>{hs.location.lat.toFixed(4)}, {hs.location.lng.toFixed(4)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div key="mobile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left: Upload Zone */}
              <div className="glass-card p-6 flex flex-col h-[500px]">
                <h2 className="text-sm font-mono text-white/60 mb-4">Leaf Level CNN Inference</h2>
                
                <label className="flex-1 border-2 border-dashed border-red-500/20 hover:border-red-500/40 rounded-xl bg-black/20 flex flex-col items-center justify-center cursor-pointer smooth-transition group relative overflow-hidden">
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  
                  {file ? (
                    <div className="absolute inset-0 p-2">
                      <img src={URL.createObjectURL(file)} alt="Upload preview" className="w-full h-full object-cover rounded-lg opacity-80" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 text-red-400 animate-spin mb-4" />
                          <p className="text-xs font-mono text-red-400/80">Running MobileNetV2-INT8...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
                        <UploadCloud className="w-8 h-8 text-red-400/80" />
                      </div>
                      <p className="text-sm text-white/60 mb-2">Drag & drop lesion image</p>
                      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Supports JPG, PNG (Max 10MB)</p>
                    </>
                  )}
                </label>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={runAnalysis}
                    disabled={!file || isAnalyzing}
                    className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs uppercase tracking-widest font-mono disabled:opacity-50 disabled:cursor-not-allowed smooth-transition"
                    style={{ boxShadow: file && !isAnalyzing ? "0 0 20px rgba(239, 68, 68, 0.3)" : "none" }}
                  >
                    {isAnalyzing ? "Processing..." : "Run Inference"}
                  </button>
                </div>
              </div>

              {/* Right: Diagnosis Results */}
              <div className="glass-card p-6 h-[500px] flex flex-col">
                <h2 className="text-sm font-mono text-white/60 mb-6">Diagnostic Dossier</h2>
                
                {result ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-red-400/70 font-mono mb-1">Detected Pathology</p>
                      <h3 className="text-xl text-white font-light">{result.disease}</h3>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                          <span className="text-[10px] text-white/60 font-mono">CONFIDENCE</span>
                          <span className="text-xs font-mono text-red-400">{(result.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
                          SEVERITY: {result.severity.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      <div>
                        <h4 className="text-xs font-mono text-white/40 mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Chemical Treatment
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{result.chemical}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-mono text-white/40 mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Cultural Action
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{result.cultural}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-mono text-white/40 mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Preventive Measure
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{result.preventive}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                    <Microscope className="w-12 h-12 mb-4" />
                    <p className="text-sm font-mono max-w-[200px]">Upload an image and run inference to see results.</p>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
