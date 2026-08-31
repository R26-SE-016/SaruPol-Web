"use client";

import { useState, useRef, useEffect } from "react";
import { Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpTooltipProps {
  title?: string;
  content: string;
  formula?: string;
  icon?: "info" | "help";
  position?: "top" | "bottom" | "left" | "right";
  color?: string;
}

export default function HelpTooltip({
  title,
  content,
  formula,
  icon = "info",
  position = "top",
  color = "#00E5FF",
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const IconComponent = icon === "info" ? Info : HelpCircle;

  return (
    <div className="relative inline-flex items-center align-middle" ref={tooltipRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="p-0.5 rounded-full transition-transform hover:scale-110 focus:outline-none opacity-70 hover:opacity-100 cursor-pointer"
        style={{ color }}
        title={title || "Click for details"}
      >
        <IconComponent className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-64 p-3 rounded-xl border shadow-2xl backdrop-blur-xl pointer-events-none text-left font-mono text-[11px] leading-relaxed ${
              position === "top"
                ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
                : position === "bottom"
                ? "top-full mt-2 left-1/2 -translate-x-1/2"
                : position === "left"
                ? "right-full mr-2 top-1/2 -translate-y-1/2"
                : "left-full ml-2 top-1/2 -translate-y-1/2"
            }`}
            style={{
              background: "rgba(11, 17, 30, 0.96)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#E2E8F0",
              boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 15px -3px ${color}30`,
            }}
          >
            {title && (
              <div className="font-bold flex items-center gap-1.5 pb-1 mb-1.5 border-b" style={{ color, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span>{title}</span>
              </div>
            )}
            
            <p className="text-gray-300">{content}</p>

            {formula && (
              <div className="mt-2 p-1.5 rounded bg-black/50 border border-white/10 font-mono text-[10px] text-cyan-300">
                <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Formula / Computation:</span>
                <code>{formula}</code>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
