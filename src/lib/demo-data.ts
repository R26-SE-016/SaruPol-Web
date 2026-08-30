
export const DEMO_DIAGNOSTICS = [
  {
    id: "diag-001",
    disease_class: "bud rot",
    confidence: 0.94,
    location: { lat: 7.2914, lng: 80.6342 },
    captured_at: "2026-08-25T10:30:00Z"
  },
  {
    id: "diag-002",
    disease_class: "gray leaf spot",
    confidence: 0.88,
    location: { lat: 7.2928, lng: 80.6325 },
    captured_at: "2026-08-25T11:15:00Z"
  },
  {
    id: "diag-003",
    disease_class: "healthy leaves",
    confidence: 0.98,
    location: { lat: 7.2895, lng: 80.6358 },
    captured_at: "2026-08-24T09:20:00Z"
  },
  {
    id: "diag-004",
    disease_class: "healthy leaves",
    confidence: 0.96,
    location: { lat: 7.2905, lng: 80.6348 },
    captured_at: "2026-08-24T14:45:00Z"
  },
  {
    id: "diag-005",
    disease_class: "leaf rot",
    confidence: 0.82,
    location: { lat: 7.2935, lng: 80.6315 },
    captured_at: "2026-08-23T16:10:00Z"
  },
  {
    id: "diag-006",
    disease_class: "bud root dropping",
    confidence: 0.89,
    location: { lat: 7.2910, lng: 80.6365 },
    captured_at: "2026-08-23T10:05:00Z"
  },
  {
    id: "diag-007",
    disease_class: "stembleeding",
    confidence: 0.93,
    location: { lat: 7.2940, lng: 80.6330 },
    captured_at: "2026-08-22T14:15:00Z"
  }
];

export const DISEASE_COLORS: Record<string, { label: string, color: string, bg: string, description: string }> = {
  "healthy leaves": { 
    label: "Healthy", 
    color: "#00FF9D", 
    bg: "rgba(0, 255, 157, 0.15)",
    description: "Non-diseased healthy palm tissue with optimal chlorophyll density."
  },
  "bud rot": { 
    label: "Bud Rot", 
    color: "#FF4C4C", 
    bg: "rgba(255, 76, 76, 0.15)",
    description: "Fatal fungal disease (Phytophthora palmivora) attacking terminal bud."
  },
  "gray leaf spot": { 
    label: "Gray Leaf Spot", 
    color: "#FF8C00", 
    bg: "rgba(255, 140, 0, 0.15)",
    description: "Foliar disease (Pestalotiopsis palmarum) with greyish-white necrotic spots."
  },
  "leaf rot": { 
    label: "Leaf Rot", 
    color: "#E6AF2E", 
    bg: "rgba(230, 175, 46, 0.15)",
    description: "Fungal infection (Exserohilum rostratum) causing necrosis of younger fronds."
  },
  "bud root dropping": { 
    label: "Bud Root Dropping", 
    color: "#A78BFA", 
    bg: "rgba(167, 139, 250, 0.15)",
    description: "Critical advanced spindle collapse and drooping due to bud decay."
  },
  "stembleeding": { 
    label: "Stem Bleeding", 
    color: "#F472B6", 
    bg: "rgba(244, 114, 182, 0.15)",
    description: "Thielaviopsis paradoxa vascular infection oozing dark exudate from trunk."
  }
};

export interface KnowledgeItem {
  id: string;
  common_name: string;
  scientific_name: string;
  symptoms: string[];
  treatment_protocols: {
    chemical: string[];
    biological: string[];
    cultural: string[];
  };
  vernacular_advice: string;
  severity_level: 'critical' | 'high' | 'medium' | 'low';
  source: string;
}

export const DEMO_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "kb_001",
    common_name: "Bud Rot",
    scientific_name: "Phytophthora palmivora",
    symptoms: [
      "Rotting and yellowing of the central spindle leaf (cabbage)",
      "Foul-smelling brownish-black liquid oozing from crown",
      "Successive outer fronds drooping and dropping prematurely",
      "Spindle leaf can be pulled out easily with negligible resistance",
    ],
    treatment_protocols: {
      chemical: [
        "Cut and thoroughly excise rotted tissue until healthy tissue is exposed",
        "Apply 10% Bordeaux paste directly to cut surgical surfaces",
        "Crown drench with Mancozeb (0.3% / 3g per Liter) or Copper Oxychloride",
        "Repeat application at 14-day intervals during monsoon rain spells",
      ],
      biological: [
        "Apply Trichoderma viride enriched organic compost around root zone",
        "Incorporate Pseudomonas fluorescens foliar spray for antagonistic suppression",
      ],
      cultural: [
        "Isolate severely affected palms; burn excavated infected cabbage tissue immediately",
        "Improve field drainage to eliminate standing crown water and humidity traps",
      ]
    },
    vernacular_advice: "Bud Root Dropping indicates terminal stage necrosis. Prompt surgical excision of the infected crown is required within 48 hours to prevent complete tree loss.",
    severity_level: "critical",
    source: "Coconut Research Institute of Sri Lanka (CRI Bulletin No. 12)",
  },
  {
    id: "kb_002",
    common_name: "Gray Leaf Spot",
    scientific_name: "Pestalotiopsis palmarum",
    symptoms: [
      "Minute yellowish-brown spots enlarging to greyish-white oval lesions",
      "Dark brown necrotic margins surrounding grey centers on older fronds",
      "Coalescence of lesions leading to severe blighting and premature frond drying",
      "Noticeably reduced photosynthetic efficiency and nut-setting capacity",
    ],
    treatment_protocols: {
      chemical: [
        "Foliar spray with Carbendazim (0.1%) or Mancozeb (0.25%) at first symptom onset",
        "Spray Copper Hydroxide (2g/L) across lower and middle canopy tiers",
      ],
      biological: [
        "Apply Bacillus subtilis bio-fungicide to promote leaf microbiome resilience",
      ],
      cultural: [
        "Remediate Potassium (K₂O) and Magnesium (MgO) soil deficits via targeted fertilization",
        "Prune and incinerate severely dried, diseased lower fronds to reduce inoculum load",
      ]
    },
    vernacular_advice: "Frequently exacerbated by severe soil nutritional deficiencies, especially Potassium. Balanced NPK+Mg fertilizing is essential.",
    severity_level: "medium",
    source: "CRI Advisory Circular No. 42",
  },
  {
    id: "kb_003",
    common_name: "Leaf Rot",
    scientific_name: "Exserohilum rostratum / Colletotrichum gloeosporioides",
    symptoms: [
      "Water-soaked lesions on tips and margins of emerging tender leaflets",
      "Infected areas turn pitch black, shrivel, and break off in wind currents",
      "Distorted, ragged 'fan-shaped' appearance on maturing fronds",
      "Secondary opportunistic entry following Rhinoceros beetle wounding",
    ],
    treatment_protocols: {
      chemical: [
        "Pour 1% Bordeaux mixture or Hexaconazole (2ml/L) directly into spindle axis",
        "Apply Mancozeb (3g/L) + Wettable Sulfur (2g/L) during active vegetative flushes",
      ],
      biological: [
        "Release Metarhizium anisopliae green muscardine fungus for Rhinoceros beetle suppression",
      ],
      cultural: [
        "Clean crown frond axils of decaying organic debris where beetles breed",
        "Ensure spacing intervals > 26ft to facilitate air circulation",
      ]
    },
    vernacular_advice: "Young palms (< 8 years) are highly susceptible. Protecting the central spear leaf from mechanical injury is paramount.",
    severity_level: "high",
    source: "CRI Plant Pathology Division",
  },
  {
    id: "kb_004",
    common_name: "Stem Bleeding",
    scientific_name: "Thielaviopsis paradoxa (Ceratocystis paradoxa)",
    symptoms: [
      "Dark reddish-brown to black viscous fluid oozing from trunk fissures",
      "Fluid dries into a dark encrustation with internal hollow cavitation",
      "Gradual yellowing, tapering of trunk diameter, and drastic nut reduction",
      "Extensive vascular discoloration visible upon trunk dissection",
    ],
    treatment_protocols: {
      chemical: [
        "Chisel out all discolored vascular wood until clean white trunk tissue is exposed",
        "Dress the wound with hot coal tar or concentrated 10% Bordeaux paste",
        "Apply 1% Bordeaux drench or Tridemorph root-feeding (5ml in 100ml water)",
      ],
      biological: [
        "Apply Trichoderma harzianum paste onto treated trunk wounds",
      ],
      cultural: [
        "Prevent mechanical damage by weeding machinery or livestock to base trunk",
        "Provide adequate organic mulching and prevent coastal waterlogging",
      ]
    },
    vernacular_advice: "Early detection prevents structural hollows in trunk. Never prune living roots near trunk base during active bleeding.",
    severity_level: "high",
    source: "CRI Advisory Circular No. 19",
  }
];
