"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  trend?: { value: string; positive: boolean };
  accentColor: string;
}

export default function StatCard({ icon, label, value, subtitle, trend, accentColor }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl pointer-events-none" 
        style={{ background: accentColor, transform: "translate(30%, -30%)" }} 
      />
      
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
        >
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full"
            style={{ 
              background: trend.positive ? "rgba(0,255,157,0.1)" : "rgba(255,76,76,0.1)",
              color: trend.positive ? "#00FF9D" : "#FF4C4C"
            }}
          >
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm text-white/50 font-mono mb-1">{label}</h3>
        <div className="text-3xl font-light text-white mb-2">{value}</div>
        <p className="text-xs text-white/40">{subtitle}</p>
      </div>
    </motion.div>
  );
}
