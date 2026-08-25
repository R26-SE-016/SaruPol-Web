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
  }
];

export const DISEASE_COLORS: Record<string, { label: string, color: string, bg: string }> = {
  "healthy leaves": { label: "Healthy", color: "#00FF9D", bg: "rgba(0, 255, 157, 0.15)" },
  "bud rot": { label: "Bud Rot", color: "#FF4C4C", bg: "rgba(255, 76, 76, 0.15)" },
  "gray leaf spot": { label: "Gray Leaf Spot", color: "#FF8C00", bg: "rgba(255, 140, 0, 0.15)" },
  "leaf rot": { label: "Leaf Rot", color: "#E6AF2E", bg: "rgba(230, 175, 46, 0.15)" },
  "bud root dropping": { label: "Root Dropping", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.15)" },
  "stembleeding": { label: "Stem Bleeding", color: "#F472B6", bg: "rgba(244, 114, 182, 0.15)" }
};
