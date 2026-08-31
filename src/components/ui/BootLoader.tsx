"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Cpu, Database, Wifi, Leaf, Activity, ShieldCheck } from "lucide-react";

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
          style={{ backgroundColor: "#030705" }}
        >
          {/* Ambient luxury gold & emerald glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(0,255,157,0.06) 40%, transparent 70%)",
            }}
          />

          {/* Telemetry grid background */}
          <div className="absolute inset-0 telemetry-grid opacity-30" />

          {/* Brand Icon Mark with Breathing Halo (Substantially Enlarged & Radiant) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-3.5"
          >
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(145deg, rgba(28,34,28,0.95), rgba(8,12,9,0.98))",
                border: "1.5px solid rgba(212,175,55,0.45)",
                boxShadow: "0 0 60px rgba(212,175,55,0.35), 0 0 100px rgba(0,255,157,0.18)",
              }}
            >
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Brand Icon"
                width={150}
                height={150}
                className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(212,175,55,0.5)]"
                priority
              />
            </div>
          </motion.div>

          {/* 3D Embossed Text Logo Brand Reveal (Significantly Enlarged & Prominent) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex flex-col items-center text-center mb-6 px-4"
          >
            <div className="relative max-w-[360px] sm:max-w-[480px] md:max-w-[540px]">
              <Image
                src="/brand/logo-text.png"
                alt="සරුපොල් (SaruPol)"
                width={540}
                height={150}
                className="w-auto h-20 sm:h-24 md:h-28 object-contain drop-shadow-[0_10px_32px_rgba(212,175,55,0.55)]"
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
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border transition-all duration-300"
                style={{
                  background: completedSteps.includes(i)
                    ? "rgba(212,175,55,0.06)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: completedSteps.includes(i)
                    ? "rgba(212,175,55,0.2)"
                    : "rgba(255,255,255,0.04)",
                }}
              >
                <span
                  style={{
                    color: completedSteps.includes(i)
                      ? "#E6AF2E"
                      : currentStep === i
                      ? "rgba(0,255,157,0.8)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {step.icon}
                </span>
                <span
                  className="text-xs font-mono tracking-wide flex-1"
                  style={{
                    color: completedSteps.includes(i)
                      ? "rgba(232,239,232,0.9)"
                      : currentStep === i
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {step.label}
                </span>
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{
                    color: completedSteps.includes(i)
                      ? "#00FF9D"
                      : currentStep === i
                      ? "#E6AF2E"
                      : "rgba(255,255,255,0.15)",
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
            style={{ color: "rgba(212,175,55,0.4)" }}
          >
            CRI RESEARCH PROTOCOL v2.4 · 2026
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
