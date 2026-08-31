/**
 * Unit Tests for Pathology Telemetry Storage & CRUD Engine
 * Project: R26-SE-016
 */

import { describe, it, expect, beforeEach } from "vitest";

// Ensure global localStorage exists in Node test runtime
if (typeof localStorage === "undefined") {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
  };
}

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
  ESTATE_COORDINATES
} from "../lib/pathology-storage";

describe("Pathology Telemetry Storage & CRUD", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should save and retrieve user leaf diagnostic record", () => {
    const record = {
      id: "diag_test_001",
      user_id: "usr_custom_101",
      estate_name: "Makandura Experimental Estate (Intermediate Zone)",
      disease_class: "bud rot",
      confidence: 0.94,
      captured_at: new Date().toISOString(),
      location: { lat: 7.2906, lng: 80.6337 },
      synced: true
    };

    saveUserDiagnostic(record);
    const retrieved = getUserDiagnostics("usr_custom_101");
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe("diag_test_001");
    expect(retrieved[0].disease_class).toBe("bud rot");
  });

  it("should delete a single user diagnostic record cleanly", () => {
    const record1 = {
      id: "diag_001",
      user_id: "usr_custom_101",
      estate_name: "Makandura",
      disease_class: "bud rot",
      confidence: 0.92,
      captured_at: new Date().toISOString(),
      location: { lat: 7.29, lng: 80.63 },
      synced: true
    };
    const record2 = {
      id: "diag_002",
      user_id: "usr_custom_101",
      estate_name: "Makandura",
      disease_class: "gray leaf spot",
      confidence: 0.88,
      captured_at: new Date().toISOString(),
      location: { lat: 7.30, lng: 80.64 },
      synced: true
    };

    saveUserDiagnostic(record1);
    saveUserDiagnostic(record2);

    expect(getUserDiagnostics("usr_custom_101").length).toBe(2);

    const remaining = deleteUserDiagnostic("diag_001", "usr_custom_101");
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe("diag_002");
  });

  it("should clear all diagnostics for a user", () => {
    saveUserDiagnostic({ id: "d1", user_id: "usr_custom_101", estate_name: "", disease_class: "bud rot", confidence: 0.9, captured_at: "", location: { lat: 0, lng: 0 } });
    saveUserDiagnostic({ id: "d2", user_id: "usr_custom_101", estate_name: "", disease_class: "healthy leaves", confidence: 0.95, captured_at: "", location: { lat: 0, lng: 0 } });

    const remaining = clearAllUserDiagnostics("usr_custom_101");
    expect(remaining.length).toBe(0);
    expect(getUserDiagnostics("usr_custom_101").length).toBe(0);
  });

  it("should save, retrieve, and delete aerial survey records", () => {
    const survey = {
      id: "survey_001",
      user_id: "usr_custom_101",
      estate_name: "Green Valley Estate",
      date: new Date().toISOString(),
      index_type: "VARI" as const,
      mean_index: 0.185,
      healthy_canopy_pct: 88.5,
      detected_palms: 120,
      anomalies_count: 3,
      status: "COMPLETED"
    };

    saveUserAerialSurvey(survey);
    const retrieved = getUserAerialSurveys("usr_custom_101");
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].detected_palms).toBe(120);

    const afterDelete = deleteUserAerialSurvey("survey_001", "usr_custom_101");
    expect(afterDelete.length).toBe(0);
  });

  it("should save, retrieve, and delete System A stressed tree hotspots with calibrated GPS", () => {
    const hotspot = {
      id: "hs_uav_test_01",
      location: { lat: 7.4878, lng: 80.3638 },
      mean_index_value: -0.045,
      severity: "critical" as const,
      recommended_action: "Dispatch field officer for immediate fungicide paste application.",
      z_score: -2.85,
      relative_drop_pct: 42.5,
      estate_name: "Green Valley Estate (Kurunegala)",
      captured_at: new Date().toISOString(),
      user_id: "usr_custom_101",
      source: "aerial_uav" as const
    };

    saveUserHotspots([hotspot], "usr_custom_101");
    const retrieved = getUserHotspots("usr_custom_101");
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe("hs_uav_test_01");
    expect(retrieved[0].location.lat).toBeCloseTo(7.4878, 4);
    expect(retrieved[0].location.lng).toBeCloseTo(80.3638, 4);
    expect(retrieved[0].severity).toBe("critical");

    const afterDelete = deleteUserHotspot("hs_uav_test_01", "usr_custom_101");
    expect(afterDelete.length).toBe(0);
  });

  it("should return correct non-random estate coordinates for all Sri Lankan agro-climatic zones", () => {
    const kurunegala = getEstateCoordinates("estate_001");
    expect(kurunegala.lat).toBeCloseTo(7.4863, 4);
    expect(kurunegala.lng).toBeCloseTo(80.3623, 4);

    const puttalam = getEstateCoordinates("estate_002");
    expect(puttalam.lat).toBeCloseTo(8.0362, 4);
    expect(puttalam.lng).toBeCloseTo(79.8283, 4);

    const lunuwila = getEstateCoordinates("Lunuwila CRI Headquarters (Wet Zone)");
    expect(lunuwila.lat).toBeCloseTo(7.3414, 4);
    expect(lunuwila.lng).toBeCloseTo(79.8656, 4);

    const makandura = getEstateCoordinates("Makandura Experimental Estate (Intermediate Zone)");
    expect(makandura.lat).toBeCloseTo(7.3275, 4);
    expect(makandura.lng).toBeCloseTo(79.9880, 4);
  });
});
