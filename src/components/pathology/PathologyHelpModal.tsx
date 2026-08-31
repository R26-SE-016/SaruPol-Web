"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Plane, Smartphone, Cpu, Layers, Activity, CheckCircle2, 
  AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Zap, Microscope, Eye
} from "lucide-react";

interface PathologyHelpModalProps {
  system: "A" | "B" | null;
  onClose: () => void;
}

export default function PathologyHelpModal({ system, onClose }: PathologyHelpModalProps) {
  if (!system) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl font-mono"
          style={{
            background: "rgba(11, 17, 30, 0.98)",
            borderColor: system === "A" ? "rgba(0, 229, 255, 0.35)" : "rgba(255, 76, 76, 0.35)",
            boxShadow: system === "A" 
              ? "0 25px 50px -12px rgba(0, 229, 255, 0.15)" 
              : "0 25px 50px -12px rgba(255, 76, 76, 0.15)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl border transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)", color: "#94A3B8" }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* ═════════════════════════════════════════════════════════════════
              SYSTEM A: UAV DRONE ORTHOMOSAIC SURVEILLANCE GUIDE
             ═════════════════════════════════════════════════════════════════ */}
          {system === "A" && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/30">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    System A: UAV Aerial Surveillance & Spectral Segmentation
                  </h2>
                  <p className="text-xs text-cyan-400 font-semibold">
                    How it works & Output Results Interpretation
                  </p>
                </div>
              </div>

              {/* 4-Step Process Pipeline */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> 1. End-to-End UAV Processing Pipeline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">1</span>
                      <strong className="text-white">Orthomosaic Input</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Drone captures high-res aerial imagery at 50–80m altitude with 75% overlap. A GeoTIFF/RGB orthomosaic is stitched representing the entire plantation block.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">2</span>
                      <strong className="text-white">Spectral Index Transformation</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      The Python backend computes <strong>VARI</strong> (<code className="text-cyan-300">(G-R)/(G+R-B)</code>) for standard RGB, or <strong>NDVI</strong> (<code className="text-cyan-300">(NIR-R)/(NIR+R)</code>) for companion multispectral NIR, isolating chlorophyll absorption.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">3</span>
                      <strong className="text-white">Canopy Segmentation & Peak Detection</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Otsu adaptive thresholding segments active foliage from background soil. Connected component centroid analysis locates discrete palm crown apexes.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">4</span>
                      <strong className="text-white">Crown Anomaly & Threat Scoring</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Each segmented palm crown is evaluated for vegetative purity. Palms exhibiting severe chlorosis, defoliation, or spectral index collapse are flagged as anomalies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Output Results Explained */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> 2. Understanding Your Output Metrics
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-cyan-400 font-bold min-w-[130px]">Detected Palms</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Total count of isolated discrete coconut palm crowns identified by crown peak local maxima. Matches empirical tree stand counts.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold min-w-[130px]">Canopy Purity (%)</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      The percentage of segmented foliage exhibiting optimal healthy spectral absorption. Values above <strong>80%</strong> indicate strong vegetative health.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-cyan-300 font-bold min-w-[130px]">Mean Index</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Average vegetative index value across the surveyed estate canopy. (Typical VARI: <strong>0.05 to 0.25</strong>; Typical NDVI: <strong>0.40 to 0.85</strong>).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-red-400 font-bold min-w-[130px]">Flagged Anomalies</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Specific palm coordinates exhibiting acute chlorosis, frond dieback, or fungal thinning requiring ground-level System B leaf inspection.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              SYSTEM B: MOBILE LEAF ON-DEVICE EDGE AI DIAGNOSTICS GUIDE
             ═════════════════════════════════════════════════════════════════ */}
          {system === "B" && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-500/15 border border-red-500/30">
                  <Smartphone className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    System B: On-Device Edge AI Mobile Leaf Pathology
                  </h2>
                  <p className="text-xs text-red-400 font-semibold">
                    How it works & Output Results Interpretation
                  </p>
                </div>
              </div>

              {/* 4-Step Process Pipeline */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-red-400" /> 1. Edge AI On-Device Inference Pipeline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">1</span>
                      <strong className="text-white">Macro Foliar Capture</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Planter or field officer takes a close-up photograph of a diseased coconut leaflet, frond midrib, or stem bleeding lesion using a mobile camera.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">2</span>
                      <strong className="text-white">INT8 MobileNetV2 Execution</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      The image is processed locally on-device via TensorFlow Lite WebAssembly with XNNPACK CPU acceleration. Works <strong>100% offline</strong> in remote plantations without mobile reception.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">3</span>
                      <strong className="text-white">Pathogen Classification</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Extracts micro-textural lesion characteristics and outputs softmax confidence probabilities across 5 classes (Bud Rot, Leaf Blight, Stem Bleeding, Weligama Leaf Wilt, Healthy).
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">4</span>
                      <strong className="text-white">CRI Advisory Protocols</strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Automatically maps the diagnosis to official Coconut Research Institute (CRI) treatment protocols (fungicidal dosages, quarantine, sanitization).
                    </p>
                  </div>
                </div>
              </div>

              {/* Output Results Explained */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Microscope className="w-3.5 h-3.5 text-red-400" /> 2. Understanding Your Diagnostic Outputs
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-red-400 font-bold min-w-[130px]">Pathogen Class</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Identified biological pathogen (e.g. <em>Phytophthora palmivora</em> for Bud Rot, <em>Lasiodiplodia theobromae</em> for Leaf Blight, or Phytoplasma for Weligama Wilt).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-purple-400 font-bold min-w-[130px]">Confidence (%)</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Statistical certainty rating of the neural network. Scores above <strong>85%</strong> represent high diagnostic reliability.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-amber-400 font-bold min-w-[130px]">Biosecurity Risk</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Contagion threat level (e.g. <strong>CRITICAL</strong> for Bud Rot requiring emergency tree removal; <strong>MONITORED</strong> for mild fungal leaf spots).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold min-w-[130px]">Treatment Guide</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Prescribed chemical intervention (e.g. 1% Bordeaux mixture, Copper Oxychloride) and mechanical sanitation steps under CRI guidance.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer Dismiss Button */}
          <div className="pt-4 border-t flex justify-end" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105"
              style={{
                background: system === "A" ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 76, 76, 0.2)",
                color: system === "A" ? "#00E5FF" : "#FF4C4C",
                border: system === "A" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid rgba(255, 76, 76, 0.4)",
              }}
            >
              Got it, Return to Scanner →
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
