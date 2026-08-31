"use client";

import { DISEASE_COLORS } from "@/lib/demo-data";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DiseaseBadge({ disease, size = "md" }: { disease: string, size?: "sm" | "md" }) {
  const { language } = useLanguage();
  const normalizedKey = disease?.toLowerCase() || "";
  const config = DISEASE_COLORS[normalizedKey] || { 
    label: disease, 
    label_si: disease, 
    label_ta: disease, 
    color: "#94a3b8", 
    bg: "rgba(148, 163, 184, 0.15)" 
  };
  
  const displayLabel = language === "si" ? config.label_si : language === "ta" ? config.label_ta : config.label;

  return (
    <span 
      className={`font-mono uppercase tracking-wider rounded flex items-center gap-2 w-fit ${size === "sm" ? "text-[9px] px-2 py-0.5" : "text-xs px-3 py-1"}`}
      style={{ background: config.bg, color: config.color, border: `1px solid ${config.color}30` }}
    >
      <div className="rounded-full" style={{ width: size === "sm" ? 4 : 6, height: size === "sm" ? 4 : 6, background: config.color }} />
      {displayLabel}
    </span>
  );
}
