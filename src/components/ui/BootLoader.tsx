"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Wifi, Leaf, Activity, ShieldCheck } from "lucide-react";

interface BootStep {
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const BOOT_STEPS: BootStep[] = [
  { label: "SaruPol Gateway", icon: <Wifi className="w-4 h-4" />, duration: 600 },
  { label: "Soil Telemetry Stream", icon: <Database className="w-4 h-4" />, duration: 500 },
  { label: "CNN Pathology Engine", icon: <Cpu className="w-4 h-4" />, duration: 700 },
  { label: "CocoCastAI Models", icon: <Activity className="w-4 h-4" />, duration: 500 },
  { label: "RAG Advisory Engine", icon: <Leaf className="w-4 h-4" />, duration: 400 },
  { label: "Security Handshake", icon: <ShieldCheck className="w-4 h-4" />, duration: 300 },
];

export default function BootLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= BOOT_STEPS.length) {
        setTimeout(() => setIsLoading(false), 400);
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
    setTimeout(runStep, 800);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="boot-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#030705" }}
        >
          {/* Ambient glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)" }}
          />

          {/* Telemetry grid background */}
          <div className="absolute inset-0 telemetry-grid opacity-30" />

          {/* Brand Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mb-8"
          >
            {/* Leaf icon as brand */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,157,0.15), rgba(0,255,157,0.05))",
                border: "1px solid rgba(0,255,157,0.2)",
              }}
            >
              <Leaf className="w-8 h-8" style={{ color: "#00FF9D" }} />
              <div className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "0 0 40px rgba(0,255,157,0.15)" }}
              />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl font-light tracking-[0.35em] uppercase mb-2"
              style={{ color: "#e8efe8" }}
            >
              SaruPol
            </h1>
            <p className="text-[10px] tracking-[0.5em] uppercase"
              style={{ color: "rgba(0,255,157,0.4)" }}
            >
              Coconut Research Intelligence
            </p>
          </motion.div>

          {/* Boot Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-80 space-y-2"
          >
            {BOOT_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg"
                style={{
                  background: completedSteps.includes(i)
                    ? "rgba(0,255,157,0.05)"
                    : "transparent",
                }}
              >
                <span style={{
                  color: completedSteps.includes(i) ? "#00FF9D" :
                    currentStep === i ? "rgba(0,255,157,0.6)" : "rgba(255,255,255,0.15)"
                }}>
                  {step.icon}
                </span>
                <span className="text-xs font-mono tracking-wide flex-1"
                  style={{
                    color: completedSteps.includes(i) ? "rgba(0,255,157,0.8)" :
                      currentStep === i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"
                  }}
                >
                  {step.label}
                </span>
                <span className="text-[10px] font-mono"
                  style={{
                    color: completedSteps.includes(i) ? "#00FF9D" : "rgba(255,255,255,0.1)"
                  }}
                >
                  {completedSteps.includes(i) ? "OK" : currentStep === i ? "..." : "—"}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom status */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 text-[10px] tracking-[0.3em] uppercase font-mono"
            style={{ color: "rgba(0,255,157,0.2)" }}
          >
            Initializing Research Systems
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
