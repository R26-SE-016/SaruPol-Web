let model: any = null;

export const CLASS_NAMES = [
  'bud root dropping',
  'bud rot',
  'gray leaf spot',
  'healthy leaves',
  'leaf rot',
  'stembleeding',
];

async function ensureScriptsLoaded(): Promise<void> {
  if (typeof window === "undefined") return;
  
  if ((window as any).tf && (window as any).tflite) return;

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        if ((window as any).tf || (window as any).tflite) return resolve();
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  if (!(window as any).tf) {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js");
  }
  if (!(window as any).tflite) {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9/dist/tf-tflite.min.js");
  }
}

export async function loadEdgeModel() {
  if (!model) {
    await ensureScriptsLoaded();
    if (typeof window === "undefined" || !(window as any).tflite) {
      throw new Error("TFLite library could not be loaded.");
    }
    console.log('[EdgeAI] Loading INT8 Quantized MobileNetV2...');
    (window as any).tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9/dist/');
    model = await (window as any).tflite.loadTFLiteModel('/models/system_b_baseline_int8.tflite');
    console.log('[EdgeAI] Model loaded successfully.');
  }
  return model;
}

export interface InferenceResult {
  disease_class: string;
  confidence: number;
  inference_time_ms: number;
  rejected_by_ood: boolean;
  shannon_entropy: number;
  all_predictions: { class: string; confidence: number }[];
}

export async function runEdgeInference(imageElement: HTMLImageElement): Promise<InferenceResult> {
  const edgeModel = await loadEdgeModel();
  
  const start = performance.now();

  // 1. Preprocessing: resize to 224x224 and convert to tensor
  let tensor = (window as any).tf.browser.fromPixels(imageElement);
  tensor = (window as any).tf.image.resizeNearestNeighbor(tensor, [224, 224]);
  tensor = (window as any).tf.expandDims(tensor, 0);
  
  // Cast to uint8 since it's an INT8 quantized model
  tensor = (window as any).tf.cast(tensor, 'int32'); // tfjs-tflite requires int32 to represent uint8 sometimes, let's use what TFJS standardizes

  // 2. Execute TFLite Inference
  const outputTensor = edgeModel.predict(tensor);
  const probsArray = await outputTensor.data(); // these are quantized logits (0-255 uint8)
  
  // Free tensor memory
  tensor.dispose();
  outputTensor.dispose();

  // 3. Post-process (De-quantize)
  // The output tensor has quantization scale 0.00390625 (1/256), meaning these are Softmax probabilities!
  const p_k = Array.from(probsArray).map((val) => (val as number) / 255.0);

  // 4. OOD Gating: Standard Shannon Entropy (H_th = 2.10)
  let entropy = 0;
  for (let i = 0; i < p_k.length; i++) {
    if (p_k[i] > 0) {
      entropy -= p_k[i] * Math.log2(p_k[i]);
    }
  }

  // Find max confidence
  let maxIdx = 0;
  let maxConf = 0;
  for (let i = 0; i < p_k.length; i++) {
    if (p_k[i] > maxConf) {
      maxConf = p_k[i];
      maxIdx = i;
    }
  }

  const inference_time_ms = performance.now() - start;

  // The paper: Reject if Entropy > 2.10 bits OR max confidence < 0.40
  const rejected = entropy > 2.10 || maxConf < 0.40;

  const all_predictions = CLASS_NAMES.map((cls, idx) => ({
    class: cls,
    confidence: p_k[idx]
  })).sort((a, b) => b.confidence - a.confidence);

  return {
    disease_class: CLASS_NAMES[maxIdx],
    confidence: maxConf,
    inference_time_ms,
    rejected_by_ood: rejected,
    shannon_entropy: entropy,
    all_predictions
  };
}
