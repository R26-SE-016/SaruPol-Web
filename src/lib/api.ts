// ─── SaruPol Unified API Client ───
// Connects to SaruPol-Gateway (http://localhost:8000) with offline mock fallback

declare const process: { env: Record<string, string | undefined> };

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
const SOIL_API_URL = process.env.NEXT_PUBLIC_SOIL_API_URL || 'https://coconut-soil-intelligence-1.onrender.com';

// Direct URL to the Advisory Backend (coconut_advisory_system) for binary streams (TTS audio, CRI images)
const ADVISORY_BACKEND_URL = process.env.NEXT_PUBLIC_ADVISORY_BACKEND_URL || 'https://coconut-advisory-system-production.up.railway.app';

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${GATEWAY_URL}${path}`;

  // Automatically attach auth token if present in localStorage
  let authHeader: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sarupol_auth_token");
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeader,
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = isFormData ? (options.body as FormData) : JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      throw new Error(`Gateway returned ${res.status}`);
    }
    return res.json();
  } catch {
    console.warn(`[SaruPol API] Gateway unreachable at ${url}. Trying direct fallback.`);

    // If it's a soil / nutrient / location endpoint, try direct Render deployment fallback
    if (path.includes('soil') || path.includes('nutrient') || path.includes('location')) {
      try {
        const cleanPath = path.replace(/^\/api\/soil/, '/api/v1');
        const directUrl = `${SOIL_API_URL}${cleanPath}`;
        const directRes = await fetch(directUrl, config);
        if (directRes.ok) {
          return directRes.json();
        }
      } catch (err) {
        console.warn(`[SaruPol API] Direct Soil API fallback unreachable.`);
      }
    }
    throw new Error('GATEWAY_OFFLINE');
  }
}

// ─── Auth API ───
export interface AuthUserResponse {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  estate_id?: string;
  phone?: string;
  created_at?: string;
}

export const auth = {
  login: (email: string, password: string) =>
    request<{ message: string; token: string; user: AuthUserResponse }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (data: { name: string; email: string; password: string; role?: string; estate_id?: string; phone?: string; district?: string }) =>
    request<{ message: string; token: string; user: AuthUserResponse }>('/api/auth/register', {
      method: 'POST',
      body: data,
    }),

  getProfile: () =>
    request<{ user: AuthUserResponse }>('/api/auth/profile'),
};

// ─── Coconut Soil & Nutrient Intelligence API ───
export const soil = {
  // 1. Visual Leaf Nutrient Deficiency Prediction (Multipart file upload)
  predictVisualNutrient: (formData: FormData) =>
    request<any>('/api/soil/nutrient-analysis/predict', {
      method: 'POST',
      body: formData,
    }),

  // 2. Certified Laboratory DFR Recommendation
  recommendLab: (data: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    magnesium?: number | null;
    palm_age: number;
    zone: string;
  }) =>
    request<any>('/api/soil/nutrient-analysis/lab-recommendation', {
      method: 'POST',
      body: data,
    }),

  // 3. Agro-Ecological GIS Zone from Coordinates (NSDI Service)
  getAgroZone: (latitude: number, longitude: number) =>
    request<any>('/api/soil/location/agro-zone', {
      method: 'POST',
      body: { latitude, longitude },
    }),

  // 4. Deficiencies Knowledge Base & Symptoms
  getDeficiencies: () =>
    request<any>('/api/soil/nutrient-analysis/deficiencies', {
      method: 'GET',
    }),

  // 5. Scans History (Firestore)
  saveScan: (data: any) =>
    request<any>('/api/soil/nutrient-analysis/scans', {
      method: 'POST',
      body: data,
    }),

  getScans: (userId: string) =>
    request<any>(`/api/soil/nutrient-analysis/scans?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
    }),

  deleteScan: (scanId: string, userId: string) =>
    request<any>(`/api/soil/nutrient-analysis/scans/${encodeURIComponent(scanId)}?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }),

  // 6. Certified Lab Calculations History (Firestore)
  saveLabCalculation: (data: any) =>
    request<any>('/api/soil/nutrient-analysis/lab-calculations', {
      method: 'POST',
      body: data,
    }),

  getLabCalculations: (userId: string) =>
    request<any>(`/api/soil/nutrient-analysis/lab-calculations?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
    }),

  deleteLabCalculation: (calcId: string, userId: string) =>
    request<any>(`/api/soil/nutrient-analysis/lab-calculations/${encodeURIComponent(calcId)}?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }),

  // Backward compatibility legacy methods
  predictTriangulated: (data: any) =>
    request<any>('/api/v1/predict/triangulated', { method: 'POST', body: data }),

  predictSingle: (data: any) =>
    request<any>('/api/v1/predict/single', { method: 'POST', body: data }),
};

// ─── Pathology Detection ───
export const pathology = {
  classify: (imageBase64: string, part: string = 'leaf') =>
    request('/api/pathology/classify', {
      method: 'POST',
      body: { imageBase64, part, system: 'B' },
    }),

  processAerialSpectral: (data: {
    image: string;
    nir_image?: string;
    index_type: 'VARI' | 'NDVI';
    estate_id: string;
    gps_bounds?: { lat: number; lng: number; span_lat: number; span_lng: number };
  }) =>
    request<any>('/api/pathology/aerial/spectral', {
      method: 'POST',
      body: data,
    }),

  getCanopyHotspots: (estateId: string, status?: string) =>
    request<any>(
      `/api/pathology/aerial/hotspots?estate_id=${estateId}${status ? `&status=${status}` : ''}`
    ),

  updateHotspotStatus: (hotspotId: string, status: 'pending' | 'inspected' | 'resolved', leafDiagnosticId?: string) =>
    request<any>(`/api/pathology/aerial/hotspots/${hotspotId}`, {
      method: 'PATCH',
      body: { status, leaf_diagnostic_id: leafDiagnosticId },
    }),

  getHistory: (userId: string, estateId?: string) =>
    request<any>(`/api/pathology/history?user_id=${userId}${estateId ? `&estate_id=${estateId}` : ''}`),

  sync: (diagnostics: any[]) =>
    request<any>('/api/pathology/sync', {
      method: 'POST',
      body: { diagnostics },
    }),
};

// ─── Yield Prediction Types & API ───
export interface YieldPredictionInput {
  estate?: string;
  district?: string;
  year?: number;
  month?: number;
  trees_count?: number;
  temperature?: number;
  humidity?: number;
  soil_moisture?: number;
  rainfall?: number;
  palm_age?: number;
  palm_health?: number;
  fertilizer?: number;
  soil_n?: number;
  soil_p?: number;
  soil_k?: number;
  last_harvest_yield?: number;
  actual_harvest_logs?: { actual_yield_nuts: number; predicted_yield_nuts: number }[];
}

export interface YieldPredictionResponse {
  success: boolean;
  district: string;
  estate: string;
  mapped_benchmark_estate: string;
  year: number;
  month: number;
  trees_count: number;
  calibration_applied: boolean;
  calibration_factor: number;
  predicted_monthly_yield: number;
  predicted_next_pick_yield_nuts: number;
  predicted_annual_yield_nuts: number;
  confidence_percentage: number;
  rf_prediction?: number;
  lstm_prediction?: number;
  penalty_percent?: number;
  estimated_leaf_nutrients?: {
    leaf_n: number;
    leaf_p: number;
    leaf_k: number;
  } | null;
  recommendations?: string[] | null;
  error?: string;
}

export interface CdaRatesResponse {
  success: boolean;
  a_grade_price: number;
  b_grade_price: number;
  c_grade_price: number;
  last_updated: string;
}

export const yield_ = {
  predict45Day: (data: Partial<YieldPredictionInput>) =>
    request<YieldPredictionResponse>('/api/predict/45day', {
      method: 'POST',
      body: data,
    }),

  predict: (data: YieldPredictionInput) =>
    request<YieldPredictionResponse>('/api/predict', {
      method: 'POST',
      body: data,
    }),

  fetchCdaRates: () =>
    request<CdaRatesResponse>('/api/cda-rates'),

  getHistory: () =>
    request<{ success: boolean; records: any[] }>('/api/history'),
};

// ─── Advisory System Types & API ───
export interface AdvisorySource {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface AdvisoryImageRef {
  url: string;
  caption: string;
  source: string;
}

export interface AdvisoryAnswerResponse {
  success: boolean;
  question: string;
  answer: string;
  sources: AdvisorySource[];
  images?: AdvisoryImageRef[];
  zone?: string;
  season?: string;
  confidence?: number;
  retrieval_confidence: number;
  combined_reliability: number;
  reliability_level: 'High' | 'Moderate' | 'Low';
  context_used?: string;
  session_id?: string;
  consensus_score?: number;
  validated_by?: string;
  early_exit?: boolean;
}

export interface MultiLLMAdvisoryResponse {
  success: boolean;
  best_answer: string;
  best_model: string;
  reason: string;
  consensus_score: number;
  retrieval_confidence: number;
  combined_reliability: number;
  reliability_level: 'High' | 'Moderate' | 'Low';
  llama_answer?: string;
  gpt4omini_answer?: string;
  gemma_answer?: string;
  qwen_answer?: string;
  sources: AdvisorySource[];
  images?: AdvisoryImageRef[];
  zone?: string;
  season?: string;
  early_exit?: boolean;
  similarity_score?: number;
  latency_ms?: number;
  session_id?: string;
}

export interface TranslateItem {
  id: string;
  text: string;
}

export interface TranslateBatchResponse {
  success: boolean;
  translations: { id: string; translated_text: string }[];
}

export interface TranscribeResponse {
  success: boolean;
  transcribed_text: string;
  detected_language: string;
  duration_ms: number;
  error?: string;
}

// Direct request to advisory backend (bypasses gateway for faster advisory responses)
async function directAdvisoryRequest<T>(path: string, body: unknown): Promise<T> {
  const url = `${ADVISORY_BACKEND_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Advisory backend returned ${res.status}`);
    }
    return res.json();
  } catch {
    console.warn(`[SaruPol Advisory] Direct backend at ${url} unreachable. Falling back to gateway.`);
    throw new Error('ADVISORY_BACKEND_OFFLINE');
  }
}

export const advisory = {
  ask: async (data: {
    question: string;
    context?: string | null;
    language?: string;
    session_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }): Promise<AdvisoryAnswerResponse> => {
    // Try direct backend first, then gateway fallback
    try {
      return await directAdvisoryRequest<AdvisoryAnswerResponse>('/ask', data);
    } catch {
      return request<AdvisoryAnswerResponse>('/api/advisory/ask', {
        method: 'POST',
        body: data,
      });
    }
  },

  askMulti: async (data: {
    question: string;
    context?: string | null;
    language?: string;
    session_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }): Promise<MultiLLMAdvisoryResponse> => {
    try {
      return await directAdvisoryRequest<MultiLLMAdvisoryResponse>('/ask-multi', data);
    } catch {
      return request<MultiLLMAdvisoryResponse>('/api/advisory/ask-multi', {
        method: 'POST',
        body: data,
      });
    }
  },

  translateBatch: async (messages: TranslateItem[], targetLang: 'en' | 'si' | 'ta'): Promise<TranslateBatchResponse> => {
    try {
      return await directAdvisoryRequest<TranslateBatchResponse>('/translate-batch', { messages, target_lang: targetLang });
    } catch {
      return request<TranslateBatchResponse>('/api/advisory/translate-batch', {
        method: 'POST',
        body: { messages, target_lang: targetLang },
      });
    }
  },

  transcribe: async (audioBlob: Blob, language: string = 'auto'): Promise<TranscribeResponse> => {
    const formData = new FormData();
    const mime = audioBlob.type || '';
    const ext = mime.includes('webm') ? 'webm'
      : mime.includes('ogg') ? 'ogg'
      : mime.includes('mp4') || mime.includes('m4a') || mime.includes('aac') ? 'm4a'
      : mime.includes('mpeg') ? 'mp3'
      : 'wav';
    formData.append('audio', audioBlob, `recording.${ext}`);
    formData.append('language', language || 'auto');

    // Try direct backend first (better for binary uploads), fallback to gateway
    const urls = [
      `${ADVISORY_BACKEND_URL}/transcribe`,
      `${GATEWAY_URL}/api/advisory/transcribe`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return res.json();
        }
      } catch {
        console.warn(`[SaruPol STT] ${url} unreachable, trying fallback...`);
      }
    }
    throw new Error('Transcription failed: all endpoints unreachable');
  },

  getTtsUrl: (text: string, lang: string = 'en') =>
    `${ADVISORY_BACKEND_URL}/tts?text=${encodeURIComponent(text)}&lang=${lang}`,

  // Resolve CRI reference image URL — images served from advisory backend /static/images/
  getImageUrl: (filename: string) => {
    if (!filename) return '/brand/logo-icon.png';
    // If already a full URL, return as-is
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
    // Strip any /static/images/ prefix
    const clean = filename.replace(/^\/?(static\/images\/)?/, '');
    // Try local /cri-reference/ first — images bundled in public/ folder
    return `/cri-reference/${clean}`;
  },

  // Resolve CRI reference image URL directly from the advisory backend
  getBackendImageUrl: (filename: string) => {
    if (!filename) return '/brand/logo-icon.png';
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
    const clean = filename.replace(/^\/?(static\/images\/)?/, '');
    return `${ADVISORY_BACKEND_URL}/static/images/${encodeURIComponent(clean)}`;
  },

  getHealth: () =>
    request<{ status: string; rag_loaded: boolean; retriever_loaded: boolean }>('/api/advisory/health'),
};

// ─── Health Check ───
export const health = {
  check: () => request<{ status: string }>('/health'),
};

const api = { auth, soil, pathology, yield: yield_, advisory, health };
export default api;
