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
};

// ─── Yield Prediction ───
export const yield_ = {
  predict45Day: (data: {
    soil_moisture: number;
    temperature: number;
    humidity: number;
    palm_age: number;
    palm_health: number;
  }) => request('/api/predict/45day', { method: 'POST', body: data }),

  predict: (data: Record<string, number>) =>
    request('/api/predict', { method: 'POST', body: data }),
};

// ─── Advisory System ───
export const advisory = {
  ask: (question: string, language: string = 'en', sessionId?: string) =>
    request('/api/advisory/ask', {
      method: 'POST',
      body: { question, language, session_id: sessionId },
    }),

  askMulti: (question: string, language: string = 'en', sessionId?: string) =>
    request('/api/advisory/ask-multi', {
      method: 'POST',
      body: { question, language, session_id: sessionId },
    }),
};

// ─── Health Check ───
export const health = {
  check: () => request<{ status: string }>('/health'),
};

export default { auth, soil, pathology, yield: yield_, advisory, health };
