"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface ReliabilityBadgeProps {
  combinedReliability?: number;
  reliabilityLevel?: string;
  retrievalConfidence?: number;
}

export default function ReliabilityBadge({
  combinedReliability,
  reliabilityLevel,
  retrievalConfidence,
}: ReliabilityBadgeProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (combinedReliability === undefined && retrievalConfidence === undefined) {
    return null;
  }

  const score =
    combinedReliability !== undefined
      ? Math.round(combinedReliability)
      : Math.round((retrievalConfidence || 0.85) * 100);

  const level =
    reliabilityLevel ||
    (score >= 80 ? "High" : score >= 60 ? "Moderate" : "Low");

  let badgeBg = "rgba(0, 255, 157, 0.12)";
  let badgeBorder = "rgba(0, 255, 157, 0.3)";
  let badgeColor = theme === "dark" ? "#00FF9D" : "#00875A";
  let Icon = ShieldCheck;
  let levelText = t.advisory.highReliability;

  if (level === "Low" || score < 60) {
    badgeBg = "rgba(255, 76, 76, 0.12)";
    badgeBorder = "rgba(255, 76, 76, 0.35)";
    badgeColor = "#FF4C4C";
    Icon = AlertCircle;
    levelText = t.advisory.lowReliability;
  } else if (level === "Moderate" || score < 80) {
    badgeBg = "rgba(230, 175, 46, 0.15)";
    badgeBorder = "rgba(230, 175, 46, 0.35)";
    badgeColor = theme === "dark" ? "#E6AF2E" : "#B45309";
    Icon = AlertTriangle;
    levelText = t.advisory.moderateReliability;
  }

  return (
    <div className="mt-3 space-y-2">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium smooth-transition"
        style={{
          background: badgeBg,
          borderColor: badgeBorder,
          color: badgeColor,
        }}
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-bold">{score}%</span>
        <span>•</span>
        <span>{levelText}</span>
      </div>

      {(level === "Low" || score < 60) && (
        <div
          className="p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5"
          style={{
            background: "rgba(255, 76, 76, 0.08)",
            borderColor: "rgba(255, 76, 76, 0.25)",
            color: theme === "dark" ? "#FFA8A8" : "#991B1B",
          }}
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {t.advisory.lowRelWarning}
          </p>
        </div>
      )}
    </div>
  );
}
