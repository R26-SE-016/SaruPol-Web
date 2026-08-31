# 🧪 Testing Guide: SaruPol Web Application & Edge Client

This document provides instructions on how to execute unit tests and end-to-end integration checks for the **SaruPol Web Application & Edge AI Client** (`SaruPol-Web`).

---

## 🚀 1. How to Run the Tests

### A. Run All Unit & Integration Tests (Vitest)
From the root of `SaruPol-Web/`:

```bash
npm test
```

Or run Vitest in watch/interactive UI mode:
```bash
npx vitest
```

---

### B. Run TypeScript Type Safety Verification
Verify that all components, API interfaces, and state definitions compile without type errors:

```bash
npx tsc --noEmit
```

---

### C. Run Full Production Build Validation
Ensure that all 14 application pages and routes build successfully:

```bash
npm run build
```

---

## 🔍 2. Test Suite Breakdown & What Each Test Does

### 📁 `src/__tests__/pathology-storage.test.ts`
Tests the offline-first telemetry storage, IndexedDB/localStorage bridge, and real-time deletion reactivity in `src/lib/pathology-storage.ts`:

| Test Case | Description & Purpose |
| :--- | :--- |
| **`should save and retrieve user leaf diagnostic record`** | Verifies that a mobile leaf diagnostic record is properly serialized, saved under the user's isolated storage key, and retrieved with accurate fields (`disease_class`, `confidence`, `location`). |
| **`should delete a single user diagnostic record cleanly`** | Tests individual record deletion by ID, ensuring remaining records are preserved and the list length decrements cleanly. |
| **`should clear all diagnostics for a user`** | Verifies the "Clear All Records" handler completely wipes user diagnostics and triggers empty-state rendering without affecting other users. |
| **`should save, retrieve, and delete aerial survey records`** | Tests full lifecycle of System A UAV flight records (`VARI`/`NDVI`, `mean_index`, `healthy_canopy_pct`, `detected_palms`, `anomalies_count`). |
| **`should return correct estate coordinates`** | Verifies `getEstateCoordinates()` returns accurate GPS lat/lng for Sri Lankan coconut zones (e.g. Kurunegala Intermediate Zone: $7.4863^\circ\text{N}, 80.3623^\circ\text{E}$). |

---

### 📁 `src/__tests__/edge-inference.test.ts`
Tests the on-device Edge AI MobileNetV2 pre-processing and Shannon Entropy Out-of-Distribution calculation in `src/lib/edge-inference.ts`:

| Test Case | Description & Purpose |
| :--- | :--- |
| **`should correctly calculate Shannon entropy for peak confidence prediction`** | Verifies that sharp model output distributions (e.g. 95% certainty) compute to low entropy ($H < 1.0\text{ bits}$), passing within the In-Distribution threshold ($H < 2.10\text{ bits}$). |
| **`should trigger OOD rejection for flat uncertain distributions`** | Verifies that ambiguous or foreign non-coconut leaf images producing flat 5-class distributions (20% each) yield maximum entropy ($H = 2.32\text{ bits} > 2.10\text{ bits}$), triggering OOD rejection. |
| **`should normalize RGB pixel values into [0, 1] tensor space`** | Tests the mathematical normalization of raw $[0, 255]$ image buffer bytes into $[0.0, 1.0]$ Float32 tensors required for neural network input layers. |

---

### 📁 `src/__tests__/drone-image-processor.test.ts`
Tests client-side UAV orthomosaic decoding and format detection in `src/lib/drone-image-processor.ts`:

| Test Case | Description & Purpose |
| :--- | :--- |
| **`should identify TIFF vs standard formats correctly`** | Verifies that the client accurately distinguishes standard browser images (`.png`, `.jpg`) from multi-band GeoTIFFs (`.tif`, `.tiff`). |
| **`should detect TIFF extensions case-insensitively`** | Asserts that uppercase and lowercase file extensions (`.TIF`, `.TIFF`, `.tif`, `.tiff`) are handled uniformly by the UTIF image decoder. |
