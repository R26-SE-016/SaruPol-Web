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
  source?: "mobile_leaf";
}

export interface CanopyHotspotRecord {
  id: string;
  location: { lat: number; lng: number };
  pixel_coordinates?: { x: number; y: number };
  mean_index_value: number;
  severity: "critical" | "high" | "moderate";
  area_sq_pixels?: number;
  radius_meters?: number;
  recommended_action: string;
  z_score?: number;
  relative_drop_pct?: number;
  estate_name: string;
  survey_id?: string;
  captured_at: string;
  user_id: string;
  user_email?: string;
  source?: "aerial_uav";
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
  hotspots?: CanopyHotspotRecord[];
}

// Exact, calibrated Agro-Climatic GPS coordinates for Sri Lankan coconut estates & CRI Research Stations
export const ESTATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Key ID mappings
  "estate_001": { lat: 7.3275, lng: 79.9880 }, // Makandura Experimental Coconut Research Station (Intermediate Zone)
  "estate_002": { lat: 8.0362, lng: 79.8283 }, // Puttalam Coconut Seed Garden & Coastal Plantation (Dry Zone)
  "estate_003": { lat: 7.3414, lng: 79.8656 }, // Lunuwila CRI Bandirippuwa Estate Headquarters (Wet/Intermediate Zone)

  // Named estates (Rural plantation lands)
  "Green Valley Estate (Kurunegala)": { lat: 7.3275, lng: 79.9880 }, // Makandura Coconut Triangle belt
  "Puttalam Coastal Plantation": { lat: 8.0362, lng: 79.8283 },
  "Gampaha Research Grove": { lat: 7.1425, lng: 80.0125 },
  "Makandura Experimental Estate (Intermediate Zone)": { lat: 7.3275, lng: 79.9880 },
  "Lunuwila CRI Headquarters (Wet Zone)": { lat: 7.3414, lng: 79.8656 },
  "Puttalam Seed Garden (Dry Zone)": { lat: 8.0362, lng: 79.8283 },
  "Ratnapura High-Rainfall Estate (Wet Zone)": { lat: 6.6828, lng: 80.4034 },
  "Batticaloa Coastal Research Station (Dry Zone)": { lat: 7.7170, lng: 81.7000 },
  "Kurunegala Commercial Block (Intermediate Zone)": { lat: 7.3275, lng: 79.9880 },
  "Gampaha / Negombo Smallholding (Wet Zone)": { lat: 7.1425, lng: 80.0125 },
  "Chilaw Coconut Holding (Intermediate Zone)": { lat: 7.5758, lng: 79.7953 },
  "Kuliyapitiya Commercial Plantation (Intermediate Zone)": { lat: 7.4689, lng: 80.0401 },
  "Madampe Coconut Grove (Intermediate Zone)": { lat: 7.5021, lng: 79.8450 },
  "Puttalam Commercial Holding (Dry Zone)": { lat: 8.0362, lng: 79.8283 },
  "Kalutara Coastal Smallholding (Wet Zone)": { lat: 6.5854, lng: 79.9607 },
  "Other / Private Coconut Plantation": { lat: 7.3414, lng: 79.8656 },
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
    location: { lat: 7.3422, lng: 79.8662 },
    captured_at: "2026-08-28T10:30:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-002",
    disease_class: "gray leaf spot",
    confidence: 0.88,
    location: { lat: 7.3408, lng: 79.8649 },
    captured_at: "2026-08-27T11:15:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-003",
    disease_class: "healthy leaves",
    confidence: 0.98,
    location: { lat: 7.4875, lng: 80.3635 },
    captured_at: "2026-08-27T09:20:00Z",
    estate_name: "Green Valley Estate (Kurunegala)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-004",
    disease_class: "healthy leaves",
    confidence: 0.96,
    location: { lat: 7.4855, lng: 80.3615 },
    captured_at: "2026-08-26T14:45:00Z",
    estate_name: "Green Valley Estate (Kurunegala)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-005",
    disease_class: "leaf rot",
    confidence: 0.82,
    location: { lat: 7.3430, lng: 79.8670 },
    captured_at: "2026-08-25T16:10:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-006",
    disease_class: "bud root dropping",
    confidence: 0.89,
    location: { lat: 7.4880, lng: 80.3640 },
    captured_at: "2026-08-24T10:05:00Z",
    estate_name: "Green Valley Estate (Kurunegala)",
    user_id: "usr_plt_042",
    user_email: "planter@sarupol.lk",
    synced: true,
    source: "mobile_leaf",
  },
  {
    id: "diag-007",
    disease_class: "stembleeding",
    confidence: 0.93,
    location: { lat: 7.3418, lng: 79.8652 },
    captured_at: "2026-08-23T14:15:00Z",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    synced: true,
    source: "mobile_leaf",
  },
];

// Initial calibrated aerial stressed tree hotspots for demo accounts
const DEMO_SEEDED_HOTSPOTS: CanopyHotspotRecord[] = [
  {
    id: "hs-uav-001",
    estate_name: "Green Valley Estate (Kurunegala)",
    location: { lat: 7.3288, lng: 79.9892 },
    pixel_coordinates: { x: 340, y: 512 },
    mean_index_value: -0.045,
    severity: "critical",
    recommended_action: "Dispatch field officer for immediate Bud Rot trunk inspection and fungicide paste application.",
    z_score: -2.85,
    relative_drop_pct: 42.5,
    captured_at: "2026-08-28T09:00:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    source: "aerial_uav",
  },
  {
    id: "hs-uav-002",
    estate_name: "Green Valley Estate (Kurunegala)",
    location: { lat: 7.3262, lng: 79.9868 },
    pixel_coordinates: { x: 720, y: 280 },
    mean_index_value: 0.012,
    severity: "high",
    recommended_action: "Inspect for severe potassium deficiency chlorosis or early Leaf Rot lesions.",
    z_score: -2.10,
    relative_drop_pct: 28.0,
    captured_at: "2026-08-28T09:00:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    source: "aerial_uav",
  },
  {
    id: "hs-uav-003",
    estate_name: "Green Valley Estate (Kurunegala)",
    location: { lat: 7.3279, lng: 79.9885 },
    pixel_coordinates: { x: 510, y: 640 },
    mean_index_value: 0.038,
    severity: "moderate",
    recommended_action: "Monitor canopy vigor during next UAV surveillance cycle.",
    z_score: -1.65,
    relative_drop_pct: 16.2,
    captured_at: "2026-08-28T09:00:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    source: "aerial_uav",
  },
  {
    id: "hs-uav-004",
    estate_name: "Lunuwila CRI Headquarters (Wet Zone)",
    location: { lat: 7.3428, lng: 79.8668 },
    pixel_coordinates: { x: 420, y: 480 },
    mean_index_value: -0.062,
    severity: "critical",
    recommended_action: "Immediate phytosanitary quarantine check for Phytophthora crown collapse.",
    z_score: -3.10,
    relative_drop_pct: 54.0,
    captured_at: "2026-08-25T08:30:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
    source: "aerial_uav",
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
    hotspots: [DEMO_SEEDED_HOTSPOTS[3]],
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
    estate_name: "Green Valley Estate (Kurunegala)",
    date: "2026-08-04T07:45:00Z",
    index_type: "VARI",
    mean_index: 0.385,
    healthy_canopy_pct: 71.0,
    detected_palms: 185,
    anomalies_count: 6,
    status: "Completed",
    user_id: "usr_cri_001",
    hotspots: [DEMO_SEEDED_HOTSPOTS[0], DEMO_SEEDED_HOTSPOTS[1], DEMO_SEEDED_HOTSPOTS[2]],
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
    const updated = [record, ...current.filter((c) => c.id !== record.id)];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save user diagnostic:", e);
    return [];
  }
}

/**
 * Synchronize and merge cloud diagnostic records with local storage
 */
export function mergeCloudDiagnostics(
  userId: string | number,
  cloudRecords: UserDiagnosticRecord[],
  userEmail?: string
): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return cloudRecords;
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    const local = getUserDiagnostics(userId, userEmail);
    const map = new Map<string, UserDiagnosticRecord>();

    // Add local records first
    local.forEach((r) => {
      if (r && r.id) map.set(r.id, r);
    });

    // Merge cloud records
    cloudRecords.forEach((cr) => {
      if (!cr || !cr.id) return;
      if (!map.has(cr.id)) {
        map.set(cr.id, cr);
      } else {
        const existing = map.get(cr.id)!;
        map.set(cr.id, { ...existing, ...cr, synced: true });
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
    );

    localStorage.setItem(storageKey, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.warn("Failed to merge cloud diagnostics:", e);
    return cloudRecords;
  }
}

/**
 * Retrieve records that have not yet been synced to the cloud.
 */
export function getUnsyncedDiagnostics(
  userId?: string | number,
  userEmail?: string
): UserDiagnosticRecord[] {
  const all = getUserDiagnostics(userId, userEmail);
  return all.filter((r) => r.synced !== true);
}

/**
 * Mark specified local diagnostic records as synced in localStorage.
 */
export function markUserDiagnosticsSynced(
  userId: string | number | undefined,
  syncedIds: string[],
  userEmail?: string
): UserDiagnosticRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_diagnostics_${effectiveId}`;

  try {
    const current = getUserDiagnostics(userId, userEmail);
    const idSet = new Set(syncedIds);
    const updated = current.map((r) => (idSet.has(r.id) ? { ...r, synced: true } : r));
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to mark diagnostics as synced:", e);
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
    if (cleanEmail === "agronomist@cri.lk" || effectiveId === "usr_cri_001" || cleanEmail === "planter@sarupol.lk" || effectiveId === "usr_plt_042") {
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

    // Also persist any detected stressed tree hotspots
    if (record.hotspots && record.hotspots.length > 0) {
      saveUserHotspots(record.hotspots, record.user_id);
    }

    return updated;
  } catch (e) {
    console.warn("Failed to save user aerial survey:", e);
    return [];
  }
}

/**
 * Retrieve all individual stressed tree hotspots identified via System A aerial surveys.
 */
export function getUserHotspots(userId?: string | number, userEmail?: string): CanopyHotspotRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_hotspots_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }

    const cleanEmail = (userEmail || "").trim().toLowerCase();
    if (cleanEmail === "agronomist@cri.lk" || effectiveId === "usr_cri_001" || cleanEmail === "planter@sarupol.lk" || effectiveId === "usr_plt_042") {
      localStorage.setItem(storageKey, JSON.stringify(DEMO_SEEDED_HOTSPOTS));
      return DEMO_SEEDED_HOTSPOTS;
    }

    return [];
  } catch (e) {
    console.warn("Failed to load user hotspots:", e);
    return [];
  }
}

/**
 * Save individual stressed tree hotspots into user telemetry storage.
 */
export function saveUserHotspots(hotspots: CanopyHotspotRecord[], userId?: string | number): CanopyHotspotRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_hotspots_${effectiveId}`;

  try {
    const current = getUserHotspots(userId);
    const updated = [...hotspots, ...current.filter((c) => !hotspots.some((h) => h.id === c.id))];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save user hotspots:", e);
    return [];
  }
}

/**
 * Delete a single stressed tree hotspot.
 */
export function deleteUserHotspot(id: string, userId?: string | number): CanopyHotspotRecord[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return [];

  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_hotspots_${effectiveId}`;

  try {
    const current = getUserHotspots(userId);
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to delete user hotspot:", e);
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
    localStorage.removeItem(storageKey);
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
    localStorage.removeItem(storageKey);
    return [];
  } catch (e) {
    console.warn("Failed to clear user aerial surveys:", e);
    return [];
  }
}
