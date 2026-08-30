import { DISEASE_COLORS } from "@/lib/demo-data";

export default function DiseaseBadge({ disease, size = "md" }: { disease: string, size?: "sm" | "md" }) {
  const config = DISEASE_COLORS[disease] || { label: disease, color: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)" };
  
  return (
    <span 
      className={`font-mono uppercase tracking-widest rounded flex items-center gap-2 w-fit ${size === "sm" ? "text-[9px] px-2 py-0.5" : "text-xs px-3 py-1"}`}
      style={{ background: config.bg, color: config.color, border: `1px solid ${config.color}30` }}
    >
      <div className="rounded-full" style={{ width: size === "sm" ? 4 : 6, height: size === "sm" ? 4 : 6, background: config.color }} />
      {config.label}
    </span>
  );
}
