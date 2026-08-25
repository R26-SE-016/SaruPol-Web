// ─── SaruPol Unified Platform: TypeScript Domain Schemas ───
// Strict schemas for all 6 research subsystems routed through SaruPol-Gateway (:8000)

// ─── Auth ───
export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
}

// ─── Soil Intelligence (CRI DFR Engine) ───
export interface SoilNPKReading {
  N: number;
  P: number;
  K: number;
  pH: number;
}

export interface TriangulatedSoilRequest {
  tree_no: number;
  zone_id: string;
  point_a: SoilNPKReading;
  point_b: SoilNPKReading;
  point_c: SoilNPKReading;
}

export interface SingleSoilRequest {
  tree_no: number;
  zone_id: string;
  reading: SoilNPKReading;
}

export interface FertilizerRecommendation {
  urea_g: number;
  erp_g: number;
  mop_g: number;
  dolomite_g: number;
}

export interface LeafNPKPrediction {
  leaf_N: number;
  leaf_P: number;
  leaf_K: number;
}

export interface SoilPredictionResponse {
  tree_no: number;
  zone_id: string;
  composite_soil: SoilNPKReading;
  predicted_leaf_npk: LeafNPKPrediction;
  fertilizer_recommendation: FertilizerRecommendation;
  npk_status: Record<string, string>;
  timestamp: string;
}

// ─── Pathology Detection ───
export type DiseaseSeverity = 'Critical' | 'High' | 'Moderate' | 'Healthy';

export interface DiseaseClassification {
  disease_class: string;
  confidence: number;
  all_predictions: Array<{ class: string; confidence: number }>;
  inference_time_ms: number;
  system: string;
  part: string;
  status: 'healthy' | 'diseased';
  diagnosis: string;
  severity: DiseaseSeverity;
  recommendations: {
    chemical: string;
    cultural: string;
    preventive: string;
  };
  timestamp: string;
  source?: string;
}

export interface PathologyClassifyRequest {
  imageBase64: string;
  part: 'leaf' | 'trunk';
  system?: string;
}

// ─── Yield Prediction (CocoCastAI) ───
export interface YieldPredictionRequest {
  soil_moisture: number;
  temperature: number;
  humidity: number;
  palm_age: number;
  palm_health: number;
}

export interface YieldPredictionResponse {
  prediction: number;
  confidence_interval: [number, number];
  cycle: string;
  recommendations: string[];
}

export interface AnnualYieldResponse {
  ensemble_prediction: number;
  confidence_interval: [number, number];
  individual_models: {
    random_forest: number;
    gradient_boosting: number;
    xgboost: number;
    lightgbm: number;
  };
  seasonal_forecast: Array<{ month: string; yield: number }>;
  insights: string[];
}

// ─── Advisory System (Multi-LLM RAG) ───
export interface AdvisoryRequest {
  question: string;
  language?: 'en' | 'si' | 'ta';
  session_id?: string;
  latitude?: number;
  longitude?: number;
}

export interface SourceDocument {
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ImageReference {
  url: string;
  caption: string;
  source: string;
}

export interface AdvisoryResponse {
  success: boolean;
  question: string;
  answer: string;
  sources: SourceDocument[];
  images: ImageReference[];
  zone?: string;
  season?: string;
  confidence?: number;
  retrieval_confidence: number;
  combined_reliability: number;
  reliability_level: string;
  session_id?: string;
  model_used?: string;
}

export interface MultiLLMResponse {
  success: boolean;
  best_answer: string;
  best_model: string;
  reason: string;
  consensus_score: number;
  sources: SourceDocument[];
  images: ImageReference[];
  zone?: string;
  season?: string;
  llama_answer?: string;
  llama8b_answer?: string;
  gemma_answer?: string;
  qwen_answer?: string;
  early_exit?: boolean;
  similarity_score?: number;
  latency_ms?: number;
  retrieval_confidence: number;
  combined_reliability: number;
  reliability_level: string;
}

// ─── Operations ───
export interface TreeRecord {
  tree_no: number;
  zone_id: string;
  gps: { lat: number; lng: number };
  palm_age: number;
  palm_health: number;
  last_harvest_date?: string;
  last_inspection_date?: string;
}

export interface CanopyHotspot {
  id: string;
  estate_id: string;
  location: { lat: number; lng: number };
  severity: 'critical' | 'high' | 'moderate';
  mean_index_value: number;
  radius_meters: number;
  recommended_action: string;
  status: 'pending' | 'inspected' | 'resolved';
  created_at: string;
}

// ─── System Status ───
export type SystemStatus = 'online' | 'offline' | 'degraded';

export interface SubsystemHealth {
  name: string;
  status: SystemStatus;
  latency_ms?: number;
}
