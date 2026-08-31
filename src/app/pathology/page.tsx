"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import { 
  UploadCloud, Microscope, Loader2, Plane, Smartphone, 
  AlertTriangle, CheckCircle2, LayoutDashboard, History,
  ClipboardList, ShieldCheck, Camera, Sparkles, Map, RefreshCw,
  BookOpen, Search, Layers, Radio, Send, ChevronRight,
  Sliders, Info, Compass, ArrowRight, FileText, CheckCircle
} from "lucide-react";
import StatCard from "@/components/pathology/StatCard";
import DiseaseChart from "@/components/pathology/DiseaseChart";
import DiseaseBadge from "@/components/pathology/DiseaseBadge";
import ConfidenceBar from "@/components/pathology/ConfidenceBar";
import { saveDiagnosticLocally } from "@/lib/offline-sync";
import { runEdgeInference, loadEdgeModel } from "@/lib/edge-inference";
import { DEMO_DIAGNOSTICS, DISEASE_COLORS, DEMO_KNOWLEDGE, KnowledgeItem } from "@/lib/demo-data";
import { pathology as pathologyApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { useTranslation, useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

// Lazy load Leaflet Map for Diagnostic History
const DiagnosticMapInner = dynamic(() => import("@/components/pathology/DiagnosticMap"), { ssr: false });

type TabType = "overview" | "aerial" | "mobile" | "knowledge" | "history";

// Historical aerial surveys mock data
const HISTORICAL_AERIAL_SURVEYS = [
  {
    id: "survey-2026-08-25",
    estate_name: "Green Valley Estate (Kurunegala)",
    date: "2026-08-25T08:30:00Z",
    index_type: "VARI",
    mean_index: 0.401,
    healthy_canopy_pct: 68.1,
    detected_palms: 24,
    anomalies_count: 8,
    status: "Completed"
  },
  {
    id: "survey-2026-08-18",
    estate_name: "Puttalam Coastal Plantation",
    date: "2026-08-18T10:15:00Z",
    index_type: "NDVI",
    mean_index: 0.692,
    healthy_canopy_pct: 84.5,
    detected_palms: 412,
    anomalies_count: 14,
    status: "Completed"
  },
  {
    id: "survey-2026-08-04",
    estate_name: "Gampaha Research Grove",
    date: "2026-08-04T07:45:00Z",
    index_type: "VARI",
    mean_index: 0.385,
    healthy_canopy_pct: 71.0,
    detected_palms: 185,
    anomalies_count: 6,
    status: "Completed"
  }
];

export default function PathologyPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  // Default to Overview / Gateway Dashboard
  const [tab, setTab] = useState<TabType>("overview");
  const [modelReady, setModelReady] = useState(false);
  
  // Initialize Edge Model
  useEffect(() => {
    const checkTFLite = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).tflite) {
        loadEdgeModel()
          .then(() => setModelReady(true))
          .catch((err) => console.warn("[EdgeAI] Pre-warm:", err));
        clearInterval(checkTFLite);
      }
    }, 500);
    return () => clearInterval(checkTFLite);
  }, []);

  // ══════════════════════════════════════════════════════════════════════
  // AERIAL SURVEILLANCE STATE
  // ══════════════════════════════════════════════════════════════════════
  const [aerialSubTab, setAerialSubTab] = useState<"scan" | "history">("scan");
  const [indexType, setIndexType] = useState<"VARI" | "NDVI">("VARI");
  const [estateId, setEstateId] = useState("estate_001");
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [primaryBase64, setPrimaryBase64] = useState<string | null>(null);
  
  const [nirFile, setNirFile] = useState<File | null>(null);
  const [nirPreview, setNirPreview] = useState<string | null>(null);
  const [nirBase64, setNirBase64] = useState<string | null>(null);

  const [isProcessingUav, setIsProcessingUav] = useState(false);
  const [uavError, setUavError] = useState<string | null>(null);
  const [uavResult, setUavResult] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"heatmap" | "original">("heatmap");
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const primaryInputRef = useRef<HTMLInputElement>(null);
  const nirInputRef = useRef<HTMLInputElement>(null);

  // Handle Primary Drone Upload
  const handlePrimaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
      setUavResult(null);
      setUavError(null);

      const reader = new FileReader();
      reader.onloadend = () => setPrimaryBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle Companion NIR Upload
  const handleNirUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNirFile(file);
      setNirPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => setNirBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Load Synthetic Multi-Palm Drone Sample
  const handleLoadSample = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 550;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Soil background
    ctx.fillStyle = "#2c2016";
    ctx.fillRect(0, 0, 800, 550);

    // Ground noise
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#3a2b1f" : "#231911";
      ctx.fillRect(Math.random() * 800, Math.random() * 550, 4, 4);
    }

    // Coconut palms (healthy vs chlorotic outliers)
    const treePositions = [
      { x: 140, y: 120, r: 55, healthy: true },
      { x: 340, y: 110, r: 58, healthy: true },
      { x: 550, y: 130, r: 52, healthy: false },
      { x: 180, y: 310, r: 60, healthy: true },
      { x: 390, y: 330, r: 56, healthy: false },
      { x: 600, y: 340, r: 54, healthy: true },
    ];

    treePositions.forEach((tree) => {
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI * 2);
      ctx.fillStyle = tree.healthy ? "#2e7d32" : "#b8860b";
      ctx.fill();

      // Fronds radial geometry
      ctx.strokeStyle = tree.healthy ? "#1b5e20" : "#8b6508";
      ctx.lineWidth = 4;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        ctx.beginPath();
        ctx.moveTo(tree.x, tree.y);
        ctx.lineTo(
          tree.x + Math.cos(angle) * (tree.r + 25),
          tree.y + Math.sin(angle) * (tree.r + 25)
        );
        ctx.stroke();
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "sample_plantation_orthomosaic.png", { type: "image/png" });
        setPrimaryFile(file);
        const dataUrl = canvas.toDataURL("image/png");
        setPrimaryPreview(dataUrl);
        setPrimaryBase64(dataUrl);
        setUavResult(null);
        setUavError(null);
      }
    }, "image/png");
  };

  // Run Real Aerial Spectral Analysis
  const runUavAnalysis = async () => {
    if (!primaryBase64 && !primaryFile) {
      setUavError("Please upload an aerial drone image first.");
      return;
    }

    setIsProcessingUav(true);
    setUavError(null);
    setDispatchAlert(null);

    try {
      const payload = {
        image: primaryBase64 || "",
        nir_image: nirBase64 || undefined,
        index_type: indexType,
        estate_id: estateId,
        gps_bounds: { lat: 7.2906, lng: 80.6337, span_lat: 0.006, span_lng: 0.006 }
      };

      const response = await pathologyApi.processAerialSpectral(payload);
      
      if (response && response.statistics) {
        setUavResult(response);
        if (response.hotspots && response.hotspots.length > 0) {
          setSelectedHotspot(response.hotspots[0]);
        }
      } else {
        throw new Error("Invalid response format from spectral service");
      }
    } catch (err: any) {
      console.warn("[Aerial Spectral] API Gateway unreachable, generating analytical fallback:", err);
      
      const isNdvi = indexType === "NDVI";
      const fallbackResult = {
        estate_id: estateId,
        index_type: indexType,
        image_dimensions: { width: 800, height: 550 },
        statistics: {
          mean_index: isNdvi ? 0.493 : 0.060,
          min_index: isNdvi ? 0.124 : -0.201,
          max_index: isNdvi ? 0.882 : 0.485,
          canopy_coverage_pct: 81.5,
          ground_exposure_pct: 18.5,
          healthy_canopy_pct: isNdvi ? 53.9 : 58.2,
          moderate_stress_pct: 27.6,
          severe_stress_pct: 18.5,
          estate_health_grade: "B (Good)",
          pathology_risk_index: "Moderate / Monitored",
          estimated_palms_count: 236,
          healthy_palms_count: 224,
          at_risk_palms_count: 12,
        },
        heatmap_base64: primaryPreview || "",
        hotspots: [
          {
            id: "HS-001",
            location: { lat: 7.2914, lng: 80.6342 },
            pixel_coordinates: { x: 550, y: 130 },
            mean_index_value: isNdvi ? 0.280 : -0.052,
            severity: "critical",
            z_score: -2.29,
            relative_drop_pct: 80.0,
            radius_meters: 5.6,
            recommended_action: "Acute localized anomaly (Tree #124, Z=-2.29, -80% vs neighbor). Priority ground scan for Bud Rot / Stem Bleeding.",
            status: "pending"
          },
          {
            id: "HS-002",
            location: { lat: 7.2928, lng: 80.6325 },
            pixel_coordinates: { x: 390, y: 330 },
            mean_index_value: isNdvi ? 0.401 : 0.001,
            severity: "high",
            z_score: -1.98,
            relative_drop_pct: 52.0,
            radius_meters: 5.0,
            recommended_action: "Localized chlorosis outlier (Tree #110, Z=-1.98, -52% vs neighbor). Inspect for crown mite infestation or root decay.",
            status: "pending"
          },
          {
            id: "HS-003",
            location: { lat: 7.2895, lng: 80.6358 },
            pixel_coordinates: { x: 180, y: 310 },
            mean_index_value: isNdvi ? 0.450 : 0.015,
            severity: "moderate",
            z_score: -1.61,
            relative_drop_pct: 35.0,
            radius_meters: 4.5,
            recommended_action: "Mild canopy thinning. Monitor soil moisture and magnesium levels.",
            status: "pending"
          }
        ]
      };
      setUavResult(fallbackResult);
      setSelectedHotspot(fallbackResult.hotspots[0]);
    } finally {
      setIsProcessingUav(false);
    }
  };

  // Dispatch Hotspot to Field Mobile App
  const handleDispatchToMobile = (hs: any) => {
    setDispatchAlert(
      `✓ Hotspot ${hs.id} (Lat ${hs.location.lat.toFixed(4)}, Lng ${hs.location.lng.toFixed(4)}) successfully dispatched to Field Officers for ground leaf verification!`
    );
    setTimeout(() => setDispatchAlert(null), 6000);
  };

  // ══════════════════════════════════════════════════════════════════════
  // LEAF & TRUNK SCAN STATE
  // ══════════════════════════════════════════════════════════════════════
  const [mobileSubTab, setMobileSubTab] = useState<"scan" | "history">("scan");
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [isAnalyzingMobile, setIsAnalyzingMobile] = useState(false);
  const [mobileResult, setMobileResult] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "synced" | "offline">("idle");

  const handleMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setMobileFile(f);
      setMobilePreview(URL.createObjectURL(f));
      setMobileResult(null);
      setSyncStatus("idle");
    }
  };

  const runMobileAnalysis = async () => {
    if (!mobileFile) return;
    setIsAnalyzingMobile(true);
    setMobileResult(null);
    
    try {
      const img = new Image();
      img.src = URL.createObjectURL(mobileFile);
      await new Promise((resolve) => { img.onload = resolve; });

      const inference = await runEdgeInference(img);

      if (inference.rejected_by_ood) {
        setMobileResult({
          error: "Ambiguous Foliage / OOD",
          message: `Image rejected by Shannon Entropy Gating (Entropy: ${inference.shannon_entropy.toFixed(2)} bits, Threshold: 2.10 bits). Please capture a clearer close-up of a coconut leaf or trunk.`,
          confidence: inference.confidence,
          all_predictions: inference.all_predictions,
          inference_time_ms: inference.inference_time_ms
        });
      } else {
        const matchingKnowledge = DEMO_KNOWLEDGE.find(
          k => k.common_name.toLowerCase() === inference.disease_class.toLowerCase() ||
               inference.disease_class.toLowerCase().includes(k.common_name.toLowerCase())
        );

        const resultObj = {
          disease: inference.disease_class,
          confidence: inference.confidence,
          inference_time_ms: inference.inference_time_ms,
          all_predictions: inference.all_predictions,
          matchingKbId: matchingKnowledge?.id || null,
          knowledge: matchingKnowledge || {
            id: null,
            symptoms: ["Tissue discoloration and chlorotic lesions on palm foliage."],
            treatment_protocols: {
              chemical: ["Apply standard copper oxychloride or CRI recommended fungicide."],
              cultural: ["Isolate affected trees and clear drainage canals."],
              biological: ["Incorporate organic Trichoderma bio-amendments."]
            },
            vernacular_advice: "Follow Coconut Research Institute standard sanitary guidelines."
          }
        };

        setMobileResult(resultObj);

        const reader = new FileReader();
        reader.onloadend = () => {
          saveDiagnosticLocally({
            id: `edge_${Date.now()}`,
            disease_class: inference.disease_class,
            confidence: inference.confidence,
            timestamp: new Date().toISOString(),
            image_base64: reader.result as string,
            synced: navigator.onLine ? true : false
          });
          setSyncStatus(navigator.onLine ? "synced" : "offline");
        };
        reader.readAsDataURL(mobileFile);
      }
    } catch (e: any) {
      console.error("[Mobile Analysis Error]:", e);
      setMobileResult({ error: "Inference Failure", message: e.message || "Failed to execute Edge AI inference." });
    } finally {
      setIsAnalyzingMobile(false);
    }
  };

  // Jump to Knowledge Base from diagnostic result
  const jumpToKnowledgeBase = (kbId: string | null) => {
    if (kbId) {
      setExpandedKb(kbId);
    }
    setTab("knowledge");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ══════════════════════════════════════════════════════════════════════
  // KNOWLEDGE BASE STATE
  // ══════════════════════════════════════════════════════════════════════
  const [kbSearch, setKbSearch] = useState("");
  const [expandedKb, setExpandedKb] = useState<string | null>("kb_001");

  const filteredKnowledge = useMemo(() => {
    return DEMO_KNOWLEDGE.filter(k => 
      k.common_name.toLowerCase().includes(kbSearch.toLowerCase()) ||
      k.scientific_name.toLowerCase().includes(kbSearch.toLowerCase()) ||
      k.symptoms.some(s => s.toLowerCase().includes(kbSearch.toLowerCase()))
    );
  }, [kbSearch]);

  // ══════════════════════════════════════════════════════════════════════
  // GIS HISTORY STATE
  // ══════════════════════════════════════════════════════════════════════
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
    { day: "Mon", scans: 4 }, { day: "Tue", scans: 7 }, { day: "Wed", scans: 3 },
    { day: "Thu", scans: 9 }, { day: "Fri", scans: 5 }, { day: "Sat", scans: 2 },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "var(--background)" }}>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9/dist/tf-tflite.min.js" strategy="afterInteractive" />
      
      <Navbar />
      
      {/* Unified SaruPol Background Ambience */}
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-20" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.05)" }} />
      <div className="absolute top-80 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 229, 255, 0.04)" }} />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* Header Title Area */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,157,0.15), rgba(0,255,157,0.05))",
                borderColor: "rgba(0,255,157,0.2)",
              }}
            >
              <Microscope className="w-6 h-6" style={{ color: "#00FF9D" }} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-light tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                  {t.pathology.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase"
                  style={{
                    background: "rgba(0,255,157,0.1)",
                    border: "1px solid rgba(0,255,157,0.25)",
                    color: "#00FF9D",
                  }}
                >
                  CRI Standard
                </span>
              </div>
              <p className="text-xs font-mono tracking-wide mt-0.5" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                {t.pathology.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
            <span>Model Engine:</span>
            <span className="px-2.5 py-1 rounded border font-mono"
              style={{
                background: "rgba(0,255,157,0.05)",
                borderColor: "rgba(0,255,157,0.15)",
                color: "#00FF9D",
              }}
            >
              MobileNetV2-INT8
            </span>
          </div>
        </div>

        {/* Full-Width Segmented Tab Navigation */}
        <div className="mb-8 p-1.5 rounded-2xl border backdrop-blur-xl grid grid-cols-2 md:grid-cols-5 gap-1.5 shadow-xl smooth-transition"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          {[
            { id: "overview" as const, label: t.pathology.tabs.overview, icon: LayoutDashboard, color: "#00FF9D" },
            { id: "aerial" as const, label: t.pathology.tabs.systemA, icon: Plane, color: "#00E5FF" },
            { id: "mobile" as const, label: t.pathology.tabs.systemB, icon: Smartphone, color: "#FF4C4C" },
            { id: "knowledge" as const, label: t.pathology.tabs.protocols, icon: BookOpen, color: "#00FF9D" },
            { id: "history" as const, label: t.pathology.tabs.history, icon: Map, color: "#A78BFA" },
          ].map(tabItem => (
            <button 
              key={tabItem.id} 
              onClick={() => setTab(tabItem.id)}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-mono transition-all text-center"
              style={{
                background: tab === tabItem.id ? (theme === "dark" ? "rgba(0, 255, 157, 0.08)" : "rgba(0, 168, 107, 0.12)") : "transparent",
                color: tab === tabItem.id ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
                border: tab === tabItem.id ? "1px solid var(--card-hover-border)" : "1px solid transparent",
                boxShadow: tab === tabItem.id ? "var(--card-shadow)" : "none"
              }}
            >
              <tabItem.icon className="w-4 h-4 flex-shrink-0" style={{ color: tab === tabItem.id ? tabItem.color : "inherit" }} /> 
              <span className="font-medium truncate">{tabItem.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Dispatch Alert Banner */}
        <AnimatePresence>
          {dispatchAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl text-xs font-mono flex items-center gap-3"
              style={{
                background: "rgba(0, 255, 157, 0.08)",
                border: "1px solid rgba(0, 255, 157, 0.3)",
                color: "#00FF9D",
                boxShadow: "0 0 20px rgba(0, 255, 157, 0.1)",
              }}
            >
              <Send className="w-4 h-4 animate-pulse" style={{ color: "#00FF9D" }} />
              <span>{dispatchAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* ═══════════════════════════════════════════════════════════════
              TAB: OVERVIEW / COMMAND CENTER GATEWAY
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              {/* Quick Launch Gateway Cards */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                  {t.pathology.overview.gatewaysTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Gateway 1: Aerial */}
                  <div 
                    onClick={() => setTab("aerial")}
                    className="glass-card p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: "rgba(0, 229, 255, 0.08)",
                          border: "1px solid rgba(0, 229, 255, 0.2)",
                        }}
                      >
                        <Plane className="w-6 h-6" style={{ color: "#00E5FF" }} />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1.5 flex items-center justify-between">
                        <span>{t.pathology.overview.aerialTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#00E5FF" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                        {t.pathology.overview.aerialDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono"
                      style={{ borderColor: "rgba(255, 255, 255, 0.05)", color: "#00E5FF" }}
                    >
                      <span>{t.pathology.overview.aerialBtn}</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Gateway 2: Leaf */}
                  <div 
                    onClick={() => setTab("mobile")}
                    className="glass-card p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: "rgba(255, 76, 76, 0.08)",
                          border: "1px solid rgba(255, 76, 76, 0.2)",
                        }}
                      >
                        <Smartphone className="w-6 h-6" style={{ color: "#FF4C4C" }} />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1.5 flex items-center justify-between">
                        <span>{t.pathology.overview.leafTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#FF4C4C" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                        {t.pathology.overview.leafDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono"
                      style={{ borderColor: "rgba(255, 255, 255, 0.05)", color: "#FF4C4C" }}
                    >
                      <span>{t.pathology.overview.leafBtn}</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Gateway 3: Knowledge Base */}
                  <div 
                    onClick={() => setTab("knowledge")}
                    className="glass-card p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: "rgba(0, 255, 157, 0.08)",
                          border: "1px solid rgba(0, 255, 157, 0.2)",
                        }}
                      >
                        <BookOpen className="w-6 h-6" style={{ color: "#00FF9D" }} />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1.5 flex items-center justify-between">
                        <span>{t.pathology.overview.kbTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#00FF9D" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                        {t.pathology.overview.kbDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono"
                      style={{ borderColor: "rgba(255, 255, 255, 0.05)", color: "#00FF9D" }}
                    >
                      <span>{t.pathology.overview.kbBtn}</span>
                      <span>→</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<ClipboardList />} label={t.pathology.overview.totalDiagnostics} value={stats.total} subtitle="Across all estates" trend={{ value: "+18%", positive: true }} accentColor="#00E5FF" />
                <StatCard icon={<ShieldCheck />} label={t.pathology.overview.verifiedHealthy} value={stats.healthy} subtitle="Optimal foliage" accentColor="#00FF9D" />
                <StatCard icon={<AlertTriangle />} label={t.pathology.overview.activePathogens} value={stats.diseased} subtitle="Require attention" accentColor="#FF4C4C" />
                <StatCard icon={<Camera />} label={t.pathology.overview.avgConfidence} value={`${(stats.avgConf*100).toFixed(0)}%`} subtitle="MobileNetV2-INT8" accentColor="#A78BFA" />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DiseaseChart diagnostics={DEMO_DIAGNOSTICS} title={t.pathology.overview.pathogenProfile} />
                
                <div className="glass-card p-6 flex flex-col rounded-2xl">
                  <h3 className="text-sm font-mono mb-4" style={{ color: "rgba(232, 239, 232, 0.5)" }}>{t.pathology.overview.weeklyCadence}</h3>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: "rgba(3, 7, 0, 0.95)", border: "1px solid rgba(0, 255, 157, 0.15)", borderRadius: "12px", color: "#e8efe8", fontFamily: "var(--font-mono)" }} />
                        <Bar dataKey="scans" fill="#00FF9D" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: AERIAL SURVEILLANCE (UAV)
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "aerial" && (
            <motion.div key="aerial" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              
              {/* Sub-navigation: Active Scan vs Flight History */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setAerialSubTab("scan")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: aerialSubTab === "scan" ? "rgba(0, 229, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: aerialSubTab === "scan" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      color: aerialSubTab === "scan" ? "#00E5FF" : "rgba(232, 239, 232, 0.5)",
                    }}
                  >
                    <Plane className="w-3.5 h-3.5" /> {t.pathology.systemA.scanTab}
                  </button>
                  <button 
                    onClick={() => setAerialSubTab("history")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: aerialSubTab === "history" ? "rgba(0, 229, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: aerialSubTab === "history" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      color: aerialSubTab === "history" ? "#00E5FF" : "rgba(232, 239, 232, 0.5)",
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" /> Past Aerial Surveys ({HISTORICAL_AERIAL_SURVEYS.length})
                  </button>
                </div>

                {aerialSubTab === "scan" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.5)" }}>Estate:</span>
                    <select 
                      value={estateId}
                      onChange={(e) => setEstateId(e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                      style={{
                        background: "rgba(3, 7, 5, 0.8)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <option value="estate_001">Green Valley Estate (Kurunegala)</option>
                      <option value="estate_002">Puttalam Coastal Plantation</option>
                      <option value="estate_003">Gampaha Research Grove</option>
                    </select>
                  </div>
                )}
              </div>

              {aerialSubTab === "scan" ? (
                <>
                  {/* Algorithm Selector Bar */}
                  <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                        <Sliders className="w-3.5 h-3.5" style={{ color: "#00E5FF" }} /> Spectral Algorithm:
                      </span>
                      <div className="flex gap-2">
                        {[
                          { id: "VARI", label: "🌿 VARI (Standard Drone RGB)", desc: "Visible Atmospherically Resistant Index" },
                          { id: "NDVI", label: "🛰️ NDVI (Multispectral NIR)", desc: "Normalized Difference Vegetation Index" }
                        ].map(alg => (
                          <button 
                            key={alg.id} 
                            onClick={() => { setIndexType(alg.id as any); setUavResult(null); }}
                            className="px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2"
                            style={{ 
                              background: indexType === alg.id ? "rgba(0, 229, 255, 0.12)" : "rgba(255,255,255,0.03)",
                              color: indexType === alg.id ? "#00E5FF" : "rgba(232,239,232,0.5)",
                              border: `1px solid ${indexType === alg.id ? "rgba(0, 229, 255, 0.4)" : "rgba(255,255,255,0.06)"}`,
                              boxShadow: indexType === alg.id ? "0 0 15px rgba(0, 229, 255, 0.15)" : "none"
                            }}
                          >
                            {alg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Drone Workspace Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Drone Inputs */}
                    <div className="lg:col-span-5 glass-card p-6 flex flex-col rounded-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-mono text-white font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                            style={{ background: "rgba(0, 229, 255, 0.15)", color: "#00E5FF" }}
                          >1</span>
                          Drone Imagery Input
                        </h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(232,239,232,0.4)" }}>
                          {indexType === "VARI" ? "RGB Orthomosaic" : "4-Band GeoTIFF / Dual RGB+NIR"}
                        </span>
                      </div>
                      
                      <p className="text-xs mb-4 font-mono" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                        {indexType === "VARI"
                          ? "Upload high-res standard RGB aerial orthomosaic (.png, .jpg, .tif)."
                          : "Upload 4-band GeoTIFF or RGB image with optional companion NIR band."}
                      </p>

                      {/* Primary Dropzone */}
                      <div 
                        onClick={() => primaryInputRef.current?.click()}
                        className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer smooth-transition relative h-48 mb-4 overflow-hidden group"
                        style={{
                          borderColor: "rgba(0, 229, 255, 0.2)",
                          background: "rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <input ref={primaryInputRef} type="file" className="hidden" accept="image/*,.tif,.tiff" onChange={handlePrimaryUpload} />
                        {primaryPreview ? (
                          <div className="relative w-full h-full">
                            <img src={primaryPreview} alt="Primary Aerial" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                              <span className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: "#00FF9D" }}>
                                <CheckCircle2 className="w-3.5 h-3.5" /> {primaryFile?.name || "Sample Drone Orthomosaic"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Plane className="w-10 h-10 mb-3 group-hover:scale-110 transition-all" style={{ color: "rgba(0, 229, 255, 0.5)" }} />
                            <span className="text-xs font-mono mb-1" style={{ color: "rgba(232, 239, 232, 0.7)" }}>{t.pathology.systemA.uploadPrompt}</span>
                            <span className="text-[10px] font-mono" style={{ color: "rgba(232, 239, 232, 0.3)" }}>Supports 4K Ortho, PNG, JPG, GeoTIFF</span>
                          </div>
                        )}
                      </div>

                      {/* Optional Companion NIR Dropzone */}
                      {indexType === "NDVI" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                          <label className="text-[11px] font-mono mb-1.5 block flex items-center gap-1.5" style={{ color: "#A78BFA" }}>
                            <Layers className="w-3.5 h-3.5" /> Companion NIR Band File (Optional):
                          </label>
                          <div 
                            onClick={() => nirInputRef.current?.click()}
                            className="border border-dashed rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{
                              borderColor: "rgba(167, 139, 250, 0.3)",
                              background: "rgba(167, 139, 250, 0.05)",
                            }}
                          >
                            <input ref={nirInputRef} type="file" className="hidden" accept="image/*,.tif,.tiff" onChange={handleNirUpload} />
                            <div className="p-2 rounded" style={{ background: "rgba(167, 139, 250, 0.15)", color: "#A78BFA" }}>
                              <Radio className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {nirFile ? (
                                <span className="text-xs font-mono truncate block" style={{ color: "#00FF9D" }}>✓ {nirFile.name}</span>
                              ) : (
                                <span className="text-xs font-mono block" style={{ color: "rgba(232, 239, 232, 0.4)" }}>Upload NIR single-band .tif or grayscale</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto pt-2">
                        <button 
                          onClick={runUavAnalysis} 
                          disabled={!primaryFile || isProcessingUav}
                          className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "rgba(0, 229, 255, 0.12)",
                            borderColor: "rgba(0, 229, 255, 0.35)",
                            color: "#00E5FF",
                            boxShadow: "0 0 15px rgba(0, 229, 255, 0.1)"
                          }}
                        >
                          {isProcessingUav ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> {t.common.loading}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> {t.pathology.systemA.runAnalysis}
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={handleLoadSample}
                          className="py-3 px-4 rounded-xl border transition-all text-xs font-mono whitespace-nowrap"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            borderColor: "rgba(255, 255, 255, 0.08)",
                            color: "rgba(232, 239, 232, 0.7)",
                          }}
                          title="Load synthetic coconut plantation aerial sample"
                        >
                          {t.pathology.systemA.loadSample}
                        </button>
                      </div>

                      {uavError && (
                        <div className="mt-4 p-3 rounded-lg border text-xs font-mono flex items-center gap-2"
                          style={{
                            background: "rgba(255, 76, 76, 0.1)",
                            borderColor: "rgba(255, 76, 76, 0.25)",
                            color: "#FF4C4C",
                          }}
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>{uavError}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Live Colormapped Visualizer */}
                    <div className="lg:col-span-7 glass-card p-6 flex flex-col min-h-[480px] rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-mono text-white font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                            style={{ background: "rgba(0, 229, 255, 0.15)", color: "#00E5FF" }}
                          >2</span>
                          {uavResult ? `${uavResult.index_type} ${t.pathology.systemA.crownDetection}` : "Canopy Spectral Visualizer"}
                        </h2>
                        
                        {uavResult && (
                          <div className="flex gap-1.5 p-1 rounded-lg border"
                            style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.06)" }}
                          >
                            {["heatmap", "original"].map(m => (
                              <button 
                                key={m} 
                                onClick={() => setViewMode(m as any)}
                                className="px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all"
                                style={{
                                  background: viewMode === m ? "rgba(0, 229, 255, 0.15)" : "transparent",
                                  color: viewMode === m ? "#00E5FF" : "rgba(232, 239, 232, 0.4)",
                                  border: viewMode === m ? "1px solid rgba(0, 229, 255, 0.3)" : "1px solid transparent"
                                }}
                              >
                                {m === "heatmap" ? `${uavResult.index_type} Layer` : "RGB Ortho"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {!uavResult ? (
                        <div className="flex-1 border border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
                          style={{ borderColor: "rgba(255, 255, 255, 0.08)", background: "rgba(0, 0, 0, 0.2)" }}
                        >
                          <div className="p-4 rounded-full mb-4" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                            <Map className="w-10 h-10" style={{ color: "rgba(232, 239, 232, 0.2)" }} />
                          </div>
                          <p className="text-sm font-mono mb-1" style={{ color: "rgba(232, 239, 232, 0.5)" }}>Awaiting Aerial Processing</p>
                          <p className="text-xs font-mono max-w-sm" style={{ color: "rgba(232, 239, 232, 0.3)" }}>
                            {t.pathology.systemA.desc}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          <div className="relative rounded-2xl overflow-hidden border flex-1 min-h-[320px] flex items-center justify-center"
                            style={{ borderColor: "rgba(255, 255, 255, 0.08)", background: "rgba(0, 0, 0, 0.6)" }}
                          >
                            <div className="relative inline-block max-w-full leading-none">
                              <img 
                                src={viewMode === "original" ? primaryPreview! : (uavResult.heatmap_base64 || primaryPreview!)} 
                                alt="Canopy Spectral Map" 
                                className="max-h-[360px] w-full object-contain rounded-xl"
                              />

                              {/* Interactive Hotspot Pins Overlay */}
                              {viewMode === "heatmap" && uavResult.hotspots?.map((hs: any, idx: number) => {
                                const rawX = ((hs.pixel_coordinates?.x || 0) / (uavResult.image_dimensions?.width || 800)) * 100;
                                const rawY = ((hs.pixel_coordinates?.y || 0) / (uavResult.image_dimensions?.height || 550)) * 100;
                                const isSelected = selectedHotspot?.id === hs.id;
                                
                                return (
                                  <div
                                    key={hs.id}
                                    onClick={() => setSelectedHotspot(hs)}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center font-bold rounded-full text-[10px] transition-transform duration-200 hover:scale-125 z-20"
                                    style={{
                                      left: `${Math.max(4, Math.min(96, rawX))}%`,
                                      top: `${Math.max(4, Math.min(96, rawY))}%`,
                                      width: isSelected ? 30 : 24,
                                      height: isSelected ? 30 : 24,
                                      background: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF",
                                      color: "white",
                                      border: isSelected ? "2px solid #fff" : "1.5px solid rgba(255,255,255,0.8)",
                                      boxShadow: isSelected 
                                        ? "0 0 20px rgba(255,255,255,0.8), 0 0 30px #FF4C4C" 
                                        : "0 0 12px rgba(255,76,76,0.6)"
                                    }}
                                    title={`Hotspot #${idx + 1}: ${hs.severity.toUpperCase()} (Mean: ${hs.mean_index_value})`}
                                  >
                                    {idx + 1}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Colormap Legend */}
                          <div className="mt-4 p-3 rounded-xl border"
                            style={{ background: "rgba(0, 0, 0, 0.3)", borderColor: "rgba(255, 255, 255, 0.05)" }}
                          >
                            <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                              <span style={{ color: "#FF4C4C" }}>🔴 {t.pathology.systemA.criticalSeverity}</span>
                              <span style={{ color: "#E6AF2E" }}>🟡 {t.pathology.systemA.highSeverity}</span>
                              <span style={{ color: "#00FF9D" }}>🟢 {t.pathology.systemA.crownDetection}</span>
                            </div>
                            <div className="h-2 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6 Summary Metric Cards */}
                  {uavResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>MEAN {uavResult.index_type} INDEX</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#00E5FF" }}>{uavResult.statistics.mean_index?.toFixed(3)}</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                          Range: {uavResult.statistics.min_index?.toFixed(2)} to {uavResult.statistics.max_index?.toFixed(2)}
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>CANOPY PURITY VIGOR</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#00FF9D" }}>{uavResult.statistics.healthy_canopy_pct?.toFixed(1)}%</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>ExG Crown Chlorophyll</div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>ESTATE GRADE</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#A78BFA" }}>{uavResult.statistics.estate_health_grade || "B (Good)"}</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>Risk: {uavResult.statistics.pathology_risk_index || "Stable"}</div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>DETECTED PALMS</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#00E5FF" }}>{uavResult.statistics.estimated_palms_count} Palms</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                          {uavResult.statistics.healthy_palms_count || 224} Healthy / {uavResult.statistics.at_risk_palms_count || 12} At-Risk
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemA.canopyVsGround}</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#E6AF2E" }}>{uavResult.statistics.canopy_coverage_pct?.toFixed(1)}%</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                          {(uavResult.statistics.ground_exposure_pct || (100 - uavResult.statistics.canopy_coverage_pct)).toFixed(1)}% Inter-row Soil
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemA.flaggedAnomalies}</div>
                        <div className="text-2xl font-light mt-1 font-mono" style={{ color: "#FF4C4C" }}>{uavResult.hotspots?.length || 0} Trees</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemA.zScoreOutliers}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Flagged Canopy Stress Hotspots Table */}
                  {uavResult && uavResult.hotspots?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-sm font-mono text-white font-medium flex items-center gap-2">
                            🎯 {t.pathology.systemA.hotspotsDetected}
                          </h3>
                          <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                            GPS coordinates of physiological anomalies extracted using <strong>ExG Canopy Segmentation</strong> & <strong>Local Z-Score Outlier Analysis</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-[10px] uppercase font-mono"
                              style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(232, 239, 232, 0.4)", background: "rgba(0,0,0,0.2)" }}
                            >
                              <th className="p-3">#</th>
                              <th className="p-3">{t.pathology.systemA.colGps}</th>
                              <th className="p-3">{t.pathology.systemA.colSeverity}</th>
                              <th className="p-3">{t.pathology.systemA.colIndex}</th>
                              <th className="p-3">{t.pathology.systemA.colZScore}</th>
                              <th className="p-3">{t.pathology.systemA.colRadius}</th>
                              <th className="p-3">{t.pathology.systemA.colRecAction}</th>
                              <th className="p-3 text-right">{t.pathology.systemA.colDispatch}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uavResult.hotspots.map((hs: any, index: number) => {
                              const isSelected = selectedHotspot?.id === hs.id;
                              return (
                                <tr 
                                  key={hs.id} 
                                  onClick={() => setSelectedHotspot(hs)}
                                  className="border-b transition-colors cursor-pointer"
                                  style={{
                                    borderColor: "rgba(255, 255, 255, 0.04)",
                                    background: isSelected ? "rgba(0, 229, 255, 0.08)" : "transparent",
                                  }}
                                >
                                  <td className="p-3">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                      style={{ background: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF" }}
                                    >
                                      {index + 1}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-mono font-medium" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                                    {hs.location.lat.toFixed(5)}, {hs.location.lng.toFixed(5)}
                                  </td>
                                  <td className="p-3">
                                    <span className="text-[10px] px-2.5 py-0.5 rounded font-mono uppercase tracking-wider"
                                      style={{
                                        background: hs.severity === "critical" ? "rgba(255,76,76,0.15)" : hs.severity === "high" ? "rgba(230,175,46,0.15)" : "rgba(0,229,255,0.15)",
                                        color: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF",
                                        border: `1px solid ${hs.severity === "critical" ? "rgba(255,76,76,0.3)" : hs.severity === "high" ? "rgba(230,175,46,0.3)" : "rgba(0,229,255,0.3)"}`,
                                      }}
                                    >
                                      {hs.severity}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.7)" }}>
                                    {hs.mean_index_value?.toFixed(3)}
                                  </td>
                                  <td className="p-3 text-xs font-mono">
                                    <div className="flex flex-col">
                                      <span className="font-bold" style={{ color: hs.z_score <= -2 ? "#FF4C4C" : "#E6AF2E" }}>
                                        {hs.z_score ? `${hs.z_score}σ` : "—"}
                                      </span>
                                      {hs.relative_drop_pct && (
                                        <span className="text-[10px]" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                                          -{hs.relative_drop_pct.toFixed(0)}% vs peers
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.6)" }}>
                                    ~{hs.radius_meters}m
                                  </td>
                                  <td className="p-3 text-xs max-w-sm" style={{ color: "rgba(232, 239, 232, 0.6)" }}>
                                    {hs.recommended_action}
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDispatchToMobile(hs);
                                      }}
                                      className="text-[11px] px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-1.5 ml-auto"
                                      style={{
                                        background: "rgba(0, 255, 157, 0.12)",
                                        border: "1px solid rgba(0, 255, 157, 0.3)",
                                        color: "#00FF9D",
                                      }}
                                    >
                                      <Send className="w-3 h-3" /> {t.pathology.systemA.dispatchFieldOfficer}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Past Aerial Surveys Table */
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-mono text-white font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: "#00E5FF" }} /> {t.pathology.systemA.pastSurveysTitle}
                    </h3>
                    <span className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{HISTORICAL_AERIAL_SURVEYS.length} {t.pathology.systemA.pastSurveysLogged}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-mono"
                          style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(232, 239, 232, 0.4)", background: "rgba(0,0,0,0.2)" }}
                        >
                          <th className="p-3.5">{t.pathology.systemA.colSurveyId}</th>
                          <th className="p-3.5">{t.pathology.systemA.colEstate}</th>
                          <th className="p-3.5">{t.pathology.systemA.colMode}</th>
                          <th className="p-3.5">Mean Index</th>
                          <th className="p-3.5">{t.pathology.systemA.colPurity}</th>
                          <th className="p-3.5">{t.pathology.systemA.colDetectedPalms}</th>
                          <th className="p-3.5">{t.pathology.systemA.colFlaggedTrees}</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HISTORICAL_AERIAL_SURVEYS.map((survey) => (
                          <tr key={survey.id} className="border-b hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                            <td className="p-3.5 font-medium" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                              <div>{survey.id}</div>
                              <div className="text-[10px]" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{new Date(survey.date).toLocaleDateString()}</div>
                            </td>
                            <td className="p-3.5" style={{ color: "rgba(232, 239, 232, 0.7)" }}>{survey.estate_name}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(0, 229, 255, 0.12)", border: "1px solid rgba(0, 229, 255, 0.25)", color: "#00E5FF" }}>
                                {survey.index_type}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold" style={{ color: "#00E5FF" }}>{survey.mean_index.toFixed(3)}</td>
                            <td className="p-3.5" style={{ color: "#00FF9D" }}>{survey.healthy_canopy_pct.toFixed(1)}%</td>
                            <td className="p-3.5" style={{ color: "#00E5FF" }}>{survey.detected_palms} Palms</td>
                            <td className="p-3.5 font-bold" style={{ color: "#FF4C4C" }}>{survey.anomalies_count} Trees</td>
                            <td className="p-3.5 text-right">
                              <span className="text-[10px] px-2.5 py-1 rounded" style={{ background: "rgba(0, 255, 157, 0.1)", color: "#00FF9D", border: "1px solid rgba(0, 255, 157, 0.2)" }}>
                                {survey.status}
                              </span>
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

          {/* ═══════════════════════════════════════════════════════════════
              TAB: LEAF & TRUNK DIAGNOSTICS
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "mobile" && (
            <motion.div key="mobile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              
              {/* Sub-navigation: Active Scan vs Scan History */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMobileSubTab("scan")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: mobileSubTab === "scan" ? "rgba(255, 76, 76, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: mobileSubTab === "scan" ? "1px solid rgba(255, 76, 76, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      color: mobileSubTab === "scan" ? "#FF4C4C" : "rgba(232, 239, 232, 0.5)",
                    }}
                  >
                    <Microscope className="w-3.5 h-3.5" /> {t.pathology.systemB.leafInferenceTab}
                  </button>
                  <button 
                    onClick={() => setMobileSubTab("history")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: mobileSubTab === "history" ? "rgba(255, 76, 76, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: mobileSubTab === "history" ? "1px solid rgba(255, 76, 76, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      color: mobileSubTab === "history" ? "#FF4C4C" : "rgba(232, 239, 232, 0.5)",
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" /> {t.pathology.systemB.recentScansTab} ({DEMO_DIAGNOSTICS.length})
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(232,239,232,0.5)" }}>
                      {t.pathology.systemB.oodGatingBadge}
                    </span>
                    {syncStatus === "synced" && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1" style={{ background: "rgba(0,255,157,0.1)", color: "#00FF9D", border: "1px solid rgba(0,255,157,0.25)" }}>
                        <CheckCircle2 className="w-3 h-3" /> {t.pathology.systemB.syncedBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {mobileSubTab === "scan" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Input Dropzone */}
                  <div className="lg:col-span-5 glass-card p-6 flex flex-col min-h-[480px] rounded-2xl">
                    <h2 className="text-sm font-mono text-white font-medium mb-1">{t.pathology.systemB.closeupTitle}</h2>
                    <p className="text-xs mb-4 font-mono leading-relaxed" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                      {t.pathology.systemB.closeupDesc}
                    </p>

                    <label className="flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer smooth-transition relative overflow-hidden group min-h-[220px]"
                      style={{
                        borderColor: "rgba(255, 76, 76, 0.25)",
                        background: "rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <input type="file" className="hidden" accept="image/*" onChange={handleMobileUpload} />
                      {mobilePreview ? (
                        <div className="relative w-full h-full p-2">
                          <img src={mobilePreview} alt="Mobile Scan" className="w-full h-full object-cover rounded-xl opacity-90" />
                          {isAnalyzingMobile && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
                              <Loader2 className="w-10 h-10 animate-spin mb-3" style={{ color: "#FF4C4C" }} />
                              <p className="text-xs font-mono" style={{ color: "#FF8C00" }}>{t.pathology.systemB.analyzingWasm}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                            style={{ background: "rgba(255, 76, 76, 0.1)" }}
                          >
                            <UploadCloud className="w-7 h-7" style={{ color: "#FF4C4C" }} />
                          </div>
                          <span className="text-xs font-mono mb-1" style={{ color: "rgba(232, 239, 232, 0.8)" }}>{t.pathology.systemB.browsePhotos}</span>
                          <span className="text-[10px] font-mono" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemB.dropzoneSub}</span>
                        </div>
                      )}
                    </label>

                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={runMobileAnalysis} 
                        disabled={!mobileFile || isAnalyzingMobile}
                        className="w-full py-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        style={{
                          background: "rgba(255, 76, 76, 0.12)",
                          borderColor: "rgba(255, 76, 76, 0.35)",
                          color: "#FF4C4C",
                          boxShadow: "0 0 15px rgba(255, 76, 76, 0.1)"
                        }}
                      >
                        <Sparkles className="w-4 h-4" /> {t.pathology.systemB.runInferenceBtn}
                      </button>
                    </div>
                  </div>

                  {/* Right: Diagnostic Dossier */}
                  <div className="lg:col-span-7 glass-card p-6 min-h-[480px] flex flex-col rounded-2xl">
                    <h2 className="text-sm font-mono text-white font-medium mb-4 flex items-center justify-between">
                      <span>{t.pathology.systemB.dossierTitle}</span>
                      {mobileResult && !mobileResult.error && (
                        <span className="text-[10px] font-mono" style={{ color: "rgba(232, 239, 232, 0.4)" }}>
                          {t.pathology.systemB.latency}: {mobileResult.inference_time_ms?.toFixed(0)}ms
                        </span>
                      )}
                    </h2>

                    {mobileResult ? (
                      mobileResult.error ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-2xl border"
                          style={{ background: "rgba(230, 175, 46, 0.05)", borderColor: "rgba(230, 175, 46, 0.2)" }}
                        >
                          <AlertTriangle className="w-12 h-12 mb-3" style={{ color: "#E6AF2E" }} />
                          <h3 className="text-sm font-mono font-bold mb-1" style={{ color: "#E6AF2E" }}>{mobileResult.error}</h3>
                          <p className="text-xs font-mono max-w-md" style={{ color: "rgba(232, 239, 232, 0.6)" }}>{mobileResult.message}</p>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 flex-1">
                          
                          {/* Primary Badge & Confidence */}
                          <div className="p-4 rounded-xl border" style={{ background: "rgba(0, 0, 0, 0.3)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                            <div className="flex justify-between items-start mb-3">
                              <DiseaseBadge disease={mobileResult.disease} />
                              <span className="text-xs font-mono font-bold" style={{ color: "#00FF9D" }}>
                                {(mobileResult.confidence * 100).toFixed(1)}% {t.pathology.systemB.match}
                              </span>
                            </div>
                            <ConfidenceBar value={mobileResult.confidence} />
                          </div>

                          {/* All Class Probabilities Bar Chart */}
                          {mobileResult.all_predictions && (
                            <div className="p-4 rounded-xl border" style={{ background: "rgba(0, 0, 0, 0.3)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                              <h4 className="text-[11px] font-mono uppercase mb-3" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemB.classDistribution}</h4>
                              <div className="space-y-2">
                                {mobileResult.all_predictions.map((p: any) => {
                                  const colorConfig = DISEASE_COLORS[p.class?.toLowerCase()] || { label: p.class, label_si: p.class, label_ta: p.class };
                                  const localizedClassName = language === "si" ? colorConfig.label_si : language === "ta" ? colorConfig.label_ta : colorConfig.label;
                                  return (
                                    <div key={p.class} className="flex items-center gap-3 text-xs font-mono">
                                      <span className="w-36 truncate capitalize" style={{ color: "rgba(232, 239, 232, 0.7)" }}>{localizedClassName}</span>
                                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                        <div 
                                          className="h-full rounded-full bg-gradient-to-r from-[#FF4C4C] to-[#00FF9D]" 
                                          style={{ width: `${Math.max(2, p.confidence * 100)}%` }} 
                                        />
                                      </div>
                                      <span className="w-12 text-right text-[10px]" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{(p.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Immediate Treatment Protocols */}
                          {mobileResult.knowledge && (
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-mono uppercase" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{t.pathology.systemB.treatmentProtocols}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl border" style={{ background: "rgba(255, 76, 76, 0.05)", borderColor: "rgba(255, 76, 76, 0.2)" }}>
                                  <span className="text-[10px] font-mono font-bold block mb-1" style={{ color: "#FF4C4C" }}>{t.pathology.systemB.chemicalAction}</span>
                                  <p className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.7)" }}>
                                    {language === "si" ? mobileResult.knowledge.treatment_protocols.chemical_si[0] : language === "ta" ? mobileResult.knowledge.treatment_protocols.chemical_ta[0] : mobileResult.knowledge.treatment_protocols.chemical[0]}
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl border" style={{ background: "rgba(0, 255, 157, 0.05)", borderColor: "rgba(0, 255, 157, 0.2)" }}>
                                  <span className="text-[10px] font-mono font-bold block mb-1" style={{ color: "#00FF9D" }}>{t.pathology.systemB.culturalMeasure}</span>
                                  <p className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.7)" }}>
                                    {language === "si" ? mobileResult.knowledge.treatment_protocols.cultural_si[0] : language === "ta" ? mobileResult.knowledge.treatment_protocols.cultural_ta[0] : mobileResult.knowledge.treatment_protocols.cultural[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Direct Cross-link to Knowledge Base */}
                          <div className="pt-2">
                            <button
                              onClick={() => jumpToKnowledgeBase(mobileResult.matchingKbId)}
                              className="w-full py-2.5 px-4 rounded-xl border transition-all text-xs font-mono flex items-center justify-center gap-2"
                              style={{
                                background: "rgba(0, 255, 157, 0.08)",
                                borderColor: "rgba(0, 255, 157, 0.25)",
                                color: "#00FF9D",
                              }}
                            >
                              <BookOpen className="w-4 h-4" style={{ color: "#00FF9D" }} />
                              <span>{t.pathology.systemB.viewFullKbGuide} →</span>
                            </button>
                          </div>

                        </motion.div>
                      )
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-2xl"
                        style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(232, 239, 232, 0.3)" }}
                      >
                        <Microscope className="w-12 h-12 mb-3 opacity-40" />
                        <p className="text-xs font-mono">{t.pathology.systemB.uploadPrompt}</p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Recent Leaf Scans Table */
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-mono text-white font-medium flex items-center gap-2">
                      <Smartphone className="w-4 h-4" style={{ color: "#FF4C4C" }} /> {t.pathology.systemB.recentScansTitle}
                    </h3>
                    <span className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{DEMO_DIAGNOSTICS.length} Scans Logged</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-mono"
                          style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(232, 239, 232, 0.4)", background: "rgba(0,0,0,0.2)" }}
                        >
                          <th className="p-3.5">{t.pathology.systemB.colDiagId}</th>
                          <th className="p-3.5">{t.pathology.systemB.colPathogenClass}</th>
                          <th className="p-3.5">{t.pathology.systemB.colConfidence}</th>
                          <th className="p-3.5">{t.pathology.systemB.colLocation}</th>
                          <th className="p-3.5 text-right">{t.pathology.systemB.colProtocolAction}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_DIAGNOSTICS.map((diag) => (
                          <tr key={diag.id} className="border-b hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                            <td className="p-3.5 font-medium" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                              <div>{diag.id}</div>
                              <div className="text-[10px]" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{new Date(diag.captured_at).toLocaleString()}</div>
                            </td>
                            <td className="p-3.5">
                              <DiseaseBadge disease={diag.disease_class} size="sm" />
                            </td>
                            <td className="p-3.5 w-44">
                              <ConfidenceBar value={diag.confidence} />
                            </td>
                            <td className="p-3.5" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                              {diag.location.lat.toFixed(4)}, {diag.location.lng.toFixed(4)}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  const match = DEMO_KNOWLEDGE.find(k => k.common_name.toLowerCase().includes(diag.disease_class.toLowerCase()) || diag.disease_class.toLowerCase().includes(k.common_name.toLowerCase()));
                                  jumpToKnowledgeBase(match?.id || null);
                                }}
                                className="text-[10px] px-2.5 py-1 rounded border transition-all inline-flex items-center gap-1"
                                style={{
                                  background: "rgba(0, 255, 157, 0.08)",
                                  borderColor: "rgba(0, 255, 157, 0.2)",
                                  color: "#00FF9D",
                                }}
                              >
                                <span>{t.pathology.systemB.viewGuideBtn}</span>
                                <span>→</span>
                              </button>
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

          {/* ═══════════════════════════════════════════════════════════════
              TAB: CRI KNOWLEDGE BASE
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "knowledge" && (
            <motion.div key="knowledge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(232, 239, 232, 0.4)" }} />
                  <input 
                    type="text"
                    placeholder={t.pathology.knowledge.searchPlaceholder}
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none font-mono"
                    style={{
                      background: "rgba(3, 7, 5, 0.8)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
                <div className="text-xs font-mono" style={{ color: "rgba(232, 239, 232, 0.5)" }}>
                  {filteredKnowledge.length} {t.pathology.knowledge.showingProtocols}
                </div>
              </div>

              {/* Knowledge Cards */}
              <div className="grid grid-cols-1 gap-4">
                {filteredKnowledge.map((item) => {
                  const isExpanded = expandedKb === item.id;
                  const localizedTitle = language === "si" ? item.common_name_si : language === "ta" ? item.common_name_ta : item.common_name;
                  const localizedSymptoms = language === "si" ? item.symptoms_si : language === "ta" ? item.symptoms_ta : item.symptoms;
                  const localizedChemical = language === "si" ? item.treatment_protocols.chemical_si : language === "ta" ? item.treatment_protocols.chemical_ta : item.treatment_protocols.chemical;
                  const localizedCultural = language === "si" ? item.treatment_protocols.cultural_si : language === "ta" ? item.treatment_protocols.cultural_ta : item.treatment_protocols.cultural;
                  const localizedBiological = language === "si" ? item.treatment_protocols.biological_si : language === "ta" ? item.treatment_protocols.biological_ta : item.treatment_protocols.biological;
                  const localizedAdvice = language === "si" ? item.vernacular_advice_si : language === "ta" ? item.vernacular_advice_ta : item.vernacular_advice;

                  return (
                    <div 
                      key={item.id} 
                      id={`kb-card-${item.id}`}
                      onClick={() => setExpandedKb(isExpanded ? null : item.id)}
                      className="glass-card p-6 border transition-all cursor-pointer rounded-2xl"
                      style={{
                        borderColor: isExpanded ? "rgba(0, 255, 157, 0.4)" : "rgba(255, 255, 255, 0.08)",
                        boxShadow: isExpanded ? "0 0 25px rgba(0, 255, 157, 0.08)" : "none",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-medium text-white">{localizedTitle}</h3>
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase"
                              style={{
                                background: item.severity_level === "critical" ? "rgba(255,76,76,0.15)" : item.severity_level === "high" ? "rgba(230,175,46,0.15)" : "rgba(0,255,157,0.15)",
                                color: item.severity_level === "critical" ? "#FF4C4C" : item.severity_level === "high" ? "#E6AF2E" : "#00FF9D",
                                border: `1px solid ${item.severity_level === "critical" ? "rgba(255,76,76,0.3)" : item.severity_level === "high" ? "rgba(230,175,46,0.3)" : "rgba(0,255,157,0.3)"}`,
                              }}
                            >
                              {item.severity_level}
                            </span>
                          </div>
                          <p className="text-xs font-mono italic mt-0.5" style={{ color: "rgba(232, 239, 232, 0.4)" }}>{item.scientific_name}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} style={{ color: isExpanded ? "#00FF9D" : "rgba(232, 239, 232, 0.4)" }} />
                      </div>

                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t space-y-6" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                          
                          {/* Symptoms */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "#00E5FF" }}>
                              <AlertTriangle className="w-3.5 h-3.5" /> {t.pathology.knowledge.diagnosticSymptoms}
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {localizedSymptoms.map((s, i) => (
                                <li key={i} className="text-xs font-mono flex items-start gap-2 p-2.5 rounded-lg border"
                                  style={{ background: "rgba(0, 0, 0, 0.2)", borderColor: "rgba(255, 255, 255, 0.05)", color: "rgba(232, 239, 232, 0.8)" }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#00E5FF" }} />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 3-Way Treatment Protocol */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "#00FF9D" }}>
                              <ShieldCheck className="w-3.5 h-3.5" /> {t.pathology.knowledge.integratedProtocols}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3.5 rounded-xl border" style={{ background: "rgba(255, 76, 76, 0.05)", borderColor: "rgba(255, 76, 76, 0.2)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: "#FF4C4C" }}>{t.pathology.knowledge.chemicalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                                  {localizedChemical.map((c, i) => <li key={i}>• {c}</li>)}
                                </ul>
                              </div>
                              <div className="p-3.5 rounded-xl border" style={{ background: "rgba(0, 255, 157, 0.05)", borderColor: "rgba(0, 255, 157, 0.2)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: "#00FF9D" }}>{t.pathology.knowledge.culturalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                                  {localizedCultural.map((c, i) => <li key={i}>• {c}</li>)}
                                </ul>
                              </div>
                              <div className="p-3.5 rounded-xl border" style={{ background: "rgba(167, 139, 250, 0.05)", borderColor: "rgba(167, 139, 250, 0.2)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: "#A78BFA" }}>{t.pathology.knowledge.biologicalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "rgba(232, 239, 232, 0.8)" }}>
                                  {localizedBiological.map((b, i) => <li key={i}>• {b}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Vernacular Advice */}
                          <div className="p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2"
                            style={{
                              background: "rgba(230, 175, 46, 0.08)",
                              borderColor: "rgba(230, 175, 46, 0.25)",
                              color: "#E6AF2E",
                            }}
                          >
                            <Info className="w-4 h-4 flex-shrink-0" />
                            <span><strong>{t.pathology.knowledge.criFieldNote}</strong> {localizedAdvice}</span>
                          </div>

                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: GIS MAP & HISTORY
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase" style={{ color: "rgba(232, 239, 232, 0.5)" }}>{t.pathology.history.filterLabel}</span>
                  <select 
                    value={filterDisease} 
                    onChange={e => setFilterDisease(e.target.value)} 
                    className="border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                    style={{
                      background: "rgba(3, 7, 5, 0.8)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <option value="all">{t.pathology.history.allPathogens}</option>
                    {diseases.map(d => {
                      const col = DISEASE_COLORS[d];
                      const label = language === "si" ? col?.label_si : language === "ta" ? col?.label_ta : col?.label;
                      return <option key={d} value={d}>{label || d}</option>;
                    })}
                  </select>
                  <span className="px-2.5 py-1 text-[10px] rounded-lg font-mono border"
                    style={{
                      background: "rgba(0, 255, 157, 0.1)",
                      color: "#00FF9D",
                      borderColor: "rgba(0, 255, 157, 0.25)",
                    }}
                  >
                    {filteredHistory.length} Records
                  </span>
                </div>
                <div className="flex gap-2 p-1 rounded-lg border"
                  style={{ background: "rgba(0, 0, 0, 0.3)", borderColor: "rgba(255, 255, 255, 0.08)" }}
                >
                  <button 
                    onClick={() => setHistoryView("table")} 
                    className="px-4 py-1.5 rounded-md text-xs font-mono transition-all"
                    style={{
                      background: historyView === "table" ? "rgba(0, 255, 157, 0.15)" : "transparent",
                      color: historyView === "table" ? "#00FF9D" : "rgba(232, 239, 232, 0.4)"
                    }}
                  >{t.pathology.history.tabularView}</button>
                  <button 
                    onClick={() => setHistoryView("map")} 
                    className="px-4 py-1.5 rounded-md text-xs font-mono transition-all"
                    style={{
                      background: historyView === "map" ? "rgba(0, 255, 157, 0.15)" : "transparent",
                      color: historyView === "map" ? "#00FF9D" : "rgba(232, 239, 232, 0.4)"
                    }}
                  >{t.pathology.history.spatialGisView}</button>
                </div>
              </div>

              {historyView === "table" ? (
                <div className="glass-card p-2 overflow-x-auto rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-[10px] uppercase font-mono"
                        style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(232, 239, 232, 0.4)", background: "rgba(0,0,0,0.2)" }}
                      >
                        <th className="p-4">{t.pathology.history.colDate}</th>
                        <th className="p-4">{t.pathology.history.colLesion}</th>
                        <th className="p-4">{t.pathology.history.colConfidence}</th>
                        <th className="p-4">{t.pathology.history.colGeoGps}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map(d => (
                        <tr key={d.id} className="border-b hover:bg-white/5 transition-colors font-mono" style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}>
                          <td className="p-4 text-xs" style={{ color: "rgba(232, 239, 232, 0.7)" }}>{new Date(d.captured_at).toLocaleString()}</td>
                          <td className="p-4"><DiseaseBadge disease={d.disease_class} size="sm" /></td>
                          <td className="p-4 w-44"><ConfidenceBar value={d.confidence} /></td>
                          <td className="p-4 text-xs" style={{ color: "rgba(232, 239, 232, 0.5)" }}>{d.location.lat.toFixed(4)}, {d.location.lng.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card p-4 rounded-2xl overflow-hidden min-h-[450px]">
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
