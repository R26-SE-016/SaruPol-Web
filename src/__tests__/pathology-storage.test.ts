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
  getEstateCoordinates
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

  it("should return correct estate coordinates", () => {
    const coords = getEstateCoordinates("Kurunegala Commercial Block (Intermediate Zone)");
    expect(coords.lat).toBeCloseTo(7.4863, 3);
    expect(coords.lng).toBeCloseTo(80.3623, 3);
  });
});
