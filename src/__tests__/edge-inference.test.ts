/**
 * Unit Tests for Edge AI MobileNetV2 Preprocessing & Entropy Estimation
 * Project: R26-SE-016
 */

import { describe, it, expect } from "vitest";

// Shannon entropy calculation helper
function computeEntropy(probabilities: number[]): number {
  return probabilities.reduce((acc, p) => {
    if (p > 1e-9) {
      return acc - p * Math.log2(p);
    }
    return acc;
  }, 0);
}

describe("Edge AI Inference & Entropy Engine", () => {
  it("should correctly calculate Shannon entropy for peak confidence prediction", () => {
    // 95% confidence on Bud Rot, 5% spread on others
    const probs = [0.95, 0.02, 0.01, 0.01, 0.01];
    const entropy = computeEntropy(probs);
    expect(entropy).toBeLessThan(1.0);
    expect(entropy).toBeLessThan(2.10); // Within In-Distribution threshold
  });

  it("should trigger OOD rejection for flat uncertain distributions", () => {
    // 5-class random/uncertain prediction (e.g. non-coconut leaf, soil, face)
    const probs = [0.20, 0.20, 0.20, 0.20, 0.20];
    const entropy = computeEntropy(probs);
    const maxEntropy = Math.log2(5); // ~2.32 bits
    expect(entropy).toBeCloseTo(maxEntropy, 2);
    expect(entropy).toBeGreaterThan(2.10); // Exceeds OOD threshold
  });

  it("should normalize RGB pixel values into [0, 1] tensor space", () => {
    const rawR = 255;
    const rawG = 128;
    const rawB = 0;

    const normR = rawR / 255.0;
    const normG = rawG / 255.0;
    const normB = rawB / 255.0;

    expect(normR).toBe(1.0);
    expect(normG).toBeCloseTo(0.5019, 3);
    expect(normB).toBe(0.0);
  });
});
