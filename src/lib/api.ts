// ─── SaruPol Unified API Client ───
// Connects to SaruPol-Gateway (http://localhost:8000) with offline mock fallback

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

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

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      throw new Error(`Gateway returned ${res.status}`);
    }
    return res.json();
  } catch {
    console.warn(`[SaruPol API] Gateway unreachable at ${url}. Using offline mode.`);
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

// ─── Soil Intelligence ───
export const soil = {
  predictTriangulated: (data: {
    tree_no: number | string;
    zone_id?: string;
    point_a: { N: number; P: number; K: number; pH?: number; moisture?: number; temperature?: number; EC?: number };
    point_b: { N: number; P: number; K: number; pH?: number; moisture?: number; temperature?: number; EC?: number };
    point_c: { N: number; P: number; K: number; pH?: number; moisture?: number; temperature?: number; EC?: number };
  }) => request<any>('/api/v1/predict/triangulated', { method: 'POST', body: data }),

  predictSingle: (data: {
    tree_no: number | string;
    zone_id?: string;
    reading: { N: number; P: number; K: number; pH?: number; moisture?: number; temperature?: number; EC?: number };
  }) => request<any>('/api/v1/predict/single', { method: 'POST', body: data }),

  predictVisualNutrient: (formData: FormData) =>
    request<any>('/api/v1/nutrient-analysis/predict', {
      method: 'POST',
      body: formData,
    }),

  recommendLab: (data: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    magnesium?: number;
    palm_age: number;
    zone: string;
  }) => request<any>('/api/v1/recommend/lab', { method: 'POST', body: data }),

  getAgroZone: (latitude: number, longitude: number) =>
    request<any>('/api/v1/location/agro-zone', {
      method: 'POST',
      body: { latitude, longitude },
    }),

  getTrees: () => request<any>('/api/v1/trees'),

  startAnalysis: (treeNo: string) =>
    request<any>('/api/v1/analysis/start', {
      method: 'POST',
      body: { tree_no: treeNo },
    }),

  recordReading: (data: {
    analysis_id: string;
    tree_no: string;
    point_name: string;
    reading: { N: number; P: number; K: number; pH?: number; moisture?: number; temperature?: number; EC?: number };
  }) => request<any>('/api/v1/analysis/reading', { method: 'POST', body: data }),

  completeAnalysis: (data: { analysis_id: string; tree_no: string }) =>
    request<any>('/api/v1/analysis/complete', { method: 'POST', body: data }),
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

export default { auth, soil, pathology, yield: yield_, advisory, health };
