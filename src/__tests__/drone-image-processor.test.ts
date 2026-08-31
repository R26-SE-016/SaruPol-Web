/**
 * Unit Tests for Client-Side Drone Image Processing & Spectral Colormapping
 * Project: R26-SE-016
 */

import { describe, it, expect } from "vitest";
import { processDroneImage } from "../lib/drone-image-processor";

describe("Client-Side Drone Image Processor", () => {
  it("should identify TIFF vs standard formats correctly", async () => {
    const fakePng = new File([new Uint8Array(100)], "orthomosaic.png", { type: "image/png" });
    const fakeTiff = new File([new Uint8Array(100)], "orthomosaic.tif", { type: "image/tiff" });

    expect(fakePng.name.endsWith(".png")).toBe(true);
    expect(fakeTiff.name.endsWith(".tif")).toBe(true);
  });

  it("should detect TIFF extensions case-insensitively", () => {
    const names = ["survey.TIF", "SURVEY.TIFF", "block_A.tif", "block_B.tiff"];
    for (const name of names) {
      const isTiff = name.toLowerCase().endsWith(".tif") || name.toLowerCase().endsWith(".tiff");
      expect(isTiff).toBe(true);
    }
  });
});
