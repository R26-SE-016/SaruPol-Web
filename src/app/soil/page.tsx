"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  FlaskConical, Beaker, Droplets, Leaf, ArrowRight, RotateCcw,
  Sparkles, Layers, ShieldAlert, CheckCircle2, AlertTriangle,
  Compass, Map, Trash2, Camera, UploadCloud, RefreshCw, Send,
  Info, Sliders, ChevronRight, HelpCircle, FileText, CheckCircle,
  Activity, Zap, BookOpen, Globe
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { soil as soilApi } from "@/lib/api";
import { 
  SoilTestRecord, 
  NutrientScanRecord, 
  LabCalculationRecord,
  SOIL_DEFICIENCIES_GUIDE,
  SOIL_PRESETS,
  getUserSoilTests,
  saveUserSoilTest,
  deleteUserSoilTest,
  clearAllUserSoilTests,
  getUserNutrientScans,
  saveUserNutrientScan,
  deleteUserNutrientScan,
  getUserLabCalculations,
  saveUserLabCalculation,
  deleteUserLabCalculation
} from "@/lib/soil-storage";

// Lazy load Soil GIS Map
const SoilTelemetryMapInner = dynamic(() => import("@/components/soil/SoilTelemetryMap"), { ssr: false });

type SoilTabType = "triangulation" | "visual_ai" | "lab_dfr" | "deficiencies" | "history";

interface NPKPoint {
  N: string; P: string; K: string; pH: string;
  moisture?: string; temperature?: string; EC?: string;
}

const defaultPoint = (): NPKPoint => ({ N: "0.0159", P: "0.3430", K: "0.0629", pH: "6.5", moisture: "45", temperature: "28.5", EC: "1.2" });

export default function SoilPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Active Navigation Tab
  const [tab, setTab] = useState<SoilTabType>("triangulation");

  // ══════════════════════════════════════════════════════════════════════
  // TAB 1 STATE: 3-Point Spatial Triangulation
  // ══════════════════════════════════════════════════════════════════════
  const [samplingMode, setSamplingMode] = useState<"triangulated" | "single">("triangulated");
  const [treeNo, setTreeNo] = useState("42");
  const [zoneId, setZoneId] = useState("Block 4 - North Sector");
  const [estateName, setEstateName] = useState("Makandura Research Estate");
  const [pointA, setPointA] = useState<NPKPoint>({ N: "0.0142", P: "0.3210", K: "0.0520", pH: "5.8", moisture: "42", temperature: "27.5", EC: "1.1" });
  const [pointB, setPointB] = useState<NPKPoint>({ N: "0.0150", P: "0.3180", K: "0.0540", pH: "5.9", moisture: "44", temperature: "27.8", EC: "1.2" });
  const [pointC, setPointC] = useState<NPKPoint>({ N: "0.0138", P: "0.3250", K: "0.0510", pH: "5.7", moisture: "40", temperature: "28.0", EC: "1.1" });
  const [singlePoint, setSinglePoint] = useState<NPKPoint>(defaultPoint());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triangulationResult, setTriangulationResult] = useState<SoilTestRecord | null>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  // ══════════════════════════════════════════════════════════════════════
  // TAB 2 STATE: Visual Nutrient Deficiency Scanner (CV)
  // ══════════════════════════════════════════════════════════════════════
  const [visualFile, setVisualFile] = useState<File | null>(null);
  const [visualPreview, setVisualPreview] = useState<string | null>(null);
  const [isScanningVisual, setIsScanningVisual] = useState(false);
  const [visualResult, setVisualResult] = useState<NutrientScanRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ══════════════════════════════════════════════════════════════════════
  // TAB 3 STATE: Certified Laboratory DFR Calculator
  // ══════════════════════════════════════════════════════════════════════
  const [labNitrogen, setLabNitrogen] = useState("1.85");
  const [labPhosphorus, setLabPhosphorus] = useState("0.12");
  const [labPotassium, setLabPotassium] = useState("1.15");
  const [labMagnesium, setLabMagnesium] = useState("0.28");
  const [labPalmAge, setLabPalmAge] = useState("12");
  const [labZone, setLabZone] = useState("Intermediate");
  const [isCalculatingLab, setIsCalculatingLab] = useState(false);
  const [labResult, setLabResult] = useState<LabCalculationRecord | null>(null);

  // ══════════════════════════════════════════════════════════════════════
  // TAB 4 STATE: Agro-Ecological GIS Zone Resolver
  // ══════════════════════════════════════════════════════════════════════
  const [geoLat, setGeoLat] = useState("7.3275");
  const [geoLng, setGeoLng] = useState("79.9880");
  const [isResolvingZone, setIsResolvingZone] = useState(false);
  const [resolvedZoneInfo, setResolvedZoneInfo] = useState<{ zone: string; aez: string; message: string } | null>(null);
  const [selectedDeficiency, setSelectedDeficiency] = useState<string>("nitrogen");

  // ══════════════════════════════════════════════════════════════════════
  // TAB 5 STATE: Soil Telemetry History
  // ══════════════════════════════════════════════════════════════════════
  const [historyView, setHistoryView] = useState<"table" | "map">("table");
  const [soilTestsList, setSoilTestsList] = useState<SoilTestRecord[]>([]);
  const [nutrientScansList, setNutrientScansList] = useState<NutrientScanRecord[]>([]);
  const [labCalcsList, setLabCalcsList] = useState<LabCalculationRecord[]>([]);
  const [filterZone, setFilterZone] = useState<string>("all");

  // Sync telemetry with active user
  useEffect(() => {
    if (user) {
      setSoilTestsList(getUserSoilTests(user.id, user.email));
      setNutrientScansList(getUserNutrientScans(user.id, user.email));
      setLabCalcsList(getUserLabCalculations(user.id, user.email));
    } else {
      setSoilTestsList([]);
      setNutrientScansList([]);
      setLabCalcsList([]);
    }
  }, [user]);

  // Load Preset
  const handleLoadPreset = (preset: typeof SOIL_PRESETS[0]) => {
    setTreeNo(String(preset.treeNo));
    setZoneId(preset.zone);
    setEstateName(preset.name);
    setPointA({
      N: String(preset.pointA.N),
      P: String(preset.pointA.P),
      K: String(preset.pointA.K),
      pH: String(preset.pointA.pH),
      moisture: String(preset.pointA.moisture),
      temperature: String(preset.pointA.temperature),
      EC: String(preset.pointA.EC),
    });
    setPointB({
      N: String(preset.pointB.N),
      P: String(preset.pointB.P),
      K: String(preset.pointB.K),
      pH: String(preset.pointB.pH),
      moisture: String(preset.pointB.moisture),
      temperature: String(preset.pointB.temperature),
      EC: String(preset.pointB.EC),
    });
    setPointC({
      N: String(preset.pointC.N),
      P: String(preset.pointC.P),
      K: String(preset.pointC.K),
      pH: String(preset.pointC.pH),
      moisture: String(preset.pointC.moisture),
      temperature: String(preset.pointC.temperature),
      EC: String(preset.pointC.EC),
    });
  };

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS: Tab 1 (Spatial Triangulation)
  // ══════════════════════════════════════════════════════════════════════
  const handleRunTriangulation = async () => {
    setIsAnalyzing(true);
    try {
      let resultData: any;
      if (samplingMode === "triangulated") {
        const payload = {
          tree_no: parseInt(treeNo) || 30,
          zone_id: zoneId,
          point_a: { N: parseFloat(pointA.N) || 0.015, P: parseFloat(pointA.P) || 0.34, K: parseFloat(pointA.K) || 0.06, pH: parseFloat(pointA.pH) || 6.5 },
          point_b: { N: parseFloat(pointB.N) || 0.015, P: parseFloat(pointB.P) || 0.34, K: parseFloat(pointB.K) || 0.06, pH: parseFloat(pointB.pH) || 6.5 },
          point_c: { N: parseFloat(pointC.N) || 0.015, P: parseFloat(pointC.P) || 0.34, K: parseFloat(pointC.K) || 0.06, pH: parseFloat(pointC.pH) || 6.5 },
        };
        resultData = await soilApi.predictTriangulated(payload);
      } else {
        const payload = {
          tree_no: parseInt(treeNo) || 30,
          zone_id: zoneId,
          reading: { N: parseFloat(singlePoint.N) || 0.015, P: parseFloat(singlePoint.P) || 0.34, K: parseFloat(singlePoint.K) || 0.06, pH: parseFloat(singlePoint.pH) || 6.5 },
        };
        resultData = await soilApi.predictSingle(payload);
      }

      // Map response to telemetry record
      const record: SoilTestRecord = {
        id: `soil-${Date.now()}`,
        tree_no: resultData.tree_no || treeNo,
        zone_id: zoneId,
        estate_name: estateName,
        sampling_method: resultData.sampling_method || (samplingMode === "triangulated" ? "3-Point Spatial Triangulation" : "Single Point Rapid Sensor"),
        point_a: { N: parseFloat(pointA.N), P: parseFloat(pointA.P), K: parseFloat(pointA.K), pH: parseFloat(pointA.pH) },
        point_b: { N: parseFloat(pointB.N), P: parseFloat(pointB.P), K: parseFloat(pointB.K), pH: parseFloat(pointB.pH) },
        point_c: { N: parseFloat(pointC.N), P: parseFloat(pointC.P), K: parseFloat(pointC.K), pH: parseFloat(pointC.pH) },
        average_soil_npk: resultData.average_soil_npk || {
          N: (parseFloat(pointA.N) + parseFloat(pointB.N) + parseFloat(pointC.N)) / 3,
          P: (parseFloat(pointA.P) + parseFloat(pointB.P) + parseFloat(pointC.P)) / 3,
          K: (parseFloat(pointA.K) + parseFloat(pointB.K) + parseFloat(pointC.K)) / 3,
          pH: parseFloat(pointA.pH),
        },
        predicted_14th_leaf_npk: resultData.predicted_14th_leaf_npk || { N: 1.88, P: 0.12, K: 1.25 },
        health_status: resultData.health_status || "Balanced CRI Nutrition",
        fertilizer_recommendation: resultData.fertilizer_recommendation_grams_per_year || {
          Urea: 1000,
          Eppawala_Rock_Phosphate_ERP: 600,
          Muriate_of_Potash_MOP: 2000,
          Dolomite: 1000,
        },
        nutrient_evaluation: resultData.nutrient_evaluation || {
          Nitrogen_N: "Optimal",
          Phosphorus_P: "Optimal",
          Potassium_K: "Moderate Deficit",
          Soil_pH: "Optimal",
        },
        agronomic_advice: resultData.agronomic_advice || [
          "Apply fertilizer in a circular band 1.8m away from trunk base.",
          "Split application equally between Yala and Maha monsoons.",
        ],
        model_used: resultData.model_used || "Random Forest Multi-Output Regression (R26-SE-016 Engine)",
        location: { lat: 7.3275 + (Math.random() - 0.5) * 0.01, lng: 79.9880 + (Math.random() - 0.5) * 0.01 },
        captured_at: new Date().toISOString(),
        user_id: user?.id ? String(user.id) : "guest",
        user_email: user?.email,
      };

      setTriangulationResult(record);
      const updated = saveUserSoilTest(record);
      setSoilTestsList(updated);

      setDispatchAlert(`CRI DFR Recommendation generated for Tree #${record.tree_no}. Saved to telemetry history.`);
      setTimeout(() => setDispatchAlert(null), 6000);
    } catch (e: any) {
      console.error("Triangulation error:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS: Tab 2 (Visual Nutrient CV Scanner)
  // ══════════════════════════════════════════════════════════════════════
  const handleVisualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVisualFile(file);
      const reader = new FileReader();
      reader.onload = () => setVisualPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRunVisualScan = async () => {
    if (!visualFile) return;
    setIsScanningVisual(true);
    try {
      const formData = new FormData();
      formData.append("file", visualFile);
      const res = await soilApi.predictVisualNutrient(formData);

      const scanRecord: NutrientScanRecord = {
        id: `scan-${Date.now()}`,
        user_id: user?.id ? String(user.id) : "guest",
        user_email: user?.email,
        estate_name: estateName,
        palm_age: "12-15 Years",
        palm_stage: "Adult Bearing",
        zone: "Intermediate Zone (IL1a)",
        image_preview: visualPreview || undefined,
        nutrient: res.prediction?.nutrient || "Potassium",
        class_name: res.prediction?.class || "Potassium Deficiency",
        confidence: res.prediction?.confidence || 0.89,
        advice: res.recommendation?.advice || "Apply an additional 500g of MOP per palm. Bury coconut husks in trenches between rows to recycle potassium.",
        assessment_type: res.recommendation?.assessment_type || "CRI Visual Protocol",
        visual_features: res.visual_features || {
          chlorosis_index: 0.76,
          yellowing_extent: 0.65,
          necrosis_score: 0.22,
        },
        location: { lat: 7.3275, lng: 79.9880 },
        captured_at: new Date().toISOString(),
      };

      setVisualResult(scanRecord);
      const updated = saveUserNutrientScan(scanRecord);
      setNutrientScansList(updated);
    } catch (e: any) {
      console.error("Visual scan error:", e);
    } finally {
      setIsScanningVisual(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS: Tab 3 (Certified Laboratory DFR Calculator)
  // ══════════════════════════════════════════════════════════════════════
  const handleCalculateLabDFR = async () => {
    setIsCalculatingLab(true);
    try {
      const payload = {
        nitrogen: parseFloat(labNitrogen) || 1.8,
        phosphorus: parseFloat(labPhosphorus) || 0.12,
        potassium: parseFloat(labPotassium) || 1.2,
        magnesium: parseFloat(labMagnesium) || 0.25,
        palm_age: parseFloat(labPalmAge) || 10,
        zone: labZone,
      };
      const res = await soilApi.recommendLab(payload);

      const labRec: LabCalculationRecord = {
        id: `lab-${Date.now()}`,
        user_id: user?.id ? String(user.id) : "guest",
        user_email: user?.email,
        estate_name: estateName,
        nitrogen: payload.nitrogen,
        phosphorus: payload.phosphorus,
        potassium: payload.potassium,
        magnesium: payload.magnesium,
        palm_age: payload.palm_age,
        zone: labZone,
        urea: res.urea || 1000,
        erp_or_tsp: res.erp_or_tsp || 600,
        mop: res.mop || 2000,
        dolomite: res.dolomite || 1000,
        phosphate_type: res.phosphate_type || "ERP",
        evalN: res.evalN || "Optimal",
        evalP: res.evalP || "Optimal",
        evalK: res.evalK || "Sub-Optimal",
        evalMg: res.evalMg || "Optimal",
        health_status: res.health_status || "Differential Fertilizer Prescription Calculated",
        agronomic_advice: res.agronomic_advice || [
          "Apply fertilizer mixture in a 1.8m circular basin around the trunk.",
          "Apply Dolomite at least 4 weeks separately from Urea to prevent ammonia volatilization.",
        ],
        captured_at: new Date().toISOString(),
      };

      setLabResult(labRec);
      const updated = saveUserLabCalculation(labRec);
      setLabCalcsList(updated);
    } catch (e: any) {
      console.error("Lab DFR error:", e);
    } finally {
      setIsCalculatingLab(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS: Tab 4 (Agro-Ecological GIS Zone Resolver)
  // ══════════════════════════════════════════════════════════════════════
  const handleResolveAgroZone = async () => {
    setIsResolvingZone(true);
    try {
      const res = await soilApi.getAgroZone(parseFloat(geoLat) || 7.29, parseFloat(geoLng) || 80.63);
      setResolvedZoneInfo({
        zone: res.zone || "Intermediate Zone",
        aez: res.agro_ecological_zone || "IL1a (Intermediate Lowlands)",
        message: res.message || "Agro-ecological zone resolved successfully from NSDI GIS.",
      });
    } catch (e: any) {
      console.error("Zone resolve error:", e);
    } finally {
      setIsResolvingZone(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS: History Deletions
  // ══════════════════════════════════════════════════════════════════════
  const handleDeleteSoilTest = (id: string) => {
    const updated = deleteUserSoilTest(id, user?.id, user?.email);
    setSoilTestsList(updated);
  };

  const handleClearAllSoilTests = () => {
    if (window.confirm("Are you sure you want to delete all soil test records?")) {
      const updated = clearAllUserSoilTests(user?.id);
      setSoilTestsList(updated);
    }
  };

  const handleDeleteNutrientScan = (id: string) => {
    const updated = deleteUserNutrientScan(id, user?.id, user?.email);
    setNutrientScansList(updated);
  };

  const handleDeleteLabCalc = (id: string) => {
    const updated = deleteUserLabCalculation(id, user?.id, user?.email);
    setLabCalcsList(updated);
  };

  // Filtered History
  const filteredSoilTests = soilTestsList.filter(t => {
    if (filterZone === "all") return true;
    return t.zone_id.toLowerCase().includes(filterZone.toLowerCase()) || t.estate_name.toLowerCase().includes(filterZone.toLowerCase());
  });

  return (
    <AuthGuard>
      <main className="min-h-screen relative selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 relative z-10">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: "rgba(0, 255, 157, 0.12)", border: "1px solid rgba(0, 255, 157, 0.3)" }}
                >
                  <FlaskConical className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    Soil Nutrition Intelligence System
                  </h1>
                  <p className="text-xs font-mono tracking-wider uppercase font-semibold text-emerald-400">
                    CRI Differential Fertilizer Recommendation (DFR) & AI Regression Engine
                  </p>
                </div>
              </div>
              <p className="text-xs font-mono max-w-2xl leading-relaxed text-gray-400">
                Stage 1 Machine Learning maps real-time 7-in-1 IoT soil sensors to 14th frond leaf NPK. Stage 2 CRI Expert System computes precise chemical dosages under Advisory Circular A5.
              </p>
            </div>

            {/* Quick Engine Meta */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl border flex items-center gap-2"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Backend: <strong className="text-emerald-400">Cloud Run FastApi (5003)</strong></span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 p-1.5 rounded-2xl border backdrop-blur-xl grid grid-cols-2 md:grid-cols-5 gap-1.5 shadow-xl"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            {[
              { id: "triangulation" as const, label: "3-Point Triangulation", icon: Layers, color: "#00FF9D", badge: null },
              { id: "visual_ai" as const, label: "Visual Frond Scanner", icon: Camera, color: "#00E5FF", badge: "AI CV" },
              { id: "lab_dfr" as const, label: "Laboratory DFR", icon: Beaker, color: "#E6AF2E", badge: "CRI A5" },
              { id: "deficiencies" as const, label: "Deficiencies & GIS", icon: BookOpen, color: "#A78BFA", badge: null },
              { id: "history" as const, label: `Telemetry (${soilTestsList.length})`, icon: Map, color: "#FF4C4C", badge: null },
            ].map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-mono transition-all text-center relative font-medium"
                style={{
                  background: tab === tabItem.id ? (theme === "dark" ? "rgba(0, 255, 157, 0.08)" : "rgba(0, 168, 107, 0.12)") : "transparent",
                  color: tab === tabItem.id ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
                  border: tab === tabItem.id ? "1px solid var(--card-hover-border)" : "1px solid transparent",
                  boxShadow: tab === tabItem.id ? "var(--card-shadow)" : "none"
                }}
              >
                <tabItem.icon className="w-4 h-4 flex-shrink-0" style={{ color: tab === tabItem.id ? tabItem.color : "inherit" }} />
                <span className="truncate">{tabItem.label}</span>
                {tabItem.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {tabItem.badge}
                  </span>
                )}
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
                className="mb-6 p-4 rounded-xl text-xs font-mono flex items-center gap-3 border"
                style={{
                  background: "rgba(0, 255, 157, 0.08)",
                  borderColor: "rgba(0, 255, 157, 0.3)",
                  color: theme === "dark" ? "#00FF9D" : "#00875A",
                  boxShadow: "0 0 20px rgba(0, 255, 157, 0.1)",
                }}
              >
                <Send className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>{dispatchAlert}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═════════════════════════════════════════════════════════════════
              TAB 1: 3-POINT SPATIAL TRIANGULATION (IoT SENSOR SAMPLING)
             ═════════════════════════════════════════════════════════════════ */}
          {tab === "triangulation" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              {/* Presets & Config Bar */}
              <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Sliders className="w-4 h-4 text-emerald-400" /> CRI Experimental Soil Presets
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">
                    Load empirical soil calibration benchmarks from the Coconut Research Institute Makandura and Puttalam fields.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {SOIL_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLoadPreset(p)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all hover:scale-105"
                      style={{
                        background: estateName === p.name ? "rgba(0, 255, 157, 0.15)" : "var(--input-bg)",
                        borderColor: estateName === p.name ? "#00FF9D" : "var(--card-border)",
                        color: estateName === p.name ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)"
                      }}
                    >
                      {p.name.split(" ")[0]} ({p.zone.split(" ")[0]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher & Palm Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sampling Mode Selector */}
                <div className="glass-card p-5 rounded-2xl space-y-4">
                  <label className="text-xs font-mono uppercase tracking-wider block font-bold text-gray-400">
                    Sampling Methodology
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSamplingMode("triangulated")}
                      className={`p-3 rounded-xl text-xs font-mono border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        samplingMode === "triangulated"
                          ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold shadow-lg"
                          : "bg-black/10 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>3-Point (120°)</span>
                      <span className="text-[9px] opacity-75">Research Grade</span>
                    </button>

                    <button
                      onClick={() => setSamplingMode("single")}
                      className={`p-3 rounded-xl text-xs font-mono border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        samplingMode === "single"
                          ? "bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold shadow-lg"
                          : "bg-black/10 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                      <span>Single Sensor</span>
                      <span className="text-[9px] opacity-75">Rapid Spot Check</span>
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                    {samplingMode === "triangulated"
                      ? "3 sensor readings taken 120° apart along the 1.8m circular manure ring. Eliminates micro-spatial soil heterogeneity."
                      : "Direct single probe insertion inside the manure basin for fast diagnostic checks."}
                  </p>
                </div>

                {/* Palm Metadata */}
                <div className="glass-card p-5 rounded-2xl space-y-4 md:col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wider block font-bold text-gray-400">
                    Palm & Plantation Identification
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Tree Number / ID</span>
                      <input
                        type="text"
                        value={treeNo}
                        onChange={(e) => setTreeNo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border outline-none font-bold"
                        style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }}
                        placeholder="e.g. 42 or MK-101"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Estate Name / Block</span>
                      <input
                        type="text"
                        value={estateName}
                        onChange={(e) => setEstateName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border outline-none"
                        style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }}
                        placeholder="Makandura Estate"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Agro-Climatic Zone</span>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border outline-none"
                        style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }}
                        placeholder="Intermediate Zone"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Point Input Cards */}
              {samplingMode === "triangulated" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Point A */}
                  <div className="glass-card p-5 rounded-2xl border space-y-4" style={{ borderColor: "rgba(0, 255, 157, 0.3)" }}>
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
                        <h4 className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>Point A (0° - North)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">1.8m Ring</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil N (%)</label>
                        <input type="number" step="0.0001" value={pointA.N} onChange={(e) => setPointA({ ...pointA, N: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil P (%)</label>
                        <input type="number" step="0.0001" value={pointA.P} onChange={(e) => setPointA({ ...pointA, P: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil K (%)</label>
                        <input type="number" step="0.0001" value={pointA.K} onChange={(e) => setPointA({ ...pointA, K: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil pH</label>
                        <input type="number" step="0.1" value={pointA.pH} onChange={(e) => setPointA({ ...pointA, pH: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Point B */}
                  <div className="glass-card p-5 rounded-2xl border space-y-4" style={{ borderColor: "rgba(0, 229, 255, 0.3)" }}>
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
                        <h4 className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>Point B (120° - East)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">1.8m Ring</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil N (%)</label>
                        <input type="number" step="0.0001" value={pointB.N} onChange={(e) => setPointB({ ...pointB, N: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil P (%)</label>
                        <input type="number" step="0.0001" value={pointB.P} onChange={(e) => setPointB({ ...pointB, P: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil K (%)</label>
                        <input type="number" step="0.0001" value={pointB.K} onChange={(e) => setPointB({ ...pointB, K: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil pH</label>
                        <input type="number" step="0.1" value={pointB.pH} onChange={(e) => setPointB({ ...pointB, pH: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Point C */}
                  <div className="glass-card p-5 rounded-2xl border space-y-4" style={{ borderColor: "rgba(230, 175, 46, 0.3)" }}>
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                        <h4 className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>Point C (240° - West)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">1.8m Ring</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil N (%)</label>
                        <input type="number" step="0.0001" value={pointC.N} onChange={(e) => setPointC({ ...pointC, N: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil P (%)</label>
                        <input type="number" step="0.0001" value={pointC.P} onChange={(e) => setPointC({ ...pointC, P: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil K (%)</label>
                        <input type="number" step="0.0001" value={pointC.K} onChange={(e) => setPointC({ ...pointC, K: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Soil pH</label>
                        <input type="number" step="0.1" value={pointC.pH} onChange={(e) => setPointC({ ...pointC, pH: e.target.value })} className="w-full p-2 rounded-lg border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Point Sensor Card */
                <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto space-y-4 border border-cyan-500/30">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Single IoT Sensor Probe Reading
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Nitrogen (N %)</label>
                      <input type="number" step="0.0001" value={singlePoint.N} onChange={(e) => setSinglePoint({ ...singlePoint, N: e.target.value })} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Phosphorus (P %)</label>
                      <input type="number" step="0.0001" value={singlePoint.P} onChange={(e) => setSinglePoint({ ...singlePoint, P: e.target.value })} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Potassium (K %)</label>
                      <input type="number" step="0.0001" value={singlePoint.K} onChange={(e) => setSinglePoint({ ...singlePoint, K: e.target.value })} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Soil pH</label>
                      <input type="number" step="0.1" value={singlePoint.pH} onChange={(e) => setSinglePoint({ ...singlePoint, pH: e.target.value })} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Run Analysis Action Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleRunTriangulation}
                  disabled={isAnalyzing}
                  className="px-8 py-3.5 rounded-2xl text-xs font-mono font-bold inline-flex items-center gap-3 transition-all shadow-xl hover:scale-105 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #00FF9D 0%, #00B0FF 100%)",
                    color: "#050B14",
                    boxShadow: "0 0 30px rgba(0, 255, 157, 0.3)",
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Computing Regression & CRI DFR...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Execute 2-Stage AI Regression & Recommendation</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2-STAGE AI OUTPUT DISPLAY */}
              {triangulationResult && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pt-4">
                  
                  {/* Stage 1: Machine Learning Regression Prediction */}
                  <div className="glass-card p-6 rounded-2xl border space-y-6" style={{ borderColor: "rgba(0, 255, 157, 0.3)" }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Stage 1 ML Output
                          </span>
                          <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                            Predicted 14th Frond Foliar NPK (Tree #{triangulationResult.tree_no})
                          </h3>
                        </div>
                        <p className="text-[11px] font-mono text-gray-400 mt-1">
                          Model: {triangulationResult.model_used}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          {triangulationResult.health_status}
                        </span>
                      </div>
                    </div>

                    {/* Nutrient Radials / Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                      {/* Leaf N */}
                      <div className="p-4 rounded-xl border bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Leaf Nitrogen (N)</span>
                        <div className="text-xl font-bold text-cyan-400 my-1">
                          {triangulationResult.predicted_14th_leaf_npk.N.toFixed(2)}%
                        </div>
                        <span className="text-[10px] text-gray-400">Target: 1.80% - 2.00%</span>
                        <div className="mt-2 text-[10px] text-cyan-300 font-medium">
                          {triangulationResult.nutrient_evaluation.Nitrogen_N}
                        </div>
                      </div>

                      {/* Leaf P */}
                      <div className="p-4 rounded-xl border bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Leaf Phosphorus (P)</span>
                        <div className="text-xl font-bold text-emerald-400 my-1">
                          {triangulationResult.predicted_14th_leaf_npk.P.toFixed(2)}%
                        </div>
                        <span className="text-[10px] text-gray-400">Target: 0.12% - 0.15%</span>
                        <div className="mt-2 text-[10px] text-emerald-300 font-medium">
                          {triangulationResult.nutrient_evaluation.Phosphorus_P}
                        </div>
                      </div>

                      {/* Leaf K */}
                      <div className="p-4 rounded-xl border bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Leaf Potassium (K)</span>
                        <div className="text-xl font-bold text-amber-400 my-1">
                          {triangulationResult.predicted_14th_leaf_npk.K.toFixed(2)}%
                        </div>
                        <span className="text-[10px] text-gray-400">Target: 1.20% - 1.50%</span>
                        <div className="mt-2 text-[10px] text-amber-300 font-medium">
                          {triangulationResult.nutrient_evaluation.Potassium_K}
                        </div>
                      </div>

                      {/* Soil pH */}
                      <div className="p-4 rounded-xl border bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Average Soil pH</span>
                        <div className="text-xl font-bold text-purple-400 my-1">
                          {triangulationResult.average_soil_npk.pH.toFixed(1)}
                        </div>
                        <span className="text-[10px] text-gray-400">Target: 5.5 - 6.5</span>
                        <div className="mt-2 text-[10px] text-purple-300 font-medium">
                          {triangulationResult.nutrient_evaluation.Soil_pH}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2: CRI Differential Fertilizer Recommendation (DFR) */}
                  <div className="glass-card p-6 rounded-2xl border space-y-6" style={{ borderColor: "rgba(0, 229, 255, 0.3)" }}>
                    <div className="border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          Stage 2 CRI Expert System
                        </span>
                        <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                          Differential Fertilizer Prescription (g/palm/year)
                        </h3>
                      </div>
                      <p className="text-[11px] font-mono text-gray-400 mt-1">
                        Complies with Coconut Research Institute Advisory Circular A5 differential dosing tables.
                      </p>
                    </div>

                    {/* Chemical Fertilizer Prescription Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                      {/* Urea */}
                      <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ background: "rgba(0, 229, 255, 0.08)", borderColor: "rgba(0, 229, 255, 0.25)" }}>
                        <div>
                          <span className="text-[10px] text-cyan-400 block font-bold uppercase tracking-wider">Urea (46% N)</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">Nitrogen Supply</p>
                        </div>
                        <div className="text-2xl font-bold text-cyan-300 my-3">
                          {triangulationResult.fertilizer_recommendation.Urea} <span className="text-xs font-normal">g/palm</span>
                        </div>
                        <div className="text-[10px] text-gray-400 border-t pt-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                          Yala: {triangulationResult.fertilizer_recommendation.Urea / 2}g | Maha: {triangulationResult.fertilizer_recommendation.Urea / 2}g
                        </div>
                      </div>

                      {/* ERP */}
                      <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ background: "rgba(0, 255, 157, 0.08)", borderColor: "rgba(0, 255, 157, 0.25)" }}>
                        <div>
                          <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider">ERP (28% P₂O₅)</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">Eppawala Rock Phosphate</p>
                        </div>
                        <div className="text-2xl font-bold text-emerald-300 my-3">
                          {triangulationResult.fertilizer_recommendation.Eppawala_Rock_Phosphate_ERP} <span className="text-xs font-normal">g/palm</span>
                        </div>
                        <div className="text-[10px] text-gray-400 border-t pt-1.5" style={{ borderColor: "rgba(0, 255, 157, 0.2)" }}>
                          Yala: {triangulationResult.fertilizer_recommendation.Eppawala_Rock_Phosphate_ERP / 2}g | Maha: {triangulationResult.fertilizer_recommendation.Eppawala_Rock_Phosphate_ERP / 2}g
                        </div>
                      </div>

                      {/* MOP */}
                      <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ background: "rgba(230, 175, 46, 0.08)", borderColor: "rgba(230, 175, 46, 0.25)" }}>
                        <div>
                          <span className="text-[10px] text-amber-400 block font-bold uppercase tracking-wider">MOP (60% K₂O)</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">Muriate of Potash</p>
                        </div>
                        <div className="text-2xl font-bold text-amber-300 my-3">
                          {triangulationResult.fertilizer_recommendation.Muriate_of_Potash_MOP} <span className="text-xs font-normal">g/palm</span>
                        </div>
                        <div className="text-[10px] text-gray-400 border-t pt-1.5" style={{ borderColor: "rgba(230, 175, 46, 0.2)" }}>
                          Yala: {triangulationResult.fertilizer_recommendation.Muriate_of_Potash_MOP / 2}g | Maha: {triangulationResult.fertilizer_recommendation.Muriate_of_Potash_MOP / 2}g
                        </div>
                      </div>

                      {/* Dolomite */}
                      <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ background: "rgba(167, 139, 250, 0.08)", borderColor: "rgba(167, 139, 250, 0.25)" }}>
                        <div>
                          <span className="text-[10px] text-purple-400 block font-bold uppercase tracking-wider">Dolomite (MgO min 18%)</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">pH & Magnesium Balancing</p>
                        </div>
                        <div className="text-2xl font-bold text-purple-300 my-3">
                          {triangulationResult.fertilizer_recommendation.Dolomite} <span className="text-xs font-normal">g/palm</span>
                        </div>
                        <div className="text-[10px] text-gray-400 border-t pt-1.5" style={{ borderColor: "rgba(167, 139, 250, 0.2)" }}>
                          Annual Single Application
                        </div>
                      </div>
                    </div>

                    {/* Agronomic Execution Protocols */}
                    <div className="p-4 rounded-xl bg-black/30 border space-y-2 font-mono text-xs" style={{ borderColor: "var(--card-border)" }}>
                      <h4 className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Official CRI Agronomic Field Application Protocols:
                      </h4>
                      <ul className="space-y-1.5 text-gray-300 text-[11px] list-disc list-inside">
                        {triangulationResult.agronomic_advice.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </motion.div>
              )}

            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              TAB 2: COMPUTER VISION VISUAL NUTRIENT DEFICIENCY SCANNER
             ═════════════════════════════════════════════════════════════════ */}
          {tab === "visual_ai" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6 border border-cyan-500/30">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30">
                    <Camera className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    Foliar Frond Nutrient Deficiency Scanner
                  </h3>
                  <p className="text-xs font-mono text-gray-400 max-w-md mx-auto">
                    Upload a close-up photograph of a coconut frond (leaflets or midrib) to diagnose visual chlorosis, necrosis, or micronutrient deficiencies using Edge/Cloud AI.
                  </p>
                </div>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-cyan-400 group"
                  style={{ borderColor: visualPreview ? "#00E5FF" : "var(--card-border)", background: "rgba(0, 229, 255, 0.04)" }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleVisualFileChange}
                    className="hidden"
                  />

                  {visualPreview ? (
                    <div className="space-y-3">
                      <img
                        src={visualPreview}
                        alt="Frond Preview"
                        className="max-h-64 mx-auto rounded-xl shadow-lg object-cover border"
                        style={{ borderColor: "rgba(0, 229, 255, 0.3)" }}
                      />
                      <p className="text-xs font-mono text-cyan-400 font-medium">Click to select a different image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 opacity-60 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>Drop frond photograph or click to browse</p>
                      <p className="text-[10px] font-mono text-gray-400">JPEG, PNG, or WEBP up to 20MB</p>
                    </div>
                  )}
                </div>

                {/* Scan Action */}
                <div className="flex justify-center">
                  <button
                    onClick={handleRunVisualScan}
                    disabled={!visualFile || isScanningVisual}
                    className="px-8 py-3 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2 transition-all shadow-lg hover:scale-105 disabled:opacity-40"
                    style={{ background: "#00E5FF", color: "#050B14" }}
                  >
                    {isScanningVisual ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Diagnosing Visual Foliar Chlorosis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Visual AI Frond Diagnosis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Visual Diagnostic Output Result */}
              {visualResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto glass-card p-6 rounded-2xl border space-y-6" style={{ borderColor: "rgba(0, 229, 255, 0.4)" }}>
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                        Computer Vision Classification
                      </span>
                      <h3 className="text-base font-mono font-bold text-white mt-0.5">
                        {visualResult.class_name}
                      </h3>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-emerald-400">
                        {(visualResult.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Visual Features Breakdown */}
                  {visualResult.visual_features && (
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-black/30 border text-center" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Chlorosis Index</span>
                        <span className="font-bold text-amber-400">{(visualResult.visual_features.chlorosis_index * 100).toFixed(0)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border text-center" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Yellowing Extent</span>
                        <span className="font-bold text-cyan-400">{(visualResult.visual_features.yellowing_extent * 100).toFixed(0)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border text-center" style={{ borderColor: "var(--card-border)" }}>
                        <span className="text-[10px] text-gray-400 block">Necrosis Score</span>
                        <span className="font-bold text-red-400">{(visualResult.visual_features.necrosis_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5 font-mono text-xs">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> CRI Recommended Corrective Action:
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {visualResult.advice}
                    </p>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              TAB 3: CERTIFIED LABORATORY 14th FROND DFR CALCULATOR
             ═════════════════════════════════════════════════════════════════ */}
          {tab === "lab_dfr" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6 border border-amber-500/30">
                <div className="border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                      Certified Laboratory Foliar Analysis Entry (Advisory Circular A5)
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Direct entry of certified wet-chemistry laboratory reports (14th Frond N, P, K, Mg concentrations) to generate differential fertilizer schedules.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Leaf Nitrogen (% N)</label>
                    <input type="number" step="0.01" value={labNitrogen} onChange={(e) => setLabNitrogen(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    <span className="text-[9px] text-gray-500">Critical: 1.80 - 2.00%</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Leaf Phosphorus (% P)</label>
                    <input type="number" step="0.01" value={labPhosphorus} onChange={(e) => setLabPhosphorus(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    <span className="text-[9px] text-gray-500">Critical: 0.12 - 0.15%</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Leaf Potassium (% K)</label>
                    <input type="number" step="0.01" value={labPotassium} onChange={(e) => setLabPotassium(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    <span className="text-[9px] text-gray-500">Critical: 1.20 - 1.50%</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Leaf Magnesium (% Mg)</label>
                    <input type="number" step="0.01" value={labMagnesium} onChange={(e) => setLabMagnesium(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                    <span className="text-[9px] text-gray-500">Critical: 0.20 - 0.35%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Palm Age (Years)</label>
                    <input type="number" value={labPalmAge} onChange={(e) => setLabPalmAge(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Agro-Climatic Zone</label>
                    <select value={labZone} onChange={(e) => setLabZone(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }}>
                      <option value="Wet">Wet Zone (WL3 / WL2)</option>
                      <option value="Intermediate">Intermediate Zone (IL1a / IL1b)</option>
                      <option value="Dry">Dry Zone (DL1b / DL1a)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleCalculateLabDFR}
                    disabled={isCalculatingLab}
                    className="px-8 py-3 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2 bg-amber-400 text-black shadow-lg hover:scale-105 transition-all disabled:opacity-40"
                  >
                    {isCalculatingLab ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Beaker className="w-4 h-4" />}
                    <span>Calculate Official CRI Circular A5 DFR</span>
                  </button>
                </div>
              </div>

              {/* Lab DFR Result */}
              {labResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto glass-card p-6 rounded-2xl border space-y-6" style={{ borderColor: "rgba(230, 175, 46, 0.4)" }}>
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-400">Prescription Output</span>
                      <h3 className="text-sm font-mono font-bold text-white mt-0.5">{labResult.health_status}</h3>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      Age: {labResult.palm_age} Yrs | {labResult.zone} Zone
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                    <div className="p-3.5 rounded-xl border bg-black/30" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] text-gray-400 block">Urea (46% N)</span>
                      <span className="text-xl font-bold text-cyan-400">{labResult.urea}g</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Eval: {labResult.evalN}</span>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-black/30" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] text-gray-400 block">{labResult.phosphate_type}</span>
                      <span className="text-xl font-bold text-emerald-400">{labResult.erp_or_tsp}g</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Eval: {labResult.evalP}</span>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-black/30" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] text-gray-400 block">MOP (60% K₂O)</span>
                      <span className="text-xl font-bold text-amber-400">{labResult.mop}g</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Eval: {labResult.evalK}</span>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-black/30" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] text-gray-400 block">Dolomite</span>
                      <span className="text-xl font-bold text-purple-400">{labResult.dolomite}g</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Eval: {labResult.evalMg}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border space-y-2 font-mono text-xs" style={{ borderColor: "var(--card-border)" }}>
                    <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Field Application Schedule:
                    </h4>
                    <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
                      {labResult.agronomic_advice.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              TAB 4: AGRO-ECOLOGICAL GIS ZONE RESOLVER & CRI DEFICIENCIES GUIDE
             ═════════════════════════════════════════════════════════════════ */}
          {tab === "deficiencies" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              {/* Agro-Ecological GIS Zone Resolver */}
              <div className="glass-card p-6 rounded-2xl space-y-4 border border-purple-500/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                      Agro-Ecological GIS Zone Resolver (NSDI / CRI Spatial Integration)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Sri Lanka Spatial Boundary Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs items-end">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Estate Latitude</label>
                    <input type="text" value={geoLat} onChange={(e) => setGeoLat(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Estate Longitude</label>
                    <input type="text" value={geoLng} onChange={(e) => setGeoLng(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none font-bold" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }} />
                  </div>
                  <button
                    onClick={handleResolveAgroZone}
                    disabled={isResolvingZone}
                    className="p-2.5 rounded-xl text-xs font-mono font-bold bg-purple-500 hover:bg-purple-400 text-white transition-all inline-flex items-center justify-center gap-2"
                  >
                    {isResolvingZone ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    <span>Lookup Agro Zone</span>
                  </button>
                </div>

                {resolvedZoneInfo && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-purple-400 font-bold block">{resolvedZoneInfo.zone} ({resolvedZoneInfo.aez})</span>
                      <p className="text-[11px] text-gray-300 mt-0.5">{resolvedZoneInfo.message}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      NSDI Verified
                    </span>
                  </div>
                )}
              </div>

              {/* 6 Major Coconut Nutrient Deficiencies Interactive Guide */}
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <BookOpen className="w-4 h-4 text-emerald-400" /> CRI Coconut Nutrient Deficiency Reference & Field Protocols
                </h3>

                {/* Nutrient Selection Tabs */}
                <div className="flex flex-wrap gap-2">
                  {SOIL_DEFICIENCIES_GUIDE.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDeficiency(d.id)}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2"
                      style={{
                        background: selectedDeficiency === d.id ? `${d.themeColor}20` : "var(--card-bg)",
                        borderColor: selectedDeficiency === d.id ? d.themeColor : "var(--card-border)",
                        color: selectedDeficiency === d.id ? d.themeColor : "var(--text-secondary)",
                      }}
                    >
                      <span>{d.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Deficiency Card */}
                {(() => {
                  const item = SOIL_DEFICIENCIES_GUIDE.find(g => g.id === selectedDeficiency) || SOIL_DEFICIENCIES_GUIDE[0];
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl border space-y-6" style={{ borderColor: `${item.themeColor}40` }}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                        <div>
                          <h4 className="text-lg font-bold" style={{ color: item.themeColor }}>{item.name}</h4>
                          <span className="text-xs font-mono text-gray-400">{item.criticalRange}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg font-mono" style={{ background: `${item.themeColor}20`, color: item.themeColor, border: `1px solid ${item.themeColor}40` }}>
                          {item.chemicalSymbol}
                        </div>
                      </div>

                      <p className="text-xs font-mono text-gray-300 leading-relaxed">
                        {item.overview}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                        <div className="p-4 rounded-xl bg-black/30 border space-y-2" style={{ borderColor: "var(--card-border)" }}>
                          <h5 className="font-bold text-red-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Diagnostic Symptoms:
                          </h5>
                          <ul className="space-y-1.5 text-gray-300 text-[11px] list-disc list-inside">
                            {item.symptoms.map((s, idx) => (
                              <li key={idx} className="leading-relaxed">{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-black/30 border space-y-2" style={{ borderColor: "var(--card-border)" }}>
                          <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Corrective Protocols (CRI A5 / A7):
                          </h5>
                          <ul className="space-y-1.5 text-gray-300 text-[11px] list-disc list-inside">
                            {item.correctiveMeasures.map((m, idx) => (
                              <li key={idx} className="leading-relaxed">{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border text-[11px] font-mono text-gray-300" style={{ borderColor: "var(--card-border)" }}>
                        <strong className="text-amber-400">Agronomist Note: </strong>{item.vernacularAdvice}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              TAB 5: SOIL TELEMETRY GIS MAP & SCAN HISTORY
             ═════════════════════════════════════════════════════════════════ */}
          {tab === "history" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
              
              {/* Top History Controller */}
              <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Map className="w-4 h-4 text-emerald-400" /> Soil Telemetry & DFR History Records
                  </h3>
                  <span className="text-xs font-mono text-gray-400">{soilTestsList.length} past 3-point soil tests logged</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="p-1 rounded-xl border flex items-center gap-1 font-mono text-xs" style={{ background: "var(--input-bg)", borderColor: "var(--card-border)" }}>
                    <button
                      onClick={() => setHistoryView("table")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${historyView === "table" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-gray-400"}`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setHistoryView("map")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${historyView === "map" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-gray-400"}`}
                    >
                      Spatial GIS Map
                    </button>
                  </div>

                  {soilTestsList.length > 0 && (
                    <button
                      onClick={handleClearAllSoilTests}
                      className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-1 hover:bg-red-500/20 transition-all font-medium"
                      title="Clear all soil tests"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* View Rendering */}
              {historyView === "map" ? (
                <div className="space-y-4">
                  <SoilTelemetryMapInner soilTests={soilTestsList} />
                  <p className="text-center text-xs font-mono text-gray-400">
                    Click any circular soil pin to view predicted 14th frond NPK and fertilizer dosages for that tree.
                  </p>
                </div>
              ) : (
                /* History Table */
                <div className="glass-card p-2 rounded-2xl overflow-x-auto">
                  {soilTestsList.length === 0 ? (
                    <div className="text-center p-10 space-y-3">
                      <FlaskConical className="w-8 h-8 mx-auto text-emerald-400 opacity-40" />
                      <p className="text-sm font-mono font-medium" style={{ color: "var(--text-primary)" }}>No Soil Test Records Yet</p>
                      <p className="text-xs font-mono text-gray-400 max-w-sm mx-auto">
                        Execute a 3-point spatial triangulation scan above to log precision soil NPK and fertilizer prescriptions.
                      </p>
                      <button
                        onClick={() => setTab("triangulation")}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 inline-flex items-center gap-2 mt-2"
                      >
                        <Zap className="w-3.5 h-3.5" /> Start Soil Test
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-mono" style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}>
                          <th className="p-3.5">Date & Tree</th>
                          <th className="p-3.5">Estate / Zone</th>
                          <th className="p-3.5">Average Soil NPK</th>
                          <th className="p-3.5">Predicted Leaf NPK</th>
                          <th className="p-3.5">Prescription (U / ERP / MOP)</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSoilTests.map((t) => (
                          <tr key={t.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: "var(--table-border)" }}>
                            <td className="p-3.5 font-medium" style={{ color: "var(--text-primary)" }}>
                              <div>Tree #{t.tree_no}</div>
                              <div className="text-[10px] text-gray-400">{new Date(t.captured_at).toLocaleDateString()}</div>
                            </td>
                            <td className="p-3.5 text-gray-300">
                              <div>{t.estate_name}</div>
                              <div className="text-[10px] text-gray-400">{t.zone_id}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="text-gray-300">N: {t.average_soil_npk.N.toFixed(4)}</span> | <span className="text-gray-300">P: {t.average_soil_npk.P.toFixed(3)}</span> | <span className="text-gray-300">K: {t.average_soil_npk.K.toFixed(3)}</span>
                            </td>
                            <td className="p-3.5 font-bold">
                              <span className="text-cyan-400">N: {t.predicted_14th_leaf_npk.N.toFixed(2)}%</span> | <span className="text-emerald-400">P: {t.predicted_14th_leaf_npk.P.toFixed(2)}%</span> | <span className="text-amber-400">K: {t.predicted_14th_leaf_npk.K.toFixed(2)}%</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-cyan-300 font-bold">{t.fertilizer_recommendation.Urea}g</span> / <span className="text-emerald-300 font-bold">{t.fertilizer_recommendation.Eppawala_Rock_Phosphate_ERP}g</span> / <span className="text-amber-300 font-bold">{t.fertilizer_recommendation.Muriate_of_Potash_MOP}g</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                {t.health_status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDeleteSoilTest(t.id)}
                                className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete soil test"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

            </motion.div>
          )}

        </div>
      </main>
    </AuthGuard>
  );
}
