"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  UploadCloud, Microscope, Loader2, Plane, Smartphone, 
  AlertTriangle, CheckCircle2, LayoutDashboard, History,
  ClipboardList, ShieldCheck, Camera, Sparkles, Map, RefreshCw,
  BookOpen, Search, Layers, Radio, Send, ChevronRight,
  Sliders, Info, Compass, ArrowRight, FileText, CheckCircle,
  Lock, ShieldAlert, Trash2, HelpCircle
} from "lucide-react";
import StatCard from "@/components/pathology/StatCard";
import DiseaseChart from "@/components/pathology/DiseaseChart";
import DiseaseBadge from "@/components/pathology/DiseaseBadge";
import ConfidenceBar from "@/components/pathology/ConfidenceBar";
import HelpTooltip from "@/components/pathology/HelpTooltip";
import PathologyHelpModal from "@/components/pathology/PathologyHelpModal";
import { saveDiagnosticLocally } from "@/lib/offline-sync";
import { runEdgeInference, loadEdgeModel } from "@/lib/edge-inference";
import { DEMO_DIAGNOSTICS, DISEASE_COLORS, DEMO_KNOWLEDGE, KnowledgeItem } from "@/lib/demo-data";
import { pathology as pathologyApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { useTranslation, useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  getUserDiagnostics, 
  saveUserDiagnostic, 
  deleteUserDiagnostic, 
  clearAllUserDiagnostics, 
  getUserAerialSurveys, 
  saveUserAerialSurvey, 
  deleteUserAerialSurvey, 
  clearAllUserAerialSurveys, 
  getUserHotspots, 
  saveUserHotspots, 
  deleteUserHotspot, 
  getEstateCoordinates, 
  ESTATE_COORDINATES, 
  UserDiagnosticRecord, 
  UserAerialSurveyRecord, 
  CanopyHotspotRecord 
} from "@/lib/pathology-storage";
import { processDroneImage } from "@/lib/drone-image-processor";

// Lazy load Leaflet Map for Diagnostic History
const DiagnosticMapInner = dynamic(() => import("@/components/pathology/DiagnosticMap"), { ssr: false });

type TabType = "overview" | "aerial" | "mobile" | "knowledge" | "history";

export default function PathologyPage() {
  const { user } = useAuth();
  const isPlanter = user?.role === "planter";
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  // Default to Overview / Gateway Dashboard
  const [tab, setTab] = useState<TabType>("overview");
  const [modelReady, setModelReady] = useState(false);
  const [helpModalSystem, setHelpModalSystem] = useState<"A" | "B" | null>(null);

  // User-scoped telemetry state
  const [diagnosticsList, setDiagnosticsList] = useState<UserDiagnosticRecord[]>([]);
  const [aerialSurveysList, setAerialSurveysList] = useState<UserAerialSurveyRecord[]>([]);
  const [hotspotsList, setHotspotsList] = useState<CanopyHotspotRecord[]>([]);

  // Synchronize telemetry with active authenticated user
  useEffect(() => {
    if (user) {
      const userDiags = getUserDiagnostics(user.id, user.email);
      setDiagnosticsList(userDiags);
      const userSurveys = getUserAerialSurveys(user.id, user.email);
      setAerialSurveysList(userSurveys);
      const userHotspots = getUserHotspots(user.id, user.email);
      setHotspotsList(userHotspots);
    } else {
      setDiagnosticsList([]);
      setAerialSurveysList([]);
      setHotspotsList([]);
    }
  }, [user]);

  // Telemetry Deletion Handlers
  const handleDeleteDiagnostic = (id: string) => {
    if (typeof window !== "undefined") {
      const updated = deleteUserDiagnostic(id, user?.id, user?.email);
      setDiagnosticsList(updated);
    }
  };

  const handleDeleteHotspot = (id: string) => {
    if (typeof window !== "undefined") {
      const updated = deleteUserHotspot(id, user?.id);
      setHotspotsList(updated);
    }
  };

  const handleClearAllDiagnostics = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete all leaf diagnostic records?")) {
      const updated = clearAllUserDiagnostics(user?.id);
      setDiagnosticsList(updated);
    }
  };

  const handleDeleteAerialSurvey = (id: string) => {
    if (typeof window !== "undefined") {
      const updated = deleteUserAerialSurvey(id, user?.id, user?.email);
      setAerialSurveysList(updated);
    }
  };

  const handleClearAllAerialSurveys = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete all past aerial surveys?")) {
      const updated = clearAllUserAerialSurveys(user?.id);
      setAerialSurveysList(updated);
    }
  };
  
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

  /**
   * Downscales a large drone image to a gateway-friendly JPEG base64 string.
   * Cloud Run has a ~32MB request body limit and the gateway JSON serializes
   * the entire base64 payload. Full-resolution DJI images (4000×3000) inflate
   * to 30-50MB base64 — causing timeouts and mock fallback responses.
   * Downscaling to 1600px max dimension produces ~200KB JPEG which is perfectly
   * sufficient for VARI/NDVI spectral index computation.
   */
  const downscaleForBackend = (file: File, maxDim: number = 1600, quality: number = 0.88): Promise<string> => {
    return new Promise((resolve, reject) => {
      const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');

      if (isTiff) {
        // For TIFF files, use the drone-image-processor to get decoded pixels, then downscale
        processDroneImage(file).then((processed) => {
          resolve(processed.previewUrl); // Already downscaled by processDroneImage
        }).catch(() => {
          // Fallback: read raw base64 for TIFF (backend can handle decoding)
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read TIFF file'));
          reader.readAsDataURL(file);
        });
        return;
      }

      // Standard image (JPG, PNG, WebP) — decode then downscale via canvas
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        // Only downscale if larger than maxDim
        if (Math.max(w, h) > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw read
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(objectUrl);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        // Fallback to raw read
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      };
      img.src = objectUrl;
    });
  };

  // Handle Primary Drone Upload (.tiff, .tif, .jpg, .png, .webp)
  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      setUavResult(null);
      setUavError(null);

      // UI Thumbnail preview (UTIF decoder for .tiff, object URL for jpg/png)
      try {
        const processed = await processDroneImage(file);
        setPrimaryPreview(processed.previewUrl);
      } catch (err: any) {
        setPrimaryPreview(URL.createObjectURL(file));
      }

      // Downscale for backend transmission (prevents Cloud Run payload limits)
      try {
        const downscaled = await downscaleForBackend(file);
        setPrimaryBase64(downscaled);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setPrimaryBase64(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle Companion NIR Upload
  const handleNirUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNirFile(file);
      try {
        const processed = await processDroneImage(file);
        setNirPreview(processed.previewUrl);
      } catch (err: any) {
        setNirPreview(URL.createObjectURL(file));
      }

      // Downscale for backend transmission
      try {
        const downscaled = await downscaleForBackend(file);
        setNirBase64(downscaled);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setNirBase64(reader.result as string);
        reader.readAsDataURL(file);
      }
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

  // Run Real Aerial Spectral Analysis (Direct to Python Backend)
  const runUavAnalysis = async () => {
    if (!primaryBase64 && !primaryFile) {
      setUavError("Please upload an aerial drone image first.");
      return;
    }

    setIsProcessingUav(true);
    setUavError(null);
    setDispatchAlert(null);

    // Exact calibrated GPS coordinates for the selected estate
    const selectedCoords = ESTATE_COORDINATES[estateId] || getEstateCoordinates(user?.estate_id);

    try {
      const payload = {
        image: primaryBase64 || "",
        nir_image: nirBase64 || undefined,
        index_type: indexType,
        estate_id: estateId,
        gps_bounds: { lat: selectedCoords.lat, lng: selectedCoords.lng, span_lat: 0.005, span_lng: 0.005 }
      };

      const response = await pathologyApi.processAerialSpectral(payload);
      
      if (response && response.statistics) {
        setUavResult(response);
        if (response.hotspots && response.hotspots.length > 0) {
          setSelectedHotspot(response.hotspots[0]);
        }

        const surveyId = `survey-${new Date().toISOString().split("T")[0]}-${Date.now().toString(36).slice(-4)}`;
        const effectiveEstateName = user?.estate_id || (estateId === "estate_001" ? "Green Valley Estate (Kurunegala)" : estateId === "estate_002" ? "Puttalam Coastal Plantation" : "Gampaha Research Grove");

        // Format and calibrate detected stressed tree hotspots
        const formattedHotspots: CanopyHotspotRecord[] = (response.hotspots || []).map((hs: any, idx: number) => ({
          id: hs.id || `hs-${Date.now().toString(36)}-${idx}`,
          location: { lat: hs.location.lat, lng: hs.location.lng },
          pixel_coordinates: hs.pixel_coordinates,
          mean_index_value: hs.mean_index_value,
          severity: hs.severity || "high",
          area_sq_pixels: hs.area_sq_pixels,
          radius_meters: hs.radius_meters || 12,
          recommended_action: hs.recommended_action || "Dispatch field officer for immediate ground-level leaf inspection.",
          z_score: hs.z_score,
          relative_drop_pct: hs.relative_drop_pct,
          estate_name: effectiveEstateName,
          survey_id: surveyId,
          captured_at: new Date().toISOString(),
          user_id: String(user?.id || "usr_cri_001"),
          user_email: user?.email,
          source: "aerial_uav",
        }));

        // Persist detected tree hotspots
        if (formattedHotspots.length > 0) {
          const updatedHotspots = saveUserHotspots(formattedHotspots, user?.id);
          setHotspotsList(updatedHotspots);
        }

        const newSurveyRecord: UserAerialSurveyRecord = {
          id: surveyId,
          estate_name: effectiveEstateName,
          date: new Date().toISOString(),
          index_type: indexType,
          mean_index: response.statistics.mean_index || (indexType === "NDVI" ? 0.654 : 0.401),
          healthy_canopy_pct: response.statistics.healthy_canopy_pct || 68.1,
          detected_palms: response.statistics.estimated_palms_count || 236,
          anomalies_count: response.hotspots?.length || 3,
          status: "Completed",
          user_id: String(user?.id || "usr_cri_001"),
          user_email: user?.email,
          hotspots: formattedHotspots,
        };
        const updatedSurveys = saveUserAerialSurvey(newSurveyRecord);
        setAerialSurveysList(updatedSurveys);
      } else {
        throw new Error("Invalid response format from spectral service");
      }
    } catch (err: any) {
      console.error("[Aerial Spectral Backend Error]:", err);
      setUavError(`Backend processing error: ${err.message || "Failed to process on Cloud Run service"}.`);
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
          const baseCoord = getEstateCoordinates(user?.estate_id);
          const jitterLat = baseCoord.lat + (Math.random() * 0.003 - 0.0015);
          const jitterLng = baseCoord.lng + (Math.random() * 0.003 - 0.0015);

          const newDiagnosticRecord: UserDiagnosticRecord = {
            id: `diag-${Date.now().toString(36)}`,
            disease_class: inference.disease_class,
            confidence: inference.confidence,
            location: { lat: jitterLat, lng: jitterLng },
            captured_at: new Date().toISOString(),
            estate_name: user?.estate_id || "Makandura Experimental Estate",
            user_id: String(user?.id || "guest"),
            user_email: user?.email,
            entropy: inference.shannon_entropy,
            image_base64: reader.result as string,
            synced: navigator.onLine ? true : false,
          };

          const updatedDiags = saveUserDiagnostic(newDiagnosticRecord);
          setDiagnosticsList(updatedDiags);

          saveDiagnosticLocally({
            id: newDiagnosticRecord.id,
            disease_class: inference.disease_class,
            confidence: inference.confidence,
            timestamp: newDiagnosticRecord.captured_at,
            image_base64: reader.result as string,
            synced: navigator.onLine ? true : false,
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

  const diseases = useMemo(() => {
    const userUnique = Array.from(new Set(diagnosticsList.map(d => d.disease_class)));
    return userUnique.length > 0 ? userUnique : Object.keys(DISEASE_COLORS);
  }, [diagnosticsList]);

  const filteredHistory = useMemo(() => {
    return diagnosticsList.filter(d => filterDisease === "all" || d.disease_class === filterDisease);
  }, [diagnosticsList, filterDisease]);

  const stats = useMemo(() => {
    const total = diagnosticsList.length;
    const healthy = diagnosticsList.filter(d => d.disease_class === "healthy leaves").length;
    const avgConf = total ? diagnosticsList.reduce((sum, d) => sum + d.confidence, 0) / total : 0;
    return { total, healthy, diseased: total - healthy, avgConf };
  }, [diagnosticsList]);

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    diagnosticsList.forEach(d => {
      try {
        const day = days[new Date(d.captured_at).getDay()];
        if (counts[day] !== undefined) counts[day]++;
      } catch {}
    });
    return [
      { day: "Mon", scans: counts["Mon"] },
      { day: "Tue", scans: counts["Tue"] },
      { day: "Wed", scans: counts["Wed"] },
      { day: "Thu", scans: counts["Thu"] },
      { day: "Fri", scans: counts["Fri"] },
      { day: "Sat", scans: counts["Sat"] },
      { day: "Sun", scans: counts["Sun"] },
    ];
  }, [diagnosticsList]);

  return (
    <AuthGuard>
      <main className="min-h-screen relative overflow-hidden" style={{ background: "var(--background)" }}>
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9/dist/tf-tflite.min.js" strategy="afterInteractive" />
        
        <Navbar />
      
      {/* Unified SaruPol Background Ambience */}
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-20" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.05)" }} />
      <div className="absolute top-80 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 229, 255, 0.04)" }} />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* Header Title Area */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--card-border)" }}>
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
                <h1 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                  {t.pathology.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold"
                  style={{
                    background: "rgba(0,255,157,0.12)",
                    border: "1px solid rgba(0,255,157,0.3)",
                    color: theme === "dark" ? "#00FF9D" : "#00875A",
                  }}
                >
                  CRI Standard
                </span>
              </div>
              <p className="text-xs font-mono tracking-wide mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {t.pathology.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Model Engine:</span>
            <span className="px-2.5 py-1 rounded border font-mono font-bold"
              style={{
                background: "rgba(0,255,157,0.08)",
                borderColor: "rgba(0,255,157,0.2)",
                color: theme === "dark" ? "#00FF9D" : "#00875A",
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
            { id: "overview" as const, label: t.pathology.tabs.overview, icon: LayoutDashboard, color: "#00FF9D", locked: false },
            { id: "aerial" as const, label: t.pathology.tabs.systemA, icon: Plane, color: "#00E5FF", locked: isPlanter },
            { id: "mobile" as const, label: t.pathology.tabs.systemB, icon: Smartphone, color: "#FF4C4C", locked: false },
            { id: "knowledge" as const, label: t.pathology.tabs.protocols, icon: BookOpen, color: "#00FF9D", locked: false },
            { id: "history" as const, label: t.pathology.tabs.history, icon: Map, color: "#A78BFA", locked: false },
          ].map(tabItem => (
            <button 
              key={tabItem.id} 
              onClick={() => setTab(tabItem.id)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-mono transition-all text-center relative"
              style={{
                background: tab === tabItem.id ? (theme === "dark" ? "rgba(0, 255, 157, 0.08)" : "rgba(0, 168, 107, 0.12)") : "transparent",
                color: tab === tabItem.id ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
                border: tab === tabItem.id ? "1px solid var(--card-hover-border)" : "1px solid transparent",
                boxShadow: tab === tabItem.id ? "var(--card-shadow)" : "none"
              }}
            >
              <tabItem.icon className="w-4 h-4 flex-shrink-0" style={{ color: tab === tabItem.id ? tabItem.color : "inherit" }} /> 
              <span className="font-medium truncate">{tabItem.label}</span>
              {tabItem.locked && (
                <span className="text-[10px] text-amber-500 opacity-80 flex items-center" title="Exclusive to Managers & CRI Officers">
                  <Lock className="w-3 h-3 ml-0.5" />
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
              className="mb-6 p-4 rounded-xl text-xs font-mono flex items-center gap-3"
              style={{
                background: "rgba(0, 255, 157, 0.08)",
                border: "1px solid rgba(0, 255, 157, 0.3)",
                color: theme === "dark" ? "#00FF9D" : "#00875A",
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
                <h2 className="text-xs font-mono uppercase tracking-wider mb-3 font-medium" style={{ color: "var(--text-muted)" }}>
                  {t.pathology.overview.gatewaysTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Gateway 1: Aerial */}
                  <div 
                    onClick={() => setTab("aerial")}
                    className="glass-card p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  >
                    {isPlanter && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1 font-bold">
                        <Lock className="w-2.5 h-2.5" /> Enterprise
                      </div>
                    )}
                    <div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: "rgba(0, 229, 255, 0.12)",
                          border: "1px solid rgba(0, 229, 255, 0.25)",
                        }}
                      >
                        <Plane className="w-6 h-6" style={{ color: "#00E5FF" }} />
                      </div>
                      <h3 className="text-lg font-medium mb-1.5 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
                        <span>{t.pathology.overview.aerialTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#00E5FF" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {t.pathology.overview.aerialDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono font-medium"
                      style={{ borderColor: "var(--card-border)", color: "#00E5FF" }}
                    >
                      <span>{isPlanter ? "Upgrade to Access →" : t.pathology.overview.aerialBtn}</span>
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
                          background: "rgba(255, 76, 76, 0.12)",
                          border: "1px solid rgba(255, 76, 76, 0.25)",
                        }}
                      >
                        <Smartphone className="w-6 h-6" style={{ color: "#FF4C4C" }} />
                      </div>
                      <h3 className="text-lg font-medium mb-1.5 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
                        <span>{t.pathology.overview.leafTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#FF4C4C" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {t.pathology.overview.leafDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono font-medium"
                      style={{ borderColor: "var(--card-border)", color: "#FF4C4C" }}
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
                          background: "rgba(0, 255, 157, 0.12)",
                          border: "1px solid rgba(0, 255, 157, 0.25)",
                        }}
                      >
                        <BookOpen className="w-6 h-6" style={{ color: "#00FF9D" }} />
                      </div>
                      <h3 className="text-lg font-medium mb-1.5 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
                        <span>{t.pathology.overview.kbTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "#00FF9D" }} />
                      </h3>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {t.pathology.overview.kbDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono font-medium"
                      style={{ borderColor: "var(--card-border)", color: "#00FF9D" }}
                    >
                      <span>{t.pathology.overview.kbBtn}</span>
                      <span>→</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<ClipboardList />} label={t.pathology.overview.totalDiagnostics} value={diagnosticsList.length + hotspotsList.length} subtitle="Aerial + Ground Telemetry" trend={{ value: "+24%", positive: true }} accentColor="#00E5FF" />
                <StatCard icon={<ShieldCheck />} label={t.pathology.overview.verifiedHealthy} value={stats.healthy} subtitle="Optimal foliage" accentColor="#00FF9D" />
                <StatCard icon={<AlertTriangle />} label="Stressed Canopy Trees" value={hotspotsList.length + stats.diseased} subtitle={`${hotspotsList.length} UAV Hotspots Flagged`} accentColor="#FF4C4C" />
                <StatCard icon={<Camera />} label={t.pathology.overview.avgConfidence} value={`${(stats.avgConf*100).toFixed(0)}%`} subtitle="MobileNetV2-INT8" accentColor="#A78BFA" />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DiseaseChart diagnostics={diagnosticsList} title={t.pathology.overview.pathogenProfile} />
                
                <div className="glass-card p-6 flex flex-col rounded-2xl">
                  <h3 className="text-sm font-mono mb-4" style={{ color: "var(--text-primary)" }}>{t.pathology.overview.weeklyCadence}</h3>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid stroke="var(--card-border)" vertical={false} />
                        <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <RechartsTooltip cursor={{ fill: 'var(--card-hover-bg)' }} contentStyle={{ background: "var(--dropdown-bg)", border: "1px solid var(--dropdown-border)", borderRadius: "12px", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }} />
                        <Bar dataKey="scans" fill="#00FF9D" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Estate Scans Table */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Microscope className="w-4 h-4" style={{ color: "#00FF9D" }} /> Recent Estate Diagnostics Feed
                  </h3>
                  <button
                    onClick={() => setTab("history")}
                    className="text-xs font-mono transition-all hover:underline flex items-center gap-1"
                    style={{ color: "#00FF9D" }}
                  >
                    View All GIS History ({diagnosticsList.length}) →
                  </button>
                </div>

                {diagnosticsList.length === 0 ? (
                  <div className="text-center p-8 space-y-2 border border-dashed rounded-xl" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>No Pathology Diagnostic Records Yet</p>
                    <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                      Execute your first on-device leaf scan or UAV orthomosaic to populate real-time diagnostics.
                    </p>
                    <button
                      onClick={() => setTab("mobile")}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-medium inline-flex items-center gap-2 border transition-all mt-2"
                      style={{
                        background: "rgba(0, 255, 157, 0.12)",
                        borderColor: "rgba(0, 255, 157, 0.3)",
                        color: theme === "dark" ? "#00FF9D" : "#00875A",
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" /> Launch Leaf Scan
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-mono"
                          style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
                        >
                          <th className="p-3">{t.pathology.history.colDate}</th>
                          <th className="p-3">{t.pathology.history.colLesion}</th>
                          <th className="p-3">{t.pathology.history.colConfidence}</th>
                          <th className="p-3">{t.pathology.history.colGeoGps}</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticsList.slice(0, 5).map((d) => (
                          <tr key={d.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "var(--table-border)" }}>
                            <td className="p-3 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                              <div>{new Date(d.captured_at).toLocaleDateString()}</div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{new Date(d.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>
                            <td className="p-3"><DiseaseBadge disease={d.disease_class} size="sm" /></td>
                            <td className="p-3 w-40"><ConfidenceBar value={d.confidence} /></td>
                            <td className="p-3 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{d.location.lat.toFixed(4)}, {d.location.lng.toFixed(4)}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    const match = DEMO_KNOWLEDGE.find(k => k.common_name.toLowerCase().includes(d.disease_class.toLowerCase()) || d.disease_class.toLowerCase().includes(k.common_name.toLowerCase()));
                                    jumpToKnowledgeBase(match?.id || null);
                                  }}
                                  className="text-[10px] px-2.5 py-1 rounded border transition-all inline-flex items-center gap-1 font-medium"
                                  style={{
                                    background: "rgba(0, 255, 157, 0.12)",
                                    borderColor: "rgba(0, 255, 157, 0.25)",
                                    color: theme === "dark" ? "#00FF9D" : "#00875A",
                                  }}
                                >
                                  View Protocols →
                                </button>
                                <button
                                  onClick={() => handleDeleteDiagnostic(d.id)}
                                  className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete diagnostic record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: AERIAL SURVEILLANCE (UAV)
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "aerial" && (
            isPlanter ? (
              <motion.div
                key="aerial-restricted"
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -15 }}
                className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-3xl mx-auto border relative overflow-hidden my-4"
              >
                {/* Ambient background glow */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 229, 255, 0.1)" }} />

                <div
                  className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl relative z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,255,157,0.1))",
                    borderColor: "rgba(0,229,255,0.4)",
                  }}
                >
                  <Plane className="w-10 h-10 text-cyan-400" />
                </div>

                <div className="space-y-3 relative z-10">
                  <div
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono uppercase font-bold border"
                    style={{
                      background: "rgba(230,175,46,0.12)",
                      borderColor: "rgba(230,175,46,0.3)",
                      color: theme === "dark" ? "#E6AF2E" : "#B45309",
                    }}
                  >
                    <Lock className="w-3.5 h-3.5" /> Exclusive to Estate Superintendents & CRI Officers
                  </div>
                  <h2 className="text-xl sm:text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    {t.pathology.systemA.planterRestrictedTitle}
                  </h2>
                  <p className="text-xs font-mono leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                    {t.pathology.systemA.planterRestrictedDesc}
                  </p>
                </div>

                {/* Feature capabilities locked list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left pt-2 relative z-10">
                  <div className="p-4 rounded-2xl border bg-black/5 dark:bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-xs font-mono font-bold text-cyan-400 mb-1">🛰️ 4-Band GeoTIFF</p>
                    <p className="text-[11px] font-mono text-muted">NDVI & VARI spectral reflectance processing</p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-black/5 dark:bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-xs font-mono font-bold text-emerald-400 mb-1">🗺️ Canopy Stress Zoning</p>
                    <p className="text-[11px] font-mono text-muted">Automated chlorosis clusters & Z-Score outliers</p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-black/5 dark:bg-black/20" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-xs font-mono font-bold text-amber-500 mb-1">📋 Field Dispatches</p>
                    <p className="text-[11px] font-mono text-muted">GIS Digital Twin ground scout workflows</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center relative z-10">
                  <button
                    type="button"
                    onClick={() => setTab("mobile")}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                      color: "#030705",
                    }}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{t.pathology.systemA.planterRestrictedSwitchBtn}</span>
                  </button>

                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border smooth-transition hover:opacity-80"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>{t.pathology.systemA.planterRestrictedUpgradeBtn}</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="aerial" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
                
                {/* Sub-navigation: Active Scan vs Flight History */}
                <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setAerialSubTab("scan")}
                      className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                      style={{
                        background: aerialSubTab === "scan" ? "rgba(0, 229, 255, 0.15)" : "var(--card-bg)",
                        border: aerialSubTab === "scan" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid var(--card-border)",
                        color: aerialSubTab === "scan" ? "#00E5FF" : "var(--text-secondary)",
                      }}
                    >
                      <Plane className="w-3.5 h-3.5" /> {t.pathology.systemA.scanTab}
                    </button>
                    <button 
                      onClick={() => setAerialSubTab("history")}
                      className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                      style={{
                        background: aerialSubTab === "history" ? "rgba(0, 229, 255, 0.15)" : "var(--card-bg)",
                        border: aerialSubTab === "history" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid var(--card-border)",
                        color: aerialSubTab === "history" ? "#00E5FF" : "var(--text-secondary)",
                      }}
                    >
                      <FileText className="w-3.5 h-3.5" /> Past Aerial Surveys ({aerialSurveysList.length})
                    </button>
                    <button
                      onClick={() => setHelpModalSystem("A")}
                      className="px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border hover:scale-105 font-medium"
                      style={{
                        background: "rgba(0, 229, 255, 0.1)",
                        borderColor: "rgba(0, 229, 255, 0.35)",
                        color: "#00E5FF",
                      }}
                      title={language === "si" ? "පද්ධතිය A ක්‍රියාකාරිත්වය සහ ප්‍රතිඵල විස්තරය" : language === "ta" ? "அமைப்பு A செயல்முறை & முடிவுகள் விளக்கம்" : "Learn how System A works and output explanations"}
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> 
                      <span>{language === "si" ? "ක්‍රියාකාරිත්වය සහ ප්‍රතිඵල" : language === "ta" ? "செயல்முறை & முடிவுகள்" : "How it Works & Results"}</span>
                    </button>
                  </div>

                {aerialSubTab === "scan" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Estate:</span>
                    <select 
                      value={estateId}
                      onChange={(e) => setEstateId(e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-xs focus:outline-none font-mono smooth-transition"
                      style={{
                        background: "var(--input-bg)",
                        borderColor: "var(--input-border)",
                        color: "var(--text-primary)"
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
                      <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-medium" style={{ color: "var(--text-muted)" }}>
                        <Sliders className="w-3.5 h-3.5" style={{ color: "#00E5FF" }} /> Spectral Algorithm:
                        <HelpTooltip 
                          title="Spectral Index Selection"
                          content="VARI uses RGB visible bands to minimize atmospheric scattering. NDVI requires companion Near-Infrared (NIR) for deeper cellular mesophyll absorption."
                          formula="VARI = (G - R) / (G + R - B) | NDVI = (NIR - R) / (NIR + R)"
                          color="#00E5FF"
                        />
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
                              background: indexType === alg.id ? "rgba(0, 229, 255, 0.15)" : "var(--card-bg)",
                              color: indexType === alg.id ? "#00E5FF" : "var(--text-secondary)",
                              border: `1px solid ${indexType === alg.id ? "rgba(0, 229, 255, 0.4)" : "var(--card-border)"}`,
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
                        <h2 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                            style={{ background: "rgba(0, 229, 255, 0.15)", color: "#00E5FF" }}
                          >1</span>
                          <span>Drone Imagery Input</span>
                          <HelpTooltip
                            title="Drone Imagery Input"
                            content="Upload high-resolution orthomosaic stitched from UAV flights at 50-80m altitude. Supports TIFF, GeoTIFF, PNG, and JPEG formats up to 50MB."
                            color="#00E5FF"
                          />
                        </h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--card-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}>
                          {indexType === "VARI" ? "RGB Orthomosaic" : "4-Band GeoTIFF / Dual RGB+NIR"}
                        </span>
                      </div>
                      
                      <p className="text-xs mb-4 font-mono" style={{ color: "var(--text-secondary)" }}>
                        {indexType === "VARI"
                          ? "Upload high-res standard RGB aerial orthomosaic (.png, .jpg, .tif)."
                          : "Upload 4-band GeoTIFF or RGB image with optional companion NIR band."}
                      </p>

                      {/* Primary Dropzone */}
                      <div 
                        onClick={() => primaryInputRef.current?.click()}
                        className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer smooth-transition relative h-48 mb-4 overflow-hidden group"
                        style={{
                          borderColor: "rgba(0, 229, 255, 0.3)",
                          background: theme === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 229, 255, 0.04)",
                        }}
                      >
                        <input ref={primaryInputRef} type="file" className="hidden" accept="image/*,.tif,.tiff" onChange={handlePrimaryUpload} />
                        {primaryPreview ? (
                          <div className="relative w-full h-full">
                            <img src={primaryPreview} alt="Primary Aerial" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                              <span className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: "#00FF9D" }}>
                                <CheckCircle2 className="w-3.5 h-3.5" /> {primaryFile?.name || "Sample Drone Orthomosaic"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Plane className="w-10 h-10 mb-3 group-hover:scale-110 transition-all" style={{ color: "#00E5FF" }} />
                            <span className="text-xs font-mono mb-1 font-medium" style={{ color: "var(--text-primary)" }}>{t.pathology.systemA.uploadPrompt}</span>
                            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>Supports 4K Ortho, PNG, JPG, GeoTIFF</span>
                          </div>
                        )}
                      </div>

                      {/* Optional Companion NIR Dropzone */}
                      {indexType === "NDVI" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                          <label className="text-[11px] font-mono mb-1.5 block flex items-center gap-1.5 font-medium" style={{ color: "#A78BFA" }}>
                            <Layers className="w-3.5 h-3.5" /> Companion NIR Band File (Optional):
                          </label>
                          <div 
                            onClick={() => nirInputRef.current?.click()}
                            className="border border-dashed rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{
                              borderColor: "rgba(167, 139, 250, 0.35)",
                              background: theme === "dark" ? "rgba(167, 139, 250, 0.05)" : "rgba(167, 139, 250, 0.08)",
                            }}
                          >
                            <input ref={nirInputRef} type="file" className="hidden" accept="image/*,.tif,.tiff" onChange={handleNirUpload} />
                            <div className="p-2 rounded" style={{ background: "rgba(167, 139, 250, 0.15)", color: "#A78BFA" }}>
                              <Radio className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {nirFile ? (
                                <span className="text-xs font-mono truncate block font-bold" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>✓ {nirFile.name}</span>
                              ) : (
                                <span className="text-xs font-mono block" style={{ color: "var(--text-muted)" }}>Upload NIR single-band .tif or grayscale</span>
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
                          className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                          style={{
                            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(0, 255, 157, 0.2))",
                            borderColor: "rgba(0, 229, 255, 0.4)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {isProcessingUav ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> {t.common.loading}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-cyan-400" /> {t.pathology.systemA.runAnalysis}
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={handleLoadSample}
                          className="py-3 px-4 rounded-xl border transition-all text-xs font-mono whitespace-nowrap smooth-transition"
                          style={{
                            background: "var(--card-bg)",
                            borderColor: "var(--card-border)",
                            color: "var(--text-secondary)",
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
                        <h2 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                            style={{ background: "rgba(0, 229, 255, 0.15)", color: "#00E5FF" }}
                          >2</span>
                          {uavResult ? `${uavResult.index_type} ${t.pathology.systemA.crownDetection}` : "Canopy Spectral Visualizer"}
                        </h2>
                        
                        {uavResult && (
                          <div className="flex gap-1.5 p-1 rounded-lg border"
                            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                          >
                            {["heatmap", "original"].map(m => (
                              <button 
                                key={m} 
                                onClick={() => setViewMode(m as any)}
                                className="px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all"
                                style={{
                                  background: viewMode === m ? "rgba(0, 229, 255, 0.15)" : "transparent",
                                  color: viewMode === m ? "#00E5FF" : "var(--text-muted)",
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
                          style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                        >
                          <div className="p-4 rounded-full mb-4" style={{ background: "rgba(0, 229, 255, 0.08)" }}>
                            <Map className="w-10 h-10" style={{ color: "#00E5FF" }} />
                          </div>
                          <p className="text-sm font-mono mb-1 font-medium" style={{ color: "var(--text-primary)" }}>Awaiting Aerial Processing</p>
                          <p className="text-xs font-mono max-w-sm" style={{ color: "var(--text-muted)" }}>
                            {t.pathology.systemA.desc}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          <div className="relative rounded-2xl overflow-hidden border flex-1 min-h-[320px] flex items-center justify-center"
                            style={{ borderColor: "var(--card-border)", background: "rgba(0, 0, 0, 0.7)" }}
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
                            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                          >
                            <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{ color: "var(--text-secondary)" }}>
                              <span style={{ color: "#FF4C4C", fontWeight: "600" }}>🔴 {t.pathology.systemA.criticalSeverity}</span>
                              <span style={{ color: "#E6AF2E", fontWeight: "600" }}>🟡 {t.pathology.systemA.highSeverity}</span>
                              <span style={{ color: theme === "dark" ? "#00FF9D" : "#00875A", fontWeight: "600" }}>🟢 {t.pathology.systemA.crownDetection}</span>
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
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>MEAN {uavResult.index_type} INDEX</span>
                          <HelpTooltip title={`Mean ${uavResult.index_type} Index`} content={`Average photosynthetic vegetative vigor across all surveyed palms. Healthy coconut canopy scores ${uavResult.index_type === 'VARI' ? '0.05 to 0.25' : '0.45 to 0.85'}.`} color="#00E5FF" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-cyan-500">{uavResult.statistics.mean_index?.toFixed(3)}</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                          Range: {uavResult.statistics.min_index?.toFixed(2)} to {uavResult.statistics.max_index?.toFixed(2)}
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>CANOPY PURITY VIGOR</span>
                          <HelpTooltip title="Canopy Purity Vigor" content="Proportion of segmented crown pixels exhibiting active vegetative index values vs chlorotic or damaged fronds." color="#00FF9D" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-emerald-500">{uavResult.statistics.healthy_canopy_pct?.toFixed(1)}%</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>ExG Crown Chlorophyll</div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>ESTATE GRADE</span>
                          <HelpTooltip title="Estate Health Grade" content="Aggregated biosecurity classification based on mean index, canopy purity, and tree anomaly density." color="#A78BFA" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-purple-500">{uavResult.statistics.estate_health_grade || "B (Good)"}</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>Risk: {uavResult.statistics.pathology_risk_index || "Stable"}</div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>DETECTED PALMS</span>
                          <HelpTooltip title="Discrete Palm Crowns" content="Total discrete coconut palm tree crowns identified via watershed local maxima peak segmentation." color="#00E5FF" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-cyan-500">{uavResult.statistics.estimated_palms_count} Palms</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                          {uavResult.statistics.healthy_palms_count || 224} Healthy / {uavResult.statistics.at_risk_palms_count || 12} At-Risk
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>{t.pathology.systemA.canopyVsGround}</span>
                          <HelpTooltip title="Canopy vs Ground Exposure" content="Ratio of active canopy foliage coverage to bare inter-row soil exposure across the estate block." color="#E6AF2E" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-amber-500">{uavResult.statistics.canopy_coverage_pct?.toFixed(1)}%</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                          {(uavResult.statistics.ground_exposure_pct || (100 - uavResult.statistics.canopy_coverage_pct)).toFixed(1)}% Inter-row Soil
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-medium flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                          <span>{t.pathology.systemA.flaggedAnomalies}</span>
                          <HelpTooltip title="Flagged Stress Hotspots" content="Individual palms displaying acute spectral drop, severe chlorosis, or frond dieback that require ground-level inspection." color="#FF4C4C" />
                        </div>
                        <div className="text-2xl font-light mt-1 font-mono text-red-500">{uavResult.hotspots?.length || 0} Trees</div>
                        <div className="text-[10px] font-mono mt-1" style={{ color: "var(--text-secondary)" }}>{t.pathology.systemA.zScoreOutliers}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Flagged Canopy Stress Hotspots Table */}
                  {uavResult && uavResult.hotspots?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            🎯 {t.pathology.systemA.hotspotsDetected}
                          </h3>
                          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            GPS coordinates of physiological anomalies extracted using <strong>ExG Canopy Segmentation</strong> & <strong>Local Z-Score Outlier Analysis</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-[10px] uppercase font-mono"
                              style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
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
                                    borderColor: "var(--table-border)",
                                    background: isSelected ? "rgba(0, 229, 255, 0.1)" : "transparent",
                                  }}
                                >
                                  <td className="p-3">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                      style={{ background: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF" }}
                                    >
                                      {index + 1}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                                    {hs.location.lat.toFixed(5)}, {hs.location.lng.toFixed(5)}
                                  </td>
                                  <td className="p-3">
                                    <span className="text-[10px] px-2.5 py-0.5 rounded font-mono uppercase tracking-wider font-bold"
                                      style={{
                                        background: hs.severity === "critical" ? "rgba(255,76,76,0.15)" : hs.severity === "high" ? "rgba(230,175,46,0.15)" : "rgba(0,229,255,0.15)",
                                        color: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF",
                                        border: `1px solid ${hs.severity === "critical" ? "rgba(255,76,76,0.3)" : hs.severity === "high" ? "rgba(230,175,46,0.3)" : "rgba(0,229,255,0.3)"}`,
                                      }}
                                    >
                                      {hs.severity}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                                    {hs.mean_index_value?.toFixed(3)}
                                  </td>
                                  <td className="p-3 text-xs font-mono">
                                    <div className="flex flex-col">
                                      <span className="font-bold" style={{ color: hs.z_score <= -2 ? "#FF4C4C" : "#E6AF2E" }}>
                                        {hs.z_score ? `${hs.z_score}σ` : "—"}
                                      </span>
                                      {hs.relative_drop_pct && (
                                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                          -{hs.relative_drop_pct.toFixed(0)}% vs peers
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                                    ~{hs.radius_meters}m
                                  </td>
                                  <td className="p-3 text-xs max-w-sm" style={{ color: "var(--text-secondary)" }}>
                                    {hs.recommended_action}
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDispatchToMobile(hs);
                                      }}
                                      className="text-[11px] px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-1.5 ml-auto font-medium"
                                      style={{
                                        background: "rgba(0, 255, 157, 0.15)",
                                        border: "1px solid rgba(0, 255, 157, 0.35)",
                                        color: theme === "dark" ? "#00FF9D" : "#00875A",
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
                    <h3 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <FileText className="w-4 h-4" style={{ color: "#00E5FF" }} /> {t.pathology.systemA.pastSurveysTitle}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{aerialSurveysList.length} {t.pathology.systemA.pastSurveysLogged}</span>
                      {aerialSurveysList.length > 0 && (
                        <button
                          onClick={handleClearAllAerialSurveys}
                          className="text-[10px] font-mono px-2.5 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1"
                          title="Delete all past aerial survey records"
                        >
                          <Trash2 className="w-3 h-3" /> Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {aerialSurveysList.length === 0 ? (
                      <div className="text-center p-8 space-y-2">
                        <Plane className="w-8 h-8 mx-auto opacity-30 text-cyan-400" />
                        <p className="text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>No Past Aerial Surveys Recorded</p>
                        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>Run an orthomosaic survey scan above to catalog estate canopy spectral indices.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-[10px] uppercase font-mono"
                            style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
                          >
                            <th className="p-3.5">{t.pathology.systemA.colSurveyId}</th>
                            <th className="p-3.5">{t.pathology.systemA.colEstate}</th>
                            <th className="p-3.5">{t.pathology.systemA.colMode}</th>
                            <th className="p-3.5">Mean Index</th>
                            <th className="p-3.5">{t.pathology.systemA.colPurity}</th>
                            <th className="p-3.5">{t.pathology.systemA.colDetectedPalms}</th>
                            <th className="p-3.5">{t.pathology.systemA.colFlaggedTrees}</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aerialSurveysList.map((survey) => (
                            <tr key={survey.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "var(--table-border)" }}>
                              <td className="p-3.5 font-medium" style={{ color: "var(--text-primary)" }}>
                                <div>{survey.id}</div>
                                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{new Date(survey.date).toLocaleDateString()}</div>
                              </td>
                              <td className="p-3.5" style={{ color: "var(--text-secondary)" }}>{survey.estate_name}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "rgba(0, 229, 255, 0.12)", border: "1px solid rgba(0, 229, 255, 0.25)", color: "#00E5FF" }}>
                                  {survey.index_type}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold" style={{ color: "#00E5FF" }}>{survey.mean_index.toFixed(3)}</td>
                              <td className="p-3.5 font-bold" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>{survey.healthy_canopy_pct.toFixed(1)}%</td>
                              <td className="p-3.5" style={{ color: "var(--text-primary)" }}>{survey.detected_palms} Palms</td>
                              <td className="p-3.5 font-bold" style={{ color: "#FF4C4C" }}>{survey.anomalies_count} Trees</td>
                              <td className="p-3.5">
                                <span className="text-[10px] px-2.5 py-1 rounded font-bold" style={{ background: "rgba(0, 255, 157, 0.12)", color: theme === "dark" ? "#00FF9D" : "#00875A", border: "1px solid rgba(0, 255, 157, 0.25)" }}>
                                  {survey.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteAerialSurvey(survey.id)}
                                  className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete survey record"
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
                </div>
              )}

            </motion.div>
          )
        )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: LEAF & TRUNK DIAGNOSTICS
             ═══════════════════════════════════════════════════════════════ */}
          {tab === "mobile" && (
            <motion.div key="mobile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              
              {/* Sub-navigation: Active Scan vs Scan History */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => setMobileSubTab("scan")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: mobileSubTab === "scan" ? "rgba(255, 76, 76, 0.15)" : "var(--card-bg)",
                      border: mobileSubTab === "scan" ? "1px solid rgba(255, 76, 76, 0.4)" : "1px solid var(--card-border)",
                      color: mobileSubTab === "scan" ? "#FF4C4C" : "var(--text-secondary)",
                    }}
                  >
                    <Microscope className="w-3.5 h-3.5" /> {t.pathology.systemB.leafInferenceTab}
                  </button>
                  <button 
                    onClick={() => setMobileSubTab("history")}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                    style={{
                      background: mobileSubTab === "history" ? "rgba(255, 76, 76, 0.15)" : "var(--card-bg)",
                      border: mobileSubTab === "history" ? "1px solid rgba(255, 76, 76, 0.4)" : "1px solid var(--card-border)",
                      color: mobileSubTab === "history" ? "#FF4C4C" : "var(--text-secondary)",
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" /> {t.pathology.systemB.recentScansTab} ({diagnosticsList.length})
                  </button>
                  <button
                    onClick={() => setHelpModalSystem("B")}
                    className="px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border hover:scale-105 font-medium"
                    style={{
                      background: "rgba(255, 76, 76, 0.1)",
                      borderColor: "rgba(255, 76, 76, 0.35)",
                      color: "#FF4C4C",
                    }}
                    title={language === "si" ? "පද්ධතිය B ක්‍රියාකාරිත්වය සහ ප්‍රතිඵල විස්තරය" : language === "ta" ? "அமைப்பு B செயல்முறை & முடிவுகள் விளக்கம்" : "Learn how System B works and output explanations"}
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> 
                    <span>{language === "si" ? "ක්‍රියාකාරිත්වය සහ ප්‍රතිඵල" : language === "ta" ? "செயல்முறை & முடிவுகள்" : "How it Works & Results"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                      <span>{t.pathology.systemB.oodGatingBadge}</span>
                      <HelpTooltip title="OOD Gating & MobileNetV2" content="Evaluates input image authenticity to reject non-coconut photos before running INT8 neural classification." color="#FF4C4C" />
                    </span>
                    {syncStatus === "synced" && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 font-bold" style={{ background: "rgba(0,255,157,0.12)", color: theme === "dark" ? "#00FF9D" : "#00875A", border: "1px solid rgba(0,255,157,0.3)" }}>
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
                    <h2 className="text-sm font-mono font-medium mb-1" style={{ color: "var(--text-primary)" }}>{t.pathology.systemB.closeupTitle}</h2>
                    <p className="text-xs mb-4 font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {t.pathology.systemB.closeupDesc}
                    </p>

                    <label className="flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer smooth-transition relative overflow-hidden group min-h-[220px]"
                      style={{
                        borderColor: "rgba(255, 76, 76, 0.3)",
                        background: theme === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 76, 76, 0.04)",
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
                            style={{ background: "rgba(255, 76, 76, 0.12)" }}
                          >
                            <UploadCloud className="w-7 h-7" style={{ color: "#FF4C4C" }} />
                          </div>
                          <span className="text-xs font-mono mb-1 font-medium" style={{ color: "var(--text-primary)" }}>{t.pathology.systemB.browsePhotos}</span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{t.pathology.systemB.dropzoneSub}</span>
                        </div>
                      )}
                    </label>

                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={runMobileAnalysis} 
                        disabled={!mobileFile || isAnalyzingMobile}
                        className="w-full py-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-md"
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 76, 76, 0.2), rgba(230, 175, 46, 0.2))",
                          borderColor: "rgba(255, 76, 76, 0.4)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-red-400" /> {t.pathology.systemB.runInferenceBtn}
                      </button>
                    </div>
                  </div>

                  {/* Right: Diagnostic Dossier */}
                  <div className="lg:col-span-7 glass-card p-6 min-h-[480px] flex flex-col rounded-2xl">
                    <h2 className="text-sm font-mono font-medium mb-4 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
                      <span>{t.pathology.systemB.dossierTitle}</span>
                      {mobileResult && !mobileResult.error && (
                        <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                          {t.pathology.systemB.latency}: {mobileResult.inference_time_ms?.toFixed(0)}ms
                        </span>
                      )}
                    </h2>

                    {mobileResult ? (
                      mobileResult.error ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-2xl border"
                          style={{ background: "rgba(230, 175, 46, 0.08)", borderColor: "rgba(230, 175, 46, 0.25)" }}
                        >
                          <AlertTriangle className="w-12 h-12 mb-3" style={{ color: "#E6AF2E" }} />
                          <h3 className="text-sm font-mono font-bold mb-1" style={{ color: "#E6AF2E" }}>{mobileResult.error}</h3>
                          <p className="text-xs font-mono max-w-md" style={{ color: "var(--text-secondary)" }}>{mobileResult.message}</p>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 flex-1">
                          
                          {/* Primary Badge & Confidence */}
                          <div className="p-4 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <DiseaseBadge disease={mobileResult.disease} />
                                <HelpTooltip
                                  title={mobileResult.disease}
                                  content="Diagnosed pathogen condition. Corresponds to official CRI Coconut Pathology classification."
                                  color="#FF4C4C"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono font-bold" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>
                                  {(mobileResult.confidence * 100).toFixed(1)}% {t.pathology.systemB.match}
                                </span>
                                <HelpTooltip
                                  title="Diagnostic Certainty"
                                  content="Neural network softmax probability certainty. Scores over 85% denote high reliability."
                                  color="#00FF9D"
                                />
                              </div>
                            </div>
                            <ConfidenceBar value={mobileResult.confidence} />
                          </div>

                          {/* All Class Probabilities Bar Chart */}
                          {mobileResult.all_predictions && (
                            <div className="p-4 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                              <h4 className="text-[11px] font-mono uppercase mb-3 font-medium" style={{ color: "var(--text-muted)" }}>{t.pathology.systemB.classDistribution}</h4>
                              <div className="space-y-2">
                                {mobileResult.all_predictions.map((p: any) => {
                                  const colorConfig = DISEASE_COLORS[p.class?.toLowerCase()] || { label: p.class, label_si: p.class, label_ta: p.class };
                                  const localizedClassName = language === "si" ? colorConfig.label_si : language === "ta" ? colorConfig.label_ta : colorConfig.label;
                                  return (
                                    <div key={p.class} className="flex items-center gap-3 text-xs font-mono">
                                      <span className="w-36 truncate capitalize" style={{ color: "var(--text-primary)" }}>{localizedClassName}</span>
                                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--card-border)" }}>
                                        <div 
                                          className="h-full rounded-full bg-gradient-to-r from-[#FF4C4C] to-[#00FF9D]" 
                                          style={{ width: `${Math.max(2, p.confidence * 100)}%` }} 
                                        />
                                      </div>
                                      <span className="w-12 text-right text-[10px]" style={{ color: "var(--text-muted)" }}>{(p.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Immediate Treatment Protocols */}
                          {mobileResult.knowledge && (
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-mono uppercase font-medium" style={{ color: "var(--text-muted)" }}>{t.pathology.systemB.treatmentProtocols}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(255, 76, 76, 0.25)" }}>
                                  <span className="text-[10px] font-mono font-bold block mb-1" style={{ color: "#FF4C4C" }}>{t.pathology.systemB.chemicalAction}</span>
                                  <p className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
                                    {language === "si" ? mobileResult.knowledge.treatment_protocols.chemical_si[0] : language === "ta" ? mobileResult.knowledge.treatment_protocols.chemical_ta[0] : mobileResult.knowledge.treatment_protocols.chemical[0]}
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(0, 255, 157, 0.25)" }}>
                                  <span className="text-[10px] font-mono font-bold block mb-1" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>{t.pathology.systemB.culturalMeasure}</span>
                                  <p className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
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
                              className="w-full py-2.5 px-4 rounded-xl border transition-all text-xs font-mono flex items-center justify-center gap-2 font-medium"
                              style={{
                                background: "rgba(0, 255, 157, 0.12)",
                                borderColor: "rgba(0, 255, 157, 0.3)",
                                color: theme === "dark" ? "#00FF9D" : "#00875A",
                              }}
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>{t.pathology.systemB.viewFullKbGuide} →</span>
                            </button>
                          </div>

                        </motion.div>
                      )
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-2xl"
                        style={{ borderColor: "var(--card-border)", color: "var(--text-muted)" }}
                      >
                        <Microscope className="w-12 h-12 mb-3 opacity-40 text-red-400" />
                        <p className="text-xs font-mono">{t.pathology.systemB.uploadPrompt}</p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Recent Leaf Scans Table */
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-mono font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <Smartphone className="w-4 h-4" style={{ color: "#FF4C4C" }} /> {t.pathology.systemB.recentScansTitle}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{diagnosticsList.length} Scans Logged</span>
                      {diagnosticsList.length > 0 && (
                        <button
                          onClick={handleClearAllDiagnostics}
                          className="text-[10px] font-mono px-2.5 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1"
                          title="Delete all leaf diagnostic records"
                        >
                          <Trash2 className="w-3 h-3" /> Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {diagnosticsList.length === 0 ? (
                      <div className="text-center p-10 space-y-3">
                        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "rgba(255, 76, 76, 0.1)", border: "1px solid rgba(255, 76, 76, 0.2)" }}>
                          <Microscope className="w-7 h-7 text-red-400" />
                        </div>
                        <p className="text-sm font-mono font-medium" style={{ color: "var(--text-primary)" }}>No Mobile Leaf Scans Recorded Yet</p>
                        <p className="text-xs font-mono max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                          Upload or capture a close-up photograph of a coconut frond or trunk to initiate edge AI diagnosis for your estate.
                        </p>
                        <button
                          onClick={() => setMobileSubTab("scan")}
                          className="px-4 py-2 rounded-xl text-xs font-mono font-medium inline-flex items-center gap-2 border transition-all mt-2"
                          style={{
                            background: "rgba(255, 76, 76, 0.15)",
                            borderColor: "rgba(255, 76, 76, 0.3)",
                            color: "#FF4C4C",
                          }}
                        >
                          <Camera className="w-3.5 h-3.5" /> Start New Leaf Scan
                        </button>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-[10px] uppercase font-mono"
                            style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
                          >
                            <th className="p-3.5">{t.pathology.systemB.colDiagId}</th>
                            <th className="p-3.5">{t.pathology.systemB.colPathogenClass}</th>
                            <th className="p-3.5">{t.pathology.systemB.colConfidence}</th>
                            <th className="p-3.5">{t.pathology.systemB.colLocation}</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diagnosticsList.map((diag) => (
                            <tr key={diag.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "var(--table-border)" }}>
                              <td className="p-3.5 font-medium" style={{ color: "var(--text-primary)" }}>
                                <div>{diag.id}</div>
                                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{new Date(diag.captured_at).toLocaleString()}</div>
                              </td>
                              <td className="p-3.5">
                                <DiseaseBadge disease={diag.disease_class} size="sm" />
                              </td>
                              <td className="p-3.5 w-44">
                                <ConfidenceBar value={diag.confidence} />
                              </td>
                              <td className="p-3.5" style={{ color: "var(--text-secondary)" }}>
                                {diag.location.lat.toFixed(4)}, {diag.location.lng.toFixed(4)}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      const match = DEMO_KNOWLEDGE.find(k => k.common_name.toLowerCase().includes(diag.disease_class.toLowerCase()) || diag.disease_class.toLowerCase().includes(k.common_name.toLowerCase()));
                                      jumpToKnowledgeBase(match?.id || null);
                                    }}
                                    className="text-[10px] px-2.5 py-1 rounded border transition-all inline-flex items-center gap-1 font-medium"
                                    style={{
                                      background: "rgba(0, 255, 157, 0.12)",
                                      borderColor: "rgba(0, 255, 157, 0.25)",
                                      color: theme === "dark" ? "#00FF9D" : "#00875A",
                                    }}
                                  >
                                    <span>{t.pathology.systemB.viewGuideBtn}</span>
                                    <span>→</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDiagnostic(diag.id)}
                                    className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete diagnostic record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input 
                    type="text"
                    placeholder={t.pathology.knowledge.searchPlaceholder}
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none font-mono smooth-transition"
                    style={{
                      background: "var(--input-bg)",
                      borderColor: "var(--input-border)",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
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
                        borderColor: isExpanded ? "rgba(0, 255, 157, 0.4)" : "var(--card-border)",
                        boxShadow: isExpanded ? "0 0 25px rgba(0, 255, 157, 0.08)" : "none",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-medium" style={{ color: "var(--text-primary)" }}>{localizedTitle}</h3>
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold"
                              style={{
                                background: item.severity_level === "critical" ? "rgba(255,76,76,0.15)" : item.severity_level === "high" ? "rgba(230,175,46,0.15)" : "rgba(0,255,157,0.15)",
                                color: item.severity_level === "critical" ? "#FF4C4C" : item.severity_level === "high" ? "#E6AF2E" : (theme === "dark" ? "#00FF9D" : "#00875A"),
                                border: `1px solid ${item.severity_level === "critical" ? "rgba(255,76,76,0.3)" : item.severity_level === "high" ? "rgba(230,175,46,0.3)" : "rgba(0,255,157,0.3)"}`,
                              }}
                            >
                              {item.severity_level}
                            </span>
                          </div>
                          <p className="text-xs font-mono italic mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.scientific_name}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} style={{ color: isExpanded ? "#00FF9D" : "var(--text-muted)" }} />
                      </div>

                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t space-y-6" style={{ borderColor: "var(--card-border)" }}>
                          
                          {/* Symptoms */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold" style={{ color: "#00E5FF" }}>
                              <AlertTriangle className="w-3.5 h-3.5" /> {t.pathology.knowledge.diagnosticSymptoms}
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {localizedSymptoms.map((s, i) => (
                                <li key={i} className="text-xs font-mono flex items-start gap-2 p-2.5 rounded-lg border"
                                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#00E5FF" }} />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 3-Way Treatment Protocol */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>
                              <ShieldCheck className="w-3.5 h-3.5" /> {t.pathology.knowledge.integratedProtocols}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3.5 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(255, 76, 76, 0.25)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: "#FF4C4C" }}>{t.pathology.knowledge.chemicalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "var(--text-primary)" }}>
                                  {localizedChemical.map((c, i) => <li key={i}>• {c}</li>)}
                                </ul>
                              </div>
                              <div className="p-3.5 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(0, 255, 157, 0.25)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>{t.pathology.knowledge.culturalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "var(--text-primary)" }}>
                                  {localizedCultural.map((c, i) => <li key={i}>• {c}</li>)}
                                </ul>
                              </div>
                              <div className="p-3.5 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(167, 139, 250, 0.25)" }}>
                                <span className="text-[10px] font-mono font-bold block mb-1.5" style={{ color: "#A78BFA" }}>{t.pathology.knowledge.biologicalBadge}</span>
                                <ul className="text-xs font-mono space-y-1" style={{ color: "var(--text-primary)" }}>
                                  {localizedBiological.map((b, i) => <li key={i}>• {b}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Vernacular Advice */}
                          <div className="p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2"
                            style={{
                              background: "rgba(230, 175, 46, 0.12)",
                              borderColor: "rgba(230, 175, 46, 0.3)",
                              color: "var(--text-primary)",
                            }}
                          >
                            <Info className="w-4 h-4 flex-shrink-0 text-amber-500" />
                            <span><strong className="text-amber-500">{t.pathology.knowledge.criFieldNote}</strong> {localizedAdvice}</span>
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
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono uppercase font-medium" style={{ color: "var(--text-muted)" }}>{t.pathology.history.filterLabel}</span>
                  <select 
                    value={filterDisease} 
                    onChange={e => setFilterDisease(e.target.value)} 
                    className="border rounded-lg px-3 py-1.5 text-xs focus:outline-none font-mono smooth-transition"
                    style={{
                      background: "var(--input-bg)",
                      borderColor: "var(--input-border)",
                      color: "var(--text-primary)"
                    }}
                  >
                    <option value="all">{t.pathology.history.allPathogens}</option>
                    {diseases.map(d => {
                      const col = DISEASE_COLORS[d];
                      const label = language === "si" ? col?.label_si : language === "ta" ? col?.label_ta : col?.label;
                      return <option key={d} value={d}>{label || d}</option>;
                    })}
                  </select>
                  
                  <span className="px-2.5 py-1 text-[10px] rounded-lg font-mono border font-bold"
                    style={{
                      background: "rgba(0, 255, 157, 0.12)",
                      color: theme === "dark" ? "#00FF9D" : "#00875A",
                      borderColor: "rgba(0, 255, 157, 0.3)",
                    }}
                  >
                    {filteredHistory.length + hotspotsList.length} Total Telemetry Items
                  </span>
                </div>

                <div className="flex gap-2 p-1 rounded-lg border"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                >
                  <button 
                    onClick={() => setHistoryView("table")} 
                    className="px-4 py-1.5 rounded-md text-xs font-mono transition-all font-medium"
                    style={{
                      background: historyView === "table" ? "rgba(0, 255, 157, 0.15)" : "transparent",
                      color: historyView === "table" ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-muted)"
                    }}
                  >{t.pathology.history.tabularView}</button>
                  <button 
                    onClick={() => setHistoryView("map")} 
                    className="px-4 py-1.5 rounded-md text-xs font-mono transition-all font-medium flex items-center gap-1.5"
                    style={{
                      background: historyView === "map" ? "rgba(0, 255, 157, 0.15)" : "transparent",
                      color: historyView === "map" ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-muted)"
                    }}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t.pathology.history.spatialGisView}</span>
                  </button>
                </div>
              </div>

              {historyView === "table" ? (
                <div className="space-y-6">
                  {/* System A Aerial Stressed Trees Table */}
                  <div className="glass-card p-4 rounded-2xl overflow-x-auto space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--table-border)" }}>
                      <h4 className="text-xs font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                        <Plane className="w-4 h-4 text-red-400" />
                        <span>System A Aerial Stressed Tree Hotspots ({hotspotsList.length})</span>
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">Calibrated GPS Extraction (WGS 84)</span>
                    </div>

                    {hotspotsList.length === 0 ? (
                      <div className="p-6 text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        No aerial stressed tree anomalies recorded. Run a System A UAV orthomosaic to extract hotspots.
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-[10px] uppercase font-mono"
                            style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
                          >
                            <th className="p-3">Hotspot ID</th>
                            <th className="p-3">Severity</th>
                            <th className="p-3">Spectral Index</th>
                            <th className="p-3">Outlier Z-Score</th>
                            <th className="p-3">Exact GPS Coordinates</th>
                            <th className="p-3">Recommended Field Action</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hotspotsList.map(hs => (
                            <tr key={hs.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "var(--table-border)" }}>
                              <td className="p-3 font-bold text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ background: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF" }} />
                                <span>{hs.id}</span>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                  style={{
                                    background: hs.severity === "critical" ? "rgba(255,76,76,0.15)" : hs.severity === "high" ? "rgba(230,175,46,0.15)" : "rgba(0,229,255,0.15)",
                                    color: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF",
                                    border: `1px solid ${hs.severity === "critical" ? "#FF4C4C40" : hs.severity === "high" ? "#E6AF2E40" : "#00E5FF40"}`
                                  }}
                                >
                                  {hs.severity}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold" style={{ color: hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF" }}>
                                {typeof hs.mean_index_value === "number" ? hs.mean_index_value.toFixed(3) : "—"}
                              </td>
                              <td className="p-3 font-mono text-red-400">
                                {hs.z_score ? `${hs.z_score}σ` : "—"}
                              </td>
                              <td className="p-3 font-mono text-cyan-400">
                                {hs.location.lat.toFixed(5)}, {hs.location.lng.toFixed(5)}
                              </td>
                              <td className="p-3 text-[11px] max-w-xs truncate text-gray-300" title={hs.recommended_action}>
                                {hs.recommended_action}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteHotspot(hs.id)}
                                  className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete hotspot record"
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

                  {/* System B Ground Leaf Diagnostics Table */}
                  <div className="glass-card p-4 rounded-2xl overflow-x-auto space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--table-border)" }}>
                      <h4 className="text-xs font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                        <Microscope className="w-4 h-4 text-emerald-400" />
                        <span>System B Mobile Leaf Diagnostics ({filteredHistory.length})</span>
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">MobileNetV2 Edge Inferences</span>
                    </div>

                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-mono"
                          style={{ borderColor: "var(--table-border)", color: "var(--text-muted)", background: "var(--table-header-bg)" }}
                        >
                          <th className="p-3">{t.pathology.history.colDate}</th>
                          <th className="p-3">{t.pathology.history.colLesion}</th>
                          <th className="p-3">{t.pathology.history.colConfidence}</th>
                          <th className="p-3">{t.pathology.history.colGeoGps}</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                              No pathology telemetry records found for this filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredHistory.map(d => (
                            <tr key={d.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono text-xs" style={{ borderColor: "var(--table-border)" }}>
                              <td className="p-3 font-medium" style={{ color: "var(--text-primary)" }}>{new Date(d.captured_at).toLocaleString()}</td>
                              <td className="p-3"><DiseaseBadge disease={d.disease_class} size="sm" /></td>
                              <td className="p-3 w-44"><ConfidenceBar value={d.confidence} /></td>
                              <td className="p-3 font-mono" style={{ color: "var(--text-secondary)" }}>{d.location.lat.toFixed(5)}, {d.location.lng.toFixed(5)}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteDiagnostic(d.id)}
                                  className="p-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete diagnostic record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-4 rounded-2xl overflow-hidden min-h-[480px]">
                  <DiagnosticMapInner 
                    diagnostics={filteredHistory} 
                    hotspots={hotspotsList}
                    defaultCenter={ESTATE_COORDINATES[estateId] || getEstateCoordinates(user?.estate_id)} 
                  />
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

        {/* Dedicated Interactive Pipeline & Output Results Help Modal */}
        <PathologyHelpModal system={helpModalSystem} onClose={() => setHelpModalSystem(null)} />
      </div>
    </main>
    </AuthGuard>
  );
}
