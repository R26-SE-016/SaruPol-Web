import UTIF from 'utif';

export interface ProcessedDroneImage {
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  isTiff: boolean;
}

const PREVIEW_MAX_DIMENSION = 800;

/**
 * Generates an instant visual preview URL for the browser dropzone.
 * Handles .tiff/.tif GeoTIFFs using UTIF.js (since browsers lack native TIFF codecs)
 * and standard image formats (.jpg, .png, .webp).
 */
export async function processDroneImage(file: File): Promise<ProcessedDroneImage> {
  const isTiff = file.name.toLowerCase().endsWith('.tif') || 
                 file.name.toLowerCase().endsWith('.tiff') || 
                 file.type === 'image/tiff';

  if (isTiff) {
    return processTiffPreview(file);
  } else {
    return processStandardPreview(file);
  }
}

/**
 * Fast TIFF preview thumbnail generator
 */
async function processTiffPreview(file: File): Promise<ProcessedDroneImage> {
  const arrayBuffer = await file.arrayBuffer();
  const ifds = UTIF.decode(arrayBuffer);
  
  if (!ifds || ifds.length === 0) {
    throw new Error('Failed to decode TIFF image headers');
  }

  UTIF.decodeImage(arrayBuffer, ifds[0]);
  const ifd = ifds[0];
  const originalWidth = ifd.width;
  const originalHeight = ifd.height;

  let rgbaUint8: Uint8Array;
  const t258 = (ifd as any).t258;
  const is16Bit = Boolean(t258 && (t258[0] === 16 || t258 === 16));

  if (is16Bit && ifd.data) {
    const u16 = new Uint16Array(ifd.data.buffer, ifd.data.byteOffset, ifd.data.byteLength / 2);
    let minV = 65535;
    let maxV = 0;
    for (let i = 0; i < u16.length; i++) {
      const v = u16[i];
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
    const range = Math.max(1, maxV - minV);
    rgbaUint8 = new Uint8Array(originalWidth * originalHeight * 4);
    for (let i = 0; i < u16.length; i++) {
      const normalized = Math.round(((u16[i] - minV) / range) * 255);
      const p = i * 4;
      rgbaUint8[p] = normalized;
      rgbaUint8[p + 1] = normalized;
      rgbaUint8[p + 2] = normalized;
      rgbaUint8[p + 3] = 255;
    }
  } else {
    rgbaUint8 = UTIF.toRGBA8(ifd);
  }

  let scaledWidth = originalWidth;
  let scaledHeight = originalHeight;
  if (Math.max(originalWidth, originalHeight) > PREVIEW_MAX_DIMENSION) {
    const scale = PREVIEW_MAX_DIMENSION / Math.max(originalWidth, originalHeight);
    scaledWidth = Math.max(1, Math.round(originalWidth * scale));
    scaledHeight = Math.max(1, Math.round(originalHeight * scale));
  }

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = originalWidth;
  srcCanvas.height = originalHeight;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) throw new Error('Could not create 2D canvas context');

  const imgData = srcCtx.createImageData(originalWidth, originalHeight);
  imgData.data.set(rgbaUint8);
  srcCtx.putImageData(imgData, 0, 0);

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = scaledWidth;
  targetCanvas.height = scaledHeight;
  const targetCtx = targetCanvas.getContext('2d');
  if (!targetCtx) throw new Error('Could not create scaled canvas context');

  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = 'high';
  targetCtx.drawImage(srcCanvas, 0, 0, scaledWidth, scaledHeight);

  return {
    previewUrl: targetCanvas.toDataURL('image/jpeg', 0.88),
    originalWidth,
    originalHeight,
    isTiff: true,
  };
}

/**
 * Standard image preview generator (JPEG, PNG, WebP)
 */
async function processStandardPreview(file: File): Promise<ProcessedDroneImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          previewUrl: dataUrl,
          originalWidth: img.naturalWidth || img.width,
          originalHeight: img.naturalHeight || img.height,
          isTiff: false,
        });
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
