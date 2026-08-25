"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import { 
  UploadCloud, Microscope, Loader2, Plane, Smartphone, 
  AlertTriangle, Eye, CheckCircle2, LayoutDashboard, History,
  ClipboardList, ShieldCheck, Camera, Sparkles, Map, RefreshCw
} from "lucide-react";
import StatCard from "@/components/pathology/StatCard";
import DiseaseChart from "@/components/pathology/DiseaseChart";
import DiseaseBadge from "@/components/pathology/DiseaseBadge";
import ConfidenceBar from "@/components/pathology/ConfidenceBar";
import { DEMO_DIAGNOSTICS, DISEASE_COLORS } from "@/lib/demo-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";

// Lazy load Leaflet Map
const DiagnosticMapInner = dynamic(() => import("@/components/pathology/DiagnosticMap"), { ssr: false });

type TabType = "overview" | "aerial" | "mobile" | "history";

// Dummy data for heatmaps
const MOCK_HOTSPOTS = [
  { id: "HS-001", location: { lat: 7.2914, lng: 80.6342 }, severity: "critical", mean_index_value: 0.28, z_score: -3.2, radius_meters: 6.4, recommended_action: "Immediate mobile scan for Bud Rot", status: "pending" },
  { id: "HS-002", location: { lat: 7.2928, lng: 80.6325 }, severity: "high", mean_index_value: 0.42, z_score: -2.1, radius_meters: 4.8, recommended_action: "Crown chlorosis. Potassium deficiency?", status: "pending" },
  { id: "HS-003", location: { lat: 7.2895, lng: 80.6358 }, severity: "moderate", mean_index_value: 0.45, z_score: -1.5, radius_meters: 3.5, recommended_action: "Slight thinning.", status: "inspected" },
];

export default function PathologyPage() {
  const [tab, setTab] = useState<TabType>("overview");
  
  // Mobile Tab State
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Aerial Tab State
  const [indexType, setIndexType] = useState<"VARI" | "NDVI">("VARI");
  const [uavFile, setUavFile] = useState<File | null>(null);
  const [uavPreview, setUavPreview] = useState<string | null>(null);
  const [isProcessingUav, setIsProcessingUav] = useState(false);
  const [uavResult, setUavResult] = useState<any>(null);
  const uavInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"heatmap" | "original">("heatmap");
  
  // History Tab State
  const [historyView, setHistoryView] = useState<"table" | "map">("table");
  const [filterDisease, setFilterDisease] = useState("all");

  const diseases = useMemo(() => Array.from(new Set(DEMO_DIAGNOSTICS.map(d => d.disease_class))), []);
  const filteredHistory = useMemo(() => {
    return DEMO_DIAGNOSTICS.filter(d => filterDisease === "all" || d.disease_class === filterDisease);
  }, [filterDisease]);

  const stats = useMemo(() => {
    const total = DEMO_DIAGNOSTICS.length;
    const healthy = DEMO_DIAGNOSTICS.filter(d => d.disease_class === "healthy leaves").length;
    const avgConf = total ? DEMO_DIAGNOSTICS.reduce((sum, d) => sum + d.confidence, 0) / total : 0;
    return { total, healthy, diseased: total - healthy, avgConf };
  }, []);

  const weeklyData = [
    { day: 'Mon', scans: 4 }, { day: 'Tue', scans: 7 }, { day: 'Wed', scans: 3 },
    { day: 'Thu', scans: 9 }, { day: 'Fri', scans: 5 }, { day: 'Sat', scans: 2 },
  ];

  // Mobile Handlers
  const handleMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const runMobileAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        disease: "bud rot", confidence: 0.94, severity: "critical",
        chemical: "Spray 1% Bordeaux mixture on affected leaves.",
        cultural: "Prune and burn severely affected leaves."
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  // UAV Handlers
  const handleUavUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUavFile(e.target.files[0]);
      setUavPreview(URL.createObjectURL(e.target.files[0]));
      setUavResult(null);
    }
  };

  const runUavAnalysis = () => {
    if (!uavFile) return;
    setIsProcessingUav(true);
    setTimeout(() => {
      setUavResult({
        index_type: indexType,
        statistics: { mean_index: 0.452, healthy_canopy_pct: 82.4, estate_health_grade: "B+", estimated_palms_count: 2450 },
        hotspots: MOCK_HOTSPOTS
      });
      setIsProcessingUav(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        
        {/* Header & Tabs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Microscope className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Pathology Lab</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-red-400/60">
                Multiscale Diagnostics
              </p>
            </div>
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto">
            {[
              { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
              { id: "aerial" as const, label: "System A (UAV)", icon: Plane },
              { id: "mobile" as const, label: "System B (Mobile)", icon: Smartphone },
              { id: "history" as const, label: "History", icon: History },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono smooth-transition whitespace-nowrap"
                style={{
                  background: tab === t.id ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === t.id ? "#fff" : "rgba(255,255,255,0.5)",
                  boxShadow: tab === t.id ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
                }}
              >
                <t.icon className="w-3.5 h-3.5" style={{ color: tab === t.id ? "#FF6B6B" : "inherit" }} /> 
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<ClipboardList />} label="Total Scans" value={stats.total} subtitle="Mobile diagnostics" trend={{ value: "+12%", positive: true }} accentColor="#3b82f6" />
                <StatCard icon={<ShieldCheck />} label="Healthy" value={stats.healthy} subtitle="Palms verified" accentColor="#10b981" />
                <StatCard icon={<AlertTriangle />} label="Diseased" value={stats.diseased} subtitle="Require attention" accentColor="#ef4444" />
                <StatCard icon={<Camera />} label="Avg Confidence" value={`${(stats.avgConf*100).toFixed(0)}%`} subtitle="MobileNetV2" accentColor="#a855f7" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DiseaseChart diagnostics={DEMO_DIAGNOSTICS} title="Disease Distribution" />
                
                <div className="glass-card p-5 flex flex-col">
                  <h3 className="text-sm text-white/50 font-mono mb-4">Weekly Scan Activity</h3>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: "rgba(10,10,10,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)" }} />
                        <Bar dataKey="scans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: SYSTEM A (UAV) */}
          {tab === "aerial" && (
            <motion.div key="aerial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Algorithm:</span>
                  <div className="flex gap-2">
                    {["VARI", "NDVI"].map(alg => (
                      <button key={alg} onClick={() => { setIndexType(alg as any); setUavResult(null); }}
                        className="px-4 py-1.5 rounded-md text-xs font-mono transition-all"
                        style={{ 
                          background: indexType === alg ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)",
                          color: indexType === alg ? "#06b6d4" : "rgba(255,255,255,0.4)",
                          border: `1px solid ${indexType === alg ? "rgba(6,182,212,0.3)" : "transparent"}`
                        }}
                      >
                        {alg}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Estate:</span>
                  <select className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none">
                    <option>Green Valley Estate</option>
                    <option>Puttalam Coastal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Upload Col */}
                <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                  <h2 className="text-sm font-mono text-white/60 mb-2">1. Drone Input</h2>
                  <p className="text-xs text-white/40 mb-4">{indexType === "VARI" ? "RGB Orthomosaic" : "4-Band GeoTIFF"}</p>
                  
                  <div onClick={() => uavInputRef.current?.click()}
                    className="border-2 border-dashed border-cyan-500/20 hover:border-cyan-500/40 rounded-xl bg-black/20 flex flex-col items-center justify-center cursor-pointer smooth-transition relative h-40 mb-4 overflow-hidden"
                  >
                    <input ref={uavInputRef} type="file" className="hidden" accept="image/*,.tif" onChange={handleUavUpload} />
                    {uavPreview ? (
                      <img src={uavPreview} alt="UAV Preview" className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <>
                        <Plane className="w-8 h-8 text-cyan-500/50 mb-2" />
                        <span className="text-xs text-white/50 font-mono">Click to upload aerial scan</span>
                      </>
                    )}
                  </div>

                  <button onClick={runUavAnalysis} disabled={!uavFile || isProcessingUav}
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all disabled:opacity-50 text-xs font-mono uppercase tracking-widest"
                  >
                    {isProcessingUav ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</> : <><Sparkles className="w-4 h-4" /> Run {indexType}</>}
                  </button>
                </div>

                {/* Right Results Col */}
                <div className="lg:col-span-3 glass-card p-6 flex flex-col min-h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-mono text-white/60">2. Canopy Health Map</h2>
                    {uavResult && (
                      <div className="flex gap-2">
                        {["heatmap", "original"].map(m => (
                          <button key={m} onClick={() => setViewMode(m as any)}
                            className={`px-3 py-1 rounded text-[10px] font-mono uppercase ${viewMode === m ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/40"}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!uavResult ? (
                    <div className="flex-1 border border-white/5 rounded-xl bg-black/40 flex flex-col items-center justify-center">
                      <Map className="w-12 h-12 text-white/10 mb-4" />
                      <p className="text-xs font-mono text-white/30">Awaiting processing...</p>
                    </div>
                  ) : (
                    <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 bg-black">
                      <img src={viewMode === "original" ? uavPreview! : uavPreview!} alt="Map" className={`w-full h-full object-cover ${viewMode === 'heatmap' ? 'sepia hue-rotate-90 saturate-200 contrast-125' : ''}`} />
                      {viewMode === "heatmap" && uavResult.hotspots.map((hs: any, i: number) => (
                        <div key={hs.id} className="absolute flex items-center justify-center w-5 h-5 rounded-full border border-white text-[9px] font-bold shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                          style={{
                            left: `${40 + (i * 15)}%`, top: `${30 + (i * 20)}%`, // Mock positions
                            background: hs.severity === 'critical' ? '#ef4444' : '#f59e0b', color: 'white'
                          }}
                        >
                          {i+1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Micro stats under map */}
                  {uavResult && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-white/5 p-3 rounded-lg"><div className="text-[10px] text-white/40 font-mono">ESTATE GRADE</div><div className="text-lg text-purple-400">{uavResult.statistics.estate_health_grade}</div></div>
                      <div className="bg-white/5 p-3 rounded-lg"><div className="text-[10px] text-white/40 font-mono">PALMS</div><div className="text-lg text-cyan-400">{uavResult.statistics.estimated_palms_count}</div></div>
                      <div className="bg-white/5 p-3 rounded-lg"><div className="text-[10px] text-white/40 font-mono">PURITY VIGOR</div><div className="text-lg text-emerald-400">{uavResult.statistics.healthy_canopy_pct}%</div></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hotspots Table */}
              {uavResult && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-mono text-white/60 mb-4">Canopy Stress Hotspots (Macro → Micro Bridge)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase font-mono text-white/40">
                          <th className="pb-2">GPS</th>
                          <th className="pb-2">Severity</th>
                          <th className="pb-2">Z-Score</th>
                          <th className="pb-2">Recommendation</th>
                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uavResult.hotspots.map((hs: any) => (
                          <tr key={hs.id} className="border-b border-white/5">
                            <td className="py-3 text-xs font-mono text-white/70">{hs.location.lat.toFixed(4)}, {hs.location.lng.toFixed(4)}</td>
                            <td className="py-3"><span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${hs.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{hs.severity}</span></td>
                            <td className="py-3 text-xs font-mono text-white/70">{hs.z_score}σ</td>
                            <td className="py-3 text-xs text-white/50">{hs.recommended_action}</td>
                            <td className="py-3 text-right">
                              <button className="text-[10px] px-3 py-1 rounded bg-blue-500/20 text-blue-400 font-mono hover:bg-blue-500/30 transition-all">Dispatch</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: SYSTEM B (MOBILE) */}
          {tab === "mobile" && (
            <motion.div key="mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex flex-col min-h-[450px]">
                <h2 className="text-sm font-mono text-white/60 mb-4">Leaf Level CNN Inference</h2>
                <label className="flex-1 border-2 border-dashed border-red-500/20 hover:border-red-500/40 rounded-xl bg-black/20 flex flex-col items-center justify-center cursor-pointer smooth-transition group relative overflow-hidden">
                  <input type="file" className="hidden" accept="image/*" onChange={handleMobileUpload} />
                  {file ? (
                    <div className="absolute inset-0 p-2">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-lg opacity-80" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 text-red-400 animate-spin mb-4" />
                          <p className="text-xs font-mono text-red-400/80">MobileNetV2-INT8 running...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition"><UploadCloud className="w-8 h-8 text-red-400/80" /></div>
                      <p className="text-sm text-white/60 mb-2">Drag & drop lesion image</p>
                    </>
                  )}
                </label>
                <div className="mt-6 flex justify-end">
                  <button onClick={runMobileAnalysis} disabled={!file || isAnalyzing}
                    className="px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    Run Inference
                  </button>
                </div>
              </div>

              <div className="glass-card p-6 min-h-[450px] flex flex-col">
                <h2 className="text-sm font-mono text-white/60 mb-6">Diagnostic Dossier</h2>
                {result ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col space-y-6">
                    <div>
                      <DiseaseBadge disease={result.disease} />
                      <div className="mt-4"><ConfidenceBar value={result.confidence} /></div>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
                    <div className="space-y-4">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5"><h4 className="text-[10px] font-mono text-white/40 mb-1">CHEMICAL</h4><p className="text-xs text-white/80">{result.chemical}</p></div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5"><h4 className="text-[10px] font-mono text-white/40 mb-1">CULTURAL</h4><p className="text-xs text-white/80">{result.cultural}</p></div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                    <Microscope className="w-12 h-12 mb-4" />
                    <p className="text-xs font-mono">Upload an image to see results</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: HISTORY */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/50 uppercase">Filter:</span>
                  <select value={filterDisease} onChange={e => setFilterDisease(e.target.value)} className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none font-mono">
                    <option value="all">All Diseases</option>
                    {diseases.map(d => <option key={d} value={d}>{DISEASE_COLORS[d]?.label || d}</option>)}
                  </select>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded font-mono">{filteredHistory.length} results</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setHistoryView("table")} className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all ${historyView === "table" ? "bg-white/10 text-white" : "bg-white/5 text-white/50"}`}>Table</button>
                  <button onClick={() => setHistoryView("map")} className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all ${historyView === "map" ? "bg-white/10 text-white" : "bg-white/5 text-white/50"}`}>Map</button>
                </div>
              </div>

              {historyView === "table" ? (
                <div className="glass-card p-2 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase font-mono text-white/40 bg-black/20">
                        <th className="p-4">Date</th>
                        <th className="p-4">Disease</th>
                        <th className="p-4">Confidence</th>
                        <th className="p-4">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map(d => (
                        <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-xs text-white/70">{new Date(d.captured_at).toLocaleString()}</td>
                          <td className="p-4"><DiseaseBadge disease={d.disease_class} size="sm" /></td>
                          <td className="p-4 w-40"><ConfidenceBar value={d.confidence} /></td>
                          <td className="p-4 text-xs font-mono text-white/50">{d.location.lat.toFixed(4)}, {d.location.lng.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card p-4">
                  <DiagnosticMapInner diagnostics={filteredHistory} />
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
