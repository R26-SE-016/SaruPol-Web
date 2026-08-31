// ─── SaruPol Unified API Client ───
// Connects to SaruPol-Gateway (http://localhost:8000) with offline mock fallback

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${GATEWAY_URL}${path}`;
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
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

// ─── Auth ───
export const auth = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  register: (name: string, email: string, password: string) =>
    request('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
};

// ─── Soil Intelligence ───
export const soil = {
  predictTriangulated: (data: {
    tree_no: number;
    zone_id: string;
    point_a: { N: number; P: number; K: number; pH: number };
    point_b: { N: number; P: number; K: number; pH: number };
    point_c: { N: number; P: number; K: number; pH: number };
  }) => request('/api/v1/predict/triangulated', { method: 'POST', body: data }),

  predictSingle: (data: {
    tree_no: number;
    zone_id: string;
    reading: { N: number; P: number; K: number; pH: number };
  }) => request('/api/v1/predict/single', { method: 'POST', body: data }),
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

export const advisory = {
  ask: (data: {
    question: string;
    context?: string | null;
    language?: string;
    session_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) =>
    request<AdvisoryAnswerResponse>('/api/advisory/ask', {
      method: 'POST',
      body: data,
    }),

  askMulti: (data: {
    question: string;
    context?: string | null;
    language?: string;
    session_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) =>
    request<MultiLLMAdvisoryResponse>('/api/advisory/ask-multi', {
      method: 'POST',
      body: data,
    }),

  translateBatch: (messages: TranslateItem[], targetLang: 'en' | 'si' | 'ta') =>
    request<TranslateBatchResponse>('/api/advisory/translate-batch', {
      method: 'POST',
      body: { messages, target_lang: targetLang },
    }),

  transcribe: async (audioBlob: Blob, language: string = 'auto'): Promise<TranscribeResponse> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('language', language);

    const res = await fetch(`${GATEWAY_URL}/api/advisory/transcribe`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Transcription failed with status ${res.status}`);
    }
    return res.json();
  },

  getTtsUrl: (text: string, lang: string = 'en') =>
    `${GATEWAY_URL}/api/advisory/tts?text=${encodeURIComponent(text)}&lang=${lang}`,

  getHealth: () =>
    request<{ status: string; rag_loaded: boolean; retriever_loaded: boolean }>('/api/advisory/health'),
};

// ─── Health Check ───
export const health = {
  check: () => request<{ status: string }>('/health'),
};

export default { auth, soil, pathology, yield: yield_, advisory, health };
