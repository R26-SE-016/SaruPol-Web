"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Cpu, Database, Wifi, Leaf, Activity, ShieldCheck } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";

interface BootStep {
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const BOOT_STEPS: BootStep[] = [
  { label: "SaruPol Core Gateway", icon: <Wifi className="w-4 h-4" />, duration: 550 },
  { label: "Soil Telemetry Triangulation", icon: <Database className="w-4 h-4" />, duration: 480 },
  { label: "CNN Pathology Vision Engine", icon: <Cpu className="w-4 h-4" />, duration: 620 },
  { label: "SaruPol Yield Ensemble", icon: <Activity className="w-4 h-4" />, duration: 480 },
  { label: "Agronomist Consensus RAG", icon: <Leaf className="w-4 h-4" />, duration: 420 },
  { label: "CRI Research Security Handshake", icon: <ShieldCheck className="w-4 h-4" />, duration: 350 },
];

export default function BootLoader() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= BOOT_STEPS.length) {
        setTimeout(() => setIsLoading(false), 450);
        return;
      }
      setCurrentStep(stepIndex);
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
        runStep();
      }, BOOT_STEPS[stepIndex].duration);
    };

    // Initial delay for brand reveal
    const timer = setTimeout(runStep, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="boot-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none"
          style={{ backgroundColor: theme === "dark" ? "#030705" : "#F2F6F3" }}
        >
          {/* Ambient luxury gold & emerald glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: theme === "dark"
                ? "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(0,255,157,0.06) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(0,135,90,0.08) 40%, transparent 70%)",
            }}
          />

          {/* Telemetry grid background */}
          <div className="absolute inset-0 telemetry-grid" style={{ opacity: theme === "dark" ? 0.3 : 0.15 }} />

          {/* Pure Brand Icon Mark with Magnificent Ambient Glow (No Outer Box/Border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-2 flex items-center justify-center"
          >
            {/* Ambient Back Glow Halo */}
            <div
              className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
              style={{
                background: theme === "dark"
                  ? "radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(0,255,157,0.2) 50%, transparent 80%)"
                  : "radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(0,135,90,0.15) 50%, transparent 80%)",
                transform: "scale(1.25)",
              }}
            />
            <Image
              src="/brand/logo-icon.png"
              alt="SaruPol Brand Icon"
              width={200}
              height={200}
              className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 object-contain"
              style={{
                filter: theme === "dark"
                  ? "drop-shadow(0 0 35px rgba(212,175,55,0.55))"
                  : "drop-shadow(0 8px 24px rgba(0,0,0,0.35)) drop-shadow(0 0 15px rgba(212,175,55,0.35))"
              }}
              priority
            />
          </motion.div>

          {/* 3D Embossed Text Logo Brand Reveal with Strong Dark Shadow in Light Mode */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex flex-col items-center text-center mb-7 px-4"
          >
            <div className="relative max-w-[400px] sm:max-w-[520px] md:max-w-[600px]">
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={600}
                height={165}
                className="w-auto h-24 sm:h-28 md:h-32 object-contain"
                style={{
                  filter: theme === "dark"
                    ? "drop-shadow(0 12px 36px rgba(212,175,55,0.6))"
                    : "drop-shadow(0 0 12px rgba(0,0,0,0.85)) drop-shadow(0 6px 22px rgba(0,0,0,0.6))"
                }}
                priority
              />
            </div>
          </motion.div>

          {/* Boot Steps Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-80 sm:w-96 space-y-2 px-2"
          >
            {BOOT_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border transition-all duration-300 shadow-sm"
                style={{
                  background: theme === "dark"
                    ? (completedSteps.includes(i) ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)")
                    : (completedSteps.includes(i) ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.7)"),
                  borderColor: theme === "dark"
                    ? (completedSteps.includes(i) ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.04)")
                    : (completedSteps.includes(i) ? "rgba(212,175,55,0.35)" : "rgba(16,40,24,0.08)"),
                }}
              >
                <span
                  style={{
                    color: completedSteps.includes(i)
                      ? (theme === "dark" ? "#E6AF2E" : "#B45309")
                      : currentStep === i
                      ? (theme === "dark" ? "rgba(0,255,157,0.8)" : "#00875A")
                      : (theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(16,40,24,0.3)"),
                  }}
                >
                  {step.icon}
                </span>
                <span
                  className="text-xs font-mono tracking-wide flex-1 font-medium"
                  style={{
                    color: completedSteps.includes(i)
                      ? (theme === "dark" ? "rgba(232,239,232,0.9)" : "#0A1B10")
                      : currentStep === i
                      ? (theme === "dark" ? "rgba(255,255,255,0.7)" : "#243B2B")
                      : (theme === "dark" ? "rgba(255,255,255,0.2)" : "#73887B"),
                  }}
                >
                  {step.label}
                </span>
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{
                    color: completedSteps.includes(i)
                      ? (theme === "dark" ? "#00FF9D" : "#00875A")
                      : currentStep === i
                      ? (theme === "dark" ? "#E6AF2E" : "#D97706")
                      : (theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(16,40,24,0.2)"),
                  }}
                >
                  {completedSteps.includes(i) ? "READY" : currentStep === i ? "SYNC..." : "—"}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom status */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-7 text-[10px] tracking-[0.35em] uppercase font-mono"
            style={{ color: theme === "dark" ? "rgba(212,175,55,0.4)" : "rgba(180,130,20,0.7)" }}
          >
            CRI RESEARCH PROTOCOL v2.4 · 2026
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
