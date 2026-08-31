/**
 * User-Scoped Pathology Storage & GIS Telemetry Management
 * Provides persistent, isolated diagnostic and aerial survey records for each user account.
 */

export interface UserDiagnosticRecord {
  id: string;
  disease_class: string;
  confidence: number;
  location: { lat: number; lng: number };
  captured_at: string;
  estate_name: string;
  user_id: string;
  user_email?: string;
  image_base64?: string;
  entropy?: number;
  synced?: boolean;
}

export interface UserAerialSurveyRecord {
  id: string;
  estate_name: string;
  date: string;
  index_type: "VARI" | "NDVI";
  mean_index: number;
  healthy_canopy_pct: number;
  detected_palms: number;
  anomalies_count: number;
  status: string;
  user_id: string;
  user_email?: string;
}

// Representative Agro-Climatic GPS coordinates for Sri Lankan coconut estates
export const ESTATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Makandura Experimental Estate (Intermediate Zone)": { lat: 7.3275, lng: 79.9880 },
  "Lunuwila CRI Headquarters (Wet Zone)": { lat: 7.3414, lng: 79.8656 },
  "Puttalam Seed Garden (Dry Zone)": { lat: 8.0362, lng: 79.8283 },
  "Ratnapura High-Rainfall Estate (Wet Zone)": { lat: 6.6828, lng: 80.4034 },
  "Batticaloa Coastal Research Station (Dry Zone)": { lat: 7.7170, lng: 81.7000 },
  "Kurunegala Commercial Block (Intermediate Zone)": { lat: 7.4863, lng: 80.3623 },
  "Gampaha / Negombo Smallholding (Wet Zone)": { lat: 7.0840, lng: 79.9939 },
  "Chilaw Coconut Holding (Intermediate Zone)": { lat: 7.5758, lng: 79.7953 },
  "Kuliyapitiya Commercial Plantation (Intermediate Zone)": { lat: 7.4689, lng: 80.0401 },
  "Madampe Coconut Grove (Intermediate Zone)": { lat: 7.5021, lng: 79.8450 },
  "Puttalam Commercial Holding (Dry Zone)": { lat: 8.0362, lng: 79.8283 },
  "Kalutara Coastal Smallholding (Wet Zone)": { lat: 6.5854, lng: 79.9607 },
  "Other / Private Coconut Plantation": { lat: 7.3000, lng: 80.0000 },
};

export function getEstateCoordinates(estateName?: string): { lat: number; lng: number } {
  if (!estateName) return { lat: 7.3275, lng: 79.9880 };
  return ESTATE_COORDINATES[estateName] || { lat: 7.3275, lng: 79.9880 };
}

// Initial seed diagnostics for demo research accounts
const DEMO_SEEDED_DIAGNOSTICS: UserDiagnosticRecord[] = [
  {
    id: "diag-001",
    disease_class: "bud rot",
    confidence: 0.94,
    location: { lat: 7.3285, lng: 79.9892 },
    captured_at: "2026-08-28T10:30:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
  },
  {
    id: "diag-002",
    disease_class: "gray leaf spot",
    confidence: 0.88,
    location: { lat: 7.3298, lng: 79.9875 },
    captured_at: "2026-08-27T11:15:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
  },
  {
    id: "diag-003",
    disease_class: "healthy leaves",
    confidence: 0.98,
    location: { lat: 7.3265, lng: 79.9908 },
    captured_at: "2026-08-27T09:20:00Z",
    estate_name: "Makandura Experimental Estate (Intermediate Zone)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
  },
  {
    id: "diag-004",
    disease_class: "healthy leaves",
    confidence: 0.96,
    location: { lat: 7.3275, lng: 79.9898 },
    captured_at: "2026-08-26T14:45:00Z",
    estate_name: "Makandura Experimental Estate (Intermediate Zone)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
  },
  {
    id: "diag-005",
    disease_class: "leaf rot",
    confidence: 0.82,
    location: { lat: 7.3305, lng: 79.9865 },
    captured_at: "2026-08-25T16:10:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
  },
  {
    id: "diag-006",
    disease_class: "bud root dropping",
    confidence: 0.89,
    location: { lat: 7.3280, lng: 79.9915 },
    captured_at: "2026-08-24T10:05:00Z",
    estate_name: "Makandura Experimental Estate (Intermediate Zone)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
  },
  {
    id: "diag-007",
    disease_class: "stembleeding",
    confidence: 0.93,
    location: { lat: 7.3310, lng: 79.9880 },
    captured_at: "2026-08-23T14:15:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
  },
];

const DEMO_SEEDED_AERIAL_SURVEYS: UserAerialSurveyRecord[] = [
  {
    id: "survey-2026-08-25",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    date: "2026-08-25T08:30:00Z",
    index_type: "VARI",
    mean_index: 0.401,
    healthy_canopy_pct: 68.1,
    detected_palms: 24,
    anomalies_count: 8,
    status: "Completed",
    user_id: "usr_cri_001",
  },
  {
    id: "survey-2026-08-18",
    estate_name: "Puttalam Seed Garden (Dry Zone)",
    date: "2026-08-18T10:15:00Z",
    index_type: "NDVI",
    mean_index: 0.692,
    healthy_canopy_pct: 84.5,
    detected_palms: 412,
    anomalies_count: 14,
    status: "Completed",
    user_id: "usr_cri_001",
  },
  {
    id: "survey-2026-08-04",
    estate_name: "Makandura Experimental Estate (Intermediate Zone)",
    date: "2026-08-04T07:45:00Z",
    index_type: "VARI",
    mean_index: 0.385,
    healthy_canopy_pct: 71.0,
    detected_palms: 185,
    anomalies_count: 6,
    status: "Completed",
    user_id: "usr_cri_001",
  },
];

/**
 * Retrieve user-specific leaf diagnostics from local storage.
 */
export function getUserDiagnostics(userId?: string | number, userEmail?: string): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }

    // If Demo agronomist or planter account, seed with initial demo diagnostics
    const cleanEmail = (userEmail || "").trim().toLowerCase();
    if (cleanEmail === "agronomist@cri.lk" || effectiveId === "usr_cri_001") {
      const seeded = DEMO_SEEDED_DIAGNOSTICS.filter((d) => d.user_email === "agronomist@cri.lk");
      localStorage.setItem(storageKey, JSON.stringify(seeded));
      return seeded;
    }

    if (cleanEmail === "planter@sarupol.lk" || effectiveId === "usr_plt_042") {
      const seeded = DEMO_SEEDED_DIAGNOSTICS.filter((d) => d.user_email === "planter@sarupol.lk");
      localStorage.setItem(storageKey, JSON.stringify(seeded));
      return seeded;
    }

    // For any other newly registered user: start with clean empty diagnostic array
    return [];
  } catch (e) {
    console.warn("Failed to load user diagnostics:", e);
    return [];
  }
}

/**
 * Save a new diagnostic scan for the active user.
 */
export function saveUserDiagnostic(record: UserDiagnosticRecord): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(record.user_id || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    const current = getUserDiagnostics(record.user_id, record.user_email);
    const updated = [record, ...current];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save user diagnostic:", e);
    return [];
  }
}

/**
 * Retrieve user-specific aerial UAV surveys.
 */
export function getUserAerialSurveys(userId?: string | number, userEmail?: string): UserAerialSurveyRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_aerial_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }

    const cleanEmail = (userEmail || "").trim().toLowerCase();
    if (cleanEmail === "agronomist@cri.lk" || effectiveId === "usr_cri_001") {
      localStorage.setItem(storageKey, JSON.stringify(DEMO_SEEDED_AERIAL_SURVEYS));
      return DEMO_SEEDED_AERIAL_SURVEYS;
    }

    return [];
  } catch (e) {
    console.warn("Failed to load user aerial surveys:", e);
    return [];
  }
}

/**
 * Save an aerial UAV survey record for the user.
 */
export function saveUserAerialSurvey(record: UserAerialSurveyRecord): UserAerialSurveyRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(record.user_id || "guest");
  const storageKey = `sarupol_user_aerial_${effectiveId}`;

  try {
    const current = getUserAerialSurveys(record.user_id, record.user_email);
    const updated = [record, ...current];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save user aerial survey:", e);
    return [];
  }
}

/**
 * Delete an individual leaf diagnostic record.
 */
export function deleteUserDiagnostic(id: string, userId?: string | number, userEmail?: string): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    const current = getUserDiagnostics(userId, userEmail);
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to delete user diagnostic:", e);
    return [];
  }
}

/**
 * Clear all diagnostic records for the user.
 */
export function clearAllUserDiagnostics(userId?: string | number): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    localStorage.setItem(storageKey, JSON.stringify([]));
    return [];
  } catch (e) {
    console.warn("Failed to clear user diagnostics:", e);
    return [];
  }
}

/**
 * Delete an individual aerial UAV survey record.
 */
export function deleteUserAerialSurvey(id: string, userId?: string | number, userEmail?: string): UserAerialSurveyRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_aerial_${effectiveId}`;

  try {
    const current = getUserAerialSurveys(userId, userEmail);
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to delete user aerial survey:", e);
    return [];
  }
}

/**
 * Clear all aerial UAV survey records for the user.
 */
export function clearAllUserAerialSurveys(userId?: string | number): UserAerialSurveyRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_aerial_${effectiveId}`;

  try {
    localStorage.setItem(storageKey, JSON.stringify([]));
    return [];
  } catch (e) {
    console.warn("Failed to clear user aerial surveys:", e);
    return [];
  }
}

