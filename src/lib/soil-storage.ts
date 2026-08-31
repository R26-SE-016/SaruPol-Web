/**
 * User-Scoped Soil Intelligence Telemetry & CRI Agronomic Knowledge Storage
 * Provides persistent, isolated records for 3-point IoT soil tests, visual nutrient scans,
 * and certified laboratory DFR calculations.
 */

export interface NPKReading {
  N: number;
  P: number;
  K: number;
  pH: number;
  moisture?: number;
  temperature?: number;
  EC?: number;
}

export interface SoilTestRecord {
  id: string;
  tree_no: number | string;
  zone_id: string;
  estate_name: string;
  sampling_method: string;
  point_a: NPKReading;
  point_b: NPKReading;
  point_c: NPKReading;
  average_soil_npk: { N: number; P: number; K: number; pH: number };
  predicted_14th_leaf_npk: { N: number; P: number; K: number };
  health_status: string;
  fertilizer_recommendation: {
    Urea: number;
    Eppawala_Rock_Phosphate_ERP: number;
    Muriate_of_Potash_MOP: number;
    Dolomite: number;
  };
  nutrient_evaluation: {
    Nitrogen_N: string;
    Phosphorus_P: string;
    Potassium_K: string;
    Soil_pH: string;
  };
  agronomic_advice: string[];
  model_used: string;
  location: { lat: number; lng: number };
  captured_at: string;
  user_id: string;
  user_email?: string;
}

export interface NutrientScanRecord {
  id: string;
  user_id: string;
  user_email?: string;
  estate_name: string;
  palm_age: string;
  palm_stage: string;
  zone: string;
  image_preview?: string;
  nutrient: string;
  class_name: string;
  confidence: number;
  advice: string;
  assessment_type: string;
  visual_features?: {
    chlorosis_index: number;
    yellowing_extent: number;
    necrosis_score: number;
  };
  location: { lat: number; lng: number };
  captured_at: string;
}

export interface LabCalculationRecord {
  id: string;
  user_id: string;
  user_email?: string;
  estate_name: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  magnesium?: number;
  palm_age: number;
  zone: string;
  urea: number;
  erp_or_tsp: number;
  mop: number;
  dolomite: number;
  phosphate_type: string;
  evalN: string;
  evalP: string;
  evalK: string;
  evalMg: string;
  health_status: string;
  agronomic_advice: string[];
  captured_at: string;
}

export interface SoilDeficiencyGuideItem {
  id: string;
  name: string;
  chemicalSymbol: string;
  criticalRange: string;
  themeColor: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  correctiveMeasures: string[];
  vernacularAdvice: string;
}

// ─── CRI Official Nutrient Deficiency Knowledge Base ───
export const SOIL_DEFICIENCIES_GUIDE: SoilDeficiencyGuideItem[] = [
  {
    id: "nitrogen",
    name: "Nitrogen Deficiency (N)",
    chemicalSymbol: "N",
    criticalRange: "1.80% - 2.00% in 14th Frond",
    themeColor: "#00E5FF",
    overview: "Nitrogen is the fundamental driver of vegetative canopy vigor, chlorophyll synthesis, and frond elongation in coconut palms. When deficient, the palm cannot photosynthesize efficiently, leading to reduced vigor and stunted crown growth.",
    symptoms: [
      "General uniform chlorosis (pale green to golden yellow) of older lower fronds first.",
      "Frond production rate slows down; newly emerged fronds are visibly shorter.",
      "Crown becomes sparse, thin, and takes on a compressed 'feather duster' shape.",
      "Nut retention drops drastically; remaining nuts have thin husks and low copra weight.",
    ],
    causes: [
      "Acidic soil conditions (pH < 5.0) which restrict nitrogen mineralization.",
      "Severe leaching in sandy or gravelly soils during heavy monsoon rains.",
      "Low soil organic matter and insufficient organic recycling in the manure circle.",
    ],
    correctiveMeasures: [
      "Apply recommended differential dosage of Urea (46% N) split into 2 seasonal applications (Yala/Maha).",
      "Incorporate 25-50kg of well-cured compost or cattle manure into the 1.8m circular trench.",
      "Establish nitrogen-fixing legume cover crops (e.g. Mucuna bracteata or Pueraria phaseoloides) in inter-row spaces.",
      "Mulch the 1.8m base with 2-3 layers of coconut husks (convex side up) to suppress weeds and retain soil moisture.",
    ],
    vernacularAdvice: "Urea should always be applied when the soil is moist. Avoid applying immediately before heavy torrential rains to prevent leaching.",
  },
  {
    id: "potassium",
    name: "Potassium Deficiency (K)",
    chemicalSymbol: "K",
    criticalRange: "1.20% - 1.50% in 14th Frond",
    themeColor: "#E6AF2E",
    overview: "Potassium is the most heavily extracted nutrient by mature coconut palms. It governs stomatal regulation, drought tolerance, enzyme activation, carbohydrate translocation, and directly dictates nut volume and copra thickness.",
    symptoms: [
      "Translucent orange-yellow chlorotic spots develop on older fronds.",
      "Leaflet margins and tips exhibit severe marginal necrosis (scorched/burnt appearance) advancing inwards.",
      "Frond petioles weaken and break prematurely, causing fronds to hang down along the trunk (aproning).",
      "Nut size diminishes rapidly; nuts become elongated, lightweight, with poorly developed kernel meat.",
    ],
    causes: [
      "Coarse sandy soils (Regosols) and highly leached gravelly soils with low Cation Exchange Capacity (CEC).",
      "Continuous commercial harvesting without returning coconut husks or MOP fertilizer.",
      "Imbalanced high magnesium or calcium fertilization which antagonizes potassium absorption.",
    ],
    correctiveMeasures: [
      "Apply Muriate of Potash (MOP - 60% K2O) according to CRI DFR guidelines (up to 2.5kg/palm/year for acute deficiency).",
      "Practice circular or trench husk burial (200-300 husks/palm) in between palm rows. Husks are rich in natural potassium.",
      "Apply coconut frond ash or recycled biomass mulch around the root zone.",
    ],
    vernacularAdvice: "Potassium is critical for nut yield. Never skip MOP application during drought recovery periods.",
  },
  {
    id: "magnesium",
    name: "Magnesium Deficiency (Mg)",
    chemicalSymbol: "Mg",
    criticalRange: "0.20% - 0.35% in 14th Frond",
    themeColor: "#A78BFA",
    overview: "Magnesium is the central atom in the chlorophyll molecule and an essential activator for energy transfer enzymes. Magnesium deficiency is widespread across the Wet and Intermediate zones of Sri Lanka on acidic sandy soils.",
    symptoms: [
      "Distinctive 'V-shaped' golden yellowing on older fronds, where leaflet tips and margins turn bright yellow while the midrib area remains green.",
      "Leaflets exposed to direct sunlight show intense yellowing; shaded fronds remain greener.",
      "Severe necrosis and premature leaflet senescence from the tip backwards.",
      "Center spear fronds remain green while lower crown fronds form a brilliant golden yellow skirt.",
    ],
    causes: [
      "Strongly acidic soils (pH < 5.2) where magnesium is leached into subsoil horizons.",
      "Excessive high-dose potassium (MOP) fertilization without corresponding magnesium balancing.",
      "Coarse sandy soils with minimal clay content.",
    ],
    correctiveMeasures: [
      "Broadcast 1.0 - 2.0kg of Agricultural Dolomite (CaCO3.MgCO3, min 18% MgO) over the 1.8m circular basin.",
      "Apply 500g of Kieserite (MgSO4) for rapid soluble magnesium uptake in severe cases.",
      "Maintain soil pH between 5.8 and 6.5 to maximize magnesium availability.",
    ],
    vernacularAdvice: "Apply Dolomite at least 4-6 weeks separately from Urea to prevent nitrogen loss through gaseous ammonia volatilization.",
  },
  {
    id: "phosphorus",
    name: "Phosphorus Deficiency (P)",
    chemicalSymbol: "P",
    criticalRange: "0.12% - 0.15% in 14th Frond",
    themeColor: "#FF4C4C",
    overview: "Phosphorus is vital for root development, flowering, energy transfer (ATP), and bunch initiation in young and bearing palms.",
    symptoms: [
      "Overall stunted root growth and reduced root volume in the top 0-50cm root zone.",
      "Older fronds take on a dull, dark bluish-green or purplish luster.",
      "Female flower (button) production decreases, leading to fewer nuts per inflorescence bunch.",
      "Trunk diameter tapers prematurely (pencil point trunk) over successive seasons.",
    ],
    causes: [
      "High phosphorus fixation in iron- and aluminum-rich Lateritic soils (Ultisols).",
      "Low soil biological activity and poor mycorrhizal association.",
    ],
    correctiveMeasures: [
      "Apply Eppawala Rock Phosphate (ERP - 28% P2O5) in acidic soils (pH < 6.0) at 600 - 1000g/palm/year.",
      "Use Triple Superphosphate (TSP - 46% P2O5) in alkaline coastal sands (pH > 7.0).",
      "Incorporate bio-fertilizers or mycorrhizal inoculants to enhance phosphorus solubilization.",
    ],
    vernacularAdvice: "Rock Phosphate is slow-release and requires an acidic root environment to dissolve effectively.",
  },
  {
    id: "boron",
    name: "Boron Micronutrient Deficiency (B)",
    chemicalSymbol: "B",
    criticalRange: "10 - 25 ppm in 14th Frond",
    themeColor: "#F472B6",
    overview: "Boron is an indispensable micronutrient responsible for cell wall synthesis, pollen tube germination, and bunch fruit set.",
    symptoms: [
      "Young emergent fronds show crumpled, deformed, or zigzag leaflet shapes (accordion leaf).",
      "Hooked frond tips ('little leaf' symptom) and fused leaflets.",
      "Extensive premature button nut shedding shortly after inflorescence opening.",
      "Nuts develop internal gum pockets, longitudinal cracks, and deformed shell shapes.",
    ],
    causes: [
      "Alkaline coastal soils (pH > 7.5) or over-limed soils with low boron solubility.",
      "Prolonged dry weather followed by abrupt heavy rainfall flushes.",
    ],
    correctiveMeasures: [
      "Apply 50 - 100g of Commercial Borax (11% B) or Solubor per palm in the manure circle.",
      "For acute inflorescence abortion, apply a 0.2% Solubor foliar spray during spadix emergence.",
    ],
    vernacularAdvice: "Boron is a micronutrient with a narrow safety margin. Never exceed 100g per palm per year to prevent boron phytotoxicity.",
  },
  {
    id: "zinc",
    name: "Zinc & Iron Deficiency (Zn / Fe)",
    chemicalSymbol: "Zn",
    criticalRange: "15 - 30 ppm in 14th Frond",
    themeColor: "#34D399",
    overview: "Zinc functions as a catalytic component in auxin (growth hormone) synthesis and carbohydrate metabolism.",
    symptoms: [
      "Interveinal chlorosis on younger emerging fronds.",
      "Reduction in leaflet length and narrow frond symmetry (rosetting).",
      "Inflorescence necrosis and poor pollen viability.",
    ],
    causes: [
      "High soil pH (> 7.2) and calcareous coral sands.",
      "Waterlogged soils with restricted aerobic root respiration.",
    ],
    correctiveMeasures: [
      "Apply 100 - 150g of Zinc Sulfate (ZnSO4) around the manure circle.",
      "Improve soil drainage and aerate compacted soils around the trunk.",
    ],
    vernacularAdvice: "Zinc deficiency is common in poorly drained coastal soils. Ensure adequate soil aeration before fertilizing.",
  },
];

// ─── CRI Benchmark Presets for Fast Field Simulation ───
export const SOIL_PRESETS = [
  {
    name: "Makandura Experimental Estate (CRI Block 4)",
    zone: "Intermediate Zone (IL1a)",
    soilType: "Red Yellow Podzolic (Sandy Loam)",
    treeNo: 42,
    pointA: { N: 0.0142, P: 0.3210, K: 0.0520, pH: 5.8, moisture: 42, temperature: 27.5, EC: 1.1 },
    pointB: { N: 0.0150, P: 0.3180, K: 0.0540, pH: 5.9, moisture: 44, temperature: 27.8, EC: 1.2 },
    pointC: { N: 0.0138, P: 0.3250, K: 0.0510, pH: 5.7, moisture: 40, temperature: 28.0, EC: 1.1 },
    expectedStatus: "Mild Potassium & Nitrogen Deficiency",
  },
  {
    name: "Puttalam Coastal Coconut Seed Garden",
    zone: "Dry Zone (DL1b)",
    soilType: "Regosol (Coarse Coastal Sand)",
    treeNo: 88,
    pointA: { N: 0.0098, P: 0.2840, K: 0.0380, pH: 6.8, moisture: 28, temperature: 31.2, EC: 0.8 },
    pointB: { N: 0.0105, P: 0.2910, K: 0.0390, pH: 6.9, moisture: 29, temperature: 31.0, EC: 0.9 },
    pointC: { N: 0.0092, P: 0.2800, K: 0.0370, pH: 6.7, moisture: 27, temperature: 31.5, EC: 0.8 },
    expectedStatus: "Severe Potassium & Nitrogen Deficit",
  },
  {
    name: "Lunuwila CRI Headquarters (Wet Zone)",
    zone: "Wet Zone (WL3)",
    soilType: "Alluvial Sandy Clay Loam",
    treeNo: 15,
    pointA: { N: 0.0185, P: 0.3620, K: 0.0710, pH: 6.4, moisture: 55, temperature: 26.5, EC: 1.4 },
    pointB: { N: 0.0190, P: 0.3580, K: 0.0690, pH: 6.3, moisture: 56, temperature: 26.8, EC: 1.3 },
    pointC: { N: 0.0180, P: 0.3650, K: 0.0730, pH: 6.5, moisture: 54, temperature: 26.2, EC: 1.5 },
    expectedStatus: "Optimal Balanced CRI Nutrition",
  },
  {
    name: "Kurunegala Commercial Holding (Lowland)",
    zone: "Intermediate Zone (IL1)",
    soilType: "Lateritic Clay Loam",
    treeNo: 104,
    pointA: { N: 0.0160, P: 0.3400, K: 0.0630, pH: 5.2, moisture: 48, temperature: 28.0, EC: 1.3 },
    pointB: { N: 0.0155, P: 0.3450, K: 0.0610, pH: 5.1, moisture: 50, temperature: 28.2, EC: 1.2 },
    pointC: { N: 0.0165, P: 0.3380, K: 0.0640, pH: 5.3, moisture: 47, temperature: 27.9, EC: 1.4 },
    expectedStatus: "Soil Acidity Alert (Dolomite Required)",
  },
];

// Seeded research tests for demo accounts
const SEEDED_SOIL_TESTS: SoilTestRecord[] = [
  {
    id: "soil-test-001",
    tree_no: 42,
    zone_id: "Block 4 - North Sector",
    estate_name: "Makandura Experimental Estate (Intermediate Zone)",
    sampling_method: "3-Point Spatial Triangulated Sampling (120° Manure Circle)",
    point_a: { N: 0.0142, P: 0.3210, K: 0.0520, pH: 5.8, moisture: 42, temperature: 27.5, EC: 1.1 },
    point_b: { N: 0.0150, P: 0.3180, K: 0.0540, pH: 5.9, moisture: 44, temperature: 27.8, EC: 1.2 },
    point_c: { N: 0.0138, P: 0.3250, K: 0.0510, pH: 5.7, moisture: 40, temperature: 28.0, EC: 1.1 },
    average_soil_npk: { N: 0.0143, P: 0.3213, K: 0.0523, pH: 5.8 },
    predicted_14th_leaf_npk: { N: 1.84, P: 0.12, K: 1.18 },
    health_status: "Moderate Potassium & Nitrogen Deficit",
    fertilizer_recommendation: {
      Urea: 1000,
      Eppawala_Rock_Phosphate_ERP: 600,
      Muriate_of_Potash_MOP: 2000,
      Dolomite: 1000,
    },
    nutrient_evaluation: {
      Nitrogen_N: "Sub-Optimal (1.84% vs 1.90% Target)",
      Phosphorus_P: "Optimal (0.12%)",
      Potassium_K: "Deficient (1.18% vs 1.35% Target)",
      Soil_pH: "Slightly Acidic (5.8)",
    },
    agronomic_advice: [
      "Apply fertilizer in a circular trench 1.8m away from the palm base.",
      "Divide annual dosage into two equal applications: 50% Yala season and 50% Maha season.",
      "Incorporate coconut husk burial in inter-row spaces to boost potassium retention.",
    ],
    model_used: "Random Forest Multi-Output Regression (R26-SE-016 Engine)",
    location: { lat: 7.3275, lng: 79.9880 },
    captured_at: "2026-08-28T09:15:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
  },
  {
    id: "soil-test-002",
    tree_no: 88,
    zone_id: "Coastal Ridge Block",
    estate_name: "Puttalam Seed Garden (Dry Zone)",
    sampling_method: "3-Point Spatial Triangulated Sampling (120° Manure Circle)",
    point_a: { N: 0.0098, P: 0.2840, K: 0.0380, pH: 6.8, moisture: 28, temperature: 31.2, EC: 0.8 },
    point_b: { N: 0.0105, P: 0.2910, K: 0.0390, pH: 6.9, moisture: 29, temperature: 31.0, EC: 0.9 },
    point_c: { N: 0.0092, P: 0.2800, K: 0.0370, pH: 6.7, moisture: 27, temperature: 31.5, EC: 0.8 },
    average_soil_npk: { N: 0.0098, P: 0.2850, K: 0.0380, pH: 6.8 },
    predicted_14th_leaf_npk: { N: 1.62, P: 0.11, K: 0.92 },
    health_status: "Acute Nutrient Depletion (Action Required)",
    fertilizer_recommendation: {
      Urea: 1500,
      Eppawala_Rock_Phosphate_ERP: 1000,
      Muriate_of_Potash_MOP: 2500,
      Dolomite: 1000,
    },
    nutrient_evaluation: {
      Nitrogen_N: "Critical Deficit (1.62%)",
      Phosphorus_P: "Low (0.11%)",
      Potassium_K: "Critical Deficit (0.92%)",
      Soil_pH: "Near Neutral (6.8)",
    },
    agronomic_advice: [
      "Prioritize immediate high-dose MOP (2.5kg/palm) and Urea application to prevent frond breakage.",
      "Mulch heavily with organic manure to reduce moisture loss in sandy coastal soil.",
    ],
    model_used: "Random Forest Multi-Output Regression (R26-SE-016 Engine)",
    location: { lat: 8.0362, lng: 79.8283 },
    captured_at: "2026-08-25T14:30:00Z",
    user_id: "usr_cri_001",
    user_email: "agronomist@cri.lk",
  },
];

// ─── Storage Accessors & Handlers ───

export function getUserSoilTests(userId?: string | number, userEmail?: string): SoilTestRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_soil_tests_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);

    const cleanEmail = (userEmail || "").trim().toLowerCase();
    if (cleanEmail === "agronomist@cri.lk" || effectiveId === "usr_cri_001") {
      localStorage.setItem(storageKey, JSON.stringify(SEEDED_SOIL_TESTS));
      return SEEDED_SOIL_TESTS;
    }
    return [];
  } catch (e) {
    console.warn("Failed to load user soil tests:", e);
    return [];
  }
}

export function saveUserSoilTest(record: SoilTestRecord): SoilTestRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(record.user_id || "guest");
  const storageKey = `sarupol_user_soil_tests_${effectiveId}`;

  try {
    const current = getUserSoilTests(record.user_id, record.user_email);
    const updated = [record, ...current];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save user soil test:", e);
    return [];
  }
}

export function deleteUserSoilTest(id: string, userId?: string | number, userEmail?: string): SoilTestRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_soil_tests_${effectiveId}`;

  try {
    const current = getUserSoilTests(userId, userEmail);
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to delete user soil test:", e);
    return [];
  }
}

export function clearAllUserSoilTests(userId?: string | number): SoilTestRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_soil_tests_${effectiveId}`;

  try {
    localStorage.setItem(storageKey, JSON.stringify([]));
    return [];
  } catch (e) {
    console.warn("Failed to clear user soil tests:", e);
    return [];
  }
}

export function getUserNutrientScans(userId?: string | number, userEmail?: string): NutrientScanRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_nutrient_scans_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    return [];
  }
}

export function saveUserNutrientScan(record: NutrientScanRecord): NutrientScanRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(record.user_id || "guest");
  const storageKey = `sarupol_user_nutrient_scans_${effectiveId}`;

  try {
    const current = getUserNutrientScans(record.user_id, record.user_email);
    const updated = [record, ...current];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteUserNutrientScan(id: string, userId?: string | number, userEmail?: string): NutrientScanRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_nutrient_scans_${effectiveId}`;

  try {
    const current = getUserNutrientScans(userId, userEmail);
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getUserLabCalculations(userId?: string | number, userEmail?: string): LabCalculationRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_lab_calc_${effectiveId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    return [];
  }
}

export function saveUserLabCalculation(record: LabCalculationRecord): LabCalculationRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(record.user_id || "guest");
  const storageKey = `sarupol_user_lab_calc_${effectiveId}`;

  try {
    const current = getUserLabCalculations(record.user_id, record.user_email);
    const updated = [record, ...current];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteUserLabCalculation(id: string, userId?: string | number, userEmail?: string): LabCalculationRecord[] {
  if (typeof window === "undefined") return [];
  const effectiveId = String(userId || "guest");
  const storageKey = `sarupol_user_lab_calc_${effectiveId}`;

  try {
    const current = getUserLabCalculations(userId, userEmail);
    const updated = current.filter(l => l.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}
