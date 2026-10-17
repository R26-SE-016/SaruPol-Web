"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Award, ChevronDown, ChevronUp, Zap, CheckCircle2, FileCode } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface MultiLlmConsensusCardProps {
  bestModel?: string;
  consensusScore?: number;
  judgeReason?: string;
  llamaAnswer?: string;
  gptAnswer?: string;
  gemmaAnswer?: string;
  earlyExit?: boolean;
  similarityScore?: number;
  latencyMs?: number;
  retrievalConfidence?: number;
  combinedReliability?: number;
}

export default function MultiLlmConsensusCard({
  bestModel = "llama",
  consensusScore = 80,
  judgeReason,
  llamaAnswer,
  gptAnswer,
  gemmaAnswer,
  earlyExit = false,
  similarityScore,
  latencyMs,
  retrievalConfidence,
  combinedReliability,
}: MultiLlmConsensusCardProps) {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Backend returns best_model as 'llama' | 'gpt4omini' | 'gemma' (legacy: 'qwen')
  const cleanModelName = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("llama")) return "LLaMA 3.1 8B";
    if (n.includes("gpt")) return "GPT-4o Mini";
    if (n.includes("gemma") || n.includes("qwen") || n.includes("gemini")) return "Gemini Flash";
    return name;
  };
  const bm = (bestModel || "").toLowerCase();
  const isLlamaBest = bm.includes("llama");
  const isGptBest = bm.includes("gpt");
  const isGemmaBest = bm.includes("gemma") || bm.includes("qwen") || bm.includes("gemini");

  const L = (en: string, si: string, ta: string) => (language === "si" ? si : language === "ta" ? ta : en);
  const combined = Math.round(combinedReliability ?? 80);
  const combinedColor = combined >= 80 ? "#66BB6A" : combined >= 60 ? "#FFCA28" : "#EF5350";
  const combinedLabel = combined >= 80 ? L("High", "ඉහළ", "அதிகம்") : combined >= 60 ? L("Moderate", "මධ්‍යම", "நடுத்தரம்") : L("Low", "අඩු", "குறைவு");

  const score = Math.round(consensusScore);

  return (
    <div
      className="mt-4 rounded-2xl border p-4 smooth-transition"
      style={{
        background: theme === "dark" ? "rgba(212, 175, 55, 0.04)" : "rgba(212, 175, 55, 0.08)",
        borderColor: theme === "dark" ? "rgba(212, 175, 55, 0.25)" : "rgba(212, 175, 55, 0.4)",
      }}
    >
      {/* Header: Score & Best Model */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212, 175, 55, 0.2)", color: "#E6AF2E" }}
          >
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                {t.advisory.multiLlmMode}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                style={{
                  background: score >= 80 ? "rgba(0,255,157,0.15)" : "rgba(230,175,46,0.15)",
                  color: score >= 80 ? (theme === "dark" ? "#00FF9D" : "#00875A") : (theme === "dark" ? "#E6AF2E" : "#B45309"),
                  border: `1px solid ${score >= 80 ? "rgba(0,255,157,0.3)" : "rgba(230,175,46,0.3)"}`,
                }}
              >
                {score}% {t.advisory.consensusScore}
              </span>
            </div>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              {t.advisory.bestModel}: <strong style={{ color: "var(--text-primary)" }}>{cleanModelName(bestModel)}</strong>
            </p>
          </div>
        </div>

        {/* Telemetry metadata tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {earlyExit ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono border"
              style={{
                background: "rgba(102,187,106,0.12)",
                color: theme === "dark" ? "#66BB6A" : "#2E7D32",
                borderColor: "rgba(102,187,106,0.35)",
              }}
            >
              <Zap className="w-3 h-3" /> {L("Fast Validated", "ඉක්මන් සත්‍යාපනය", "விரைவு சரிபார்ப்பு")}
              {similarityScore != null && (
                <span className="ml-1 opacity-80">• {Math.round(similarityScore * 100)}% {L("match", "ගැලපීම", "பொருத்தம்")}</span>
              )}
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono border"
              style={{
                background: "rgba(0,255,157,0.1)",
                color: theme === "dark" ? "#00FF9D" : "#00875A",
                borderColor: "rgba(0,255,157,0.3)",
              }}
            >
              <CheckCircle2 className="w-3 h-3" /> {L("Best Answer Selected", "තෝරාගත් හොඳම පිළිතුර", "சிறந்த பதில் தேர்ந்தெடுக்கப்பட்டது")}
            </span>
          )}
          {latencyMs != null && (
            <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ color: "var(--text-muted)", background: "var(--card-bg)" }}>
              {latencyMs}ms
            </span>
          )}
        </div>
      </div>

      {/* Combined Reliability breakdown (Retrieval 50% + Consensus 50%) — same as mobile */}
      <div className="mt-3 p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold" style={{ color: "var(--text-primary)" }}>
            {L("Combined Reliability", "ඒකාබද්ධ විශ්වසනීයත්වය", "ஒருங்கிணைந்த நம்பகத்தன்மை")}
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border" style={{ color: combinedColor, borderColor: combinedColor }}>
            {combined}% ({combinedLabel})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex justify-between" style={{ background: "rgba(127,127,127,0.08)", color: "var(--text-secondary)" }}>
            <span>{L("Retrieval (50%)", "දත්ත ගැලපීම (50%)", "மீட்புத் தரம் (50%)")}</span>
            <strong style={{ color: "var(--text-primary)" }}>{Math.round((retrievalConfidence ?? 0.85) * 100)}%</strong>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex justify-between" style={{ background: "rgba(127,127,127,0.08)", color: "var(--text-secondary)" }}>
            <span>{L("Consensus (50%)", "ආකෘති එකඟතාව (50%)", "மாதிரி ஒருமித்தம் (50%)")}</span>
            <strong style={{ color: "var(--text-primary)" }}>{score}%</strong>
          </div>
        </div>
      </div>

      {/* Consensus Score Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[10px] font-mono mb-1" style={{ color: "var(--text-muted)" }}>
          <span>Multi-LLM Inter-Model Agreement</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{score}/100</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--card-border)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #E6AF2E, #00FF9D)",
            }}
          />
        </div>
      </div>

      {/* Judge Reason Callout */}
      {judgeReason && (
        <div
          className="mt-3 p-3 rounded-xl border text-xs font-mono leading-relaxed"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: theme === "dark" ? "#E6AF2E" : "#B45309" }}>
            <Award className="w-3.5 h-3.5" />
            <span>{t.advisory.judgeReason}:</span>
          </div>
          <p>{judgeReason}</p>
        </div>
      )}

      {/* Accordion Toggle for Individual Model Outputs */}
      {(llamaAnswer || gptAnswer || gemmaAnswer) && (
        <div className="mt-3 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono border smooth-transition hover:opacity-90 font-medium"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              color: "var(--text-primary)",
            }}
          >
            <span className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-amber-500" />
              {isExpanded ? t.advisory.hideModels : t.advisory.viewAllModels}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 mt-3 overflow-hidden"
              >
                {/* LLaMA */}
                {llamaAnswer && (
                  <div className="p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(167, 139, 250, 0.3)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold" style={{ color: "#A78BFA" }}>
                        {t.advisory.llamaOutput}
                      </span>
                      {isLlamaBest && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(0,255,157,0.15)", color: "#00FF9D" }}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> Selected Best
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {llamaAnswer}
                    </p>
                  </div>
                )}

                {/* GPT-4o-mini */}
                {gptAnswer && (
                  <div className="p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(0, 229, 255, 0.3)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold" style={{ color: theme === "dark" ? "#00E5FF" : "#0284C7" }}>
                        {t.advisory.gptOutput}
                      </span>
                      {isGptBest && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(0,255,157,0.15)", color: "#00FF9D" }}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> Selected Best
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {gptAnswer}
                    </p>
                  </div>
                )}

                {/* Gemma / Qwen */}
                {gemmaAnswer && (
                  <div className="p-3 rounded-xl border" style={{ background: "var(--card-bg)", borderColor: "rgba(230, 175, 46, 0.3)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold" style={{ color: theme === "dark" ? "#E6AF2E" : "#B45309" }}>
                        {t.advisory.gemmaOutput}
                      </span>
                      {isGemmaBest && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(0,255,157,0.15)", color: "#00FF9D" }}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> Selected Best
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {gemmaAnswer}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
