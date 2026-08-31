"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DISEASE_COLORS } from "@/lib/demo-data";

export default function DiseaseChart({ diagnostics, title }: { diagnostics: any[], title: string }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    diagnostics.forEach(d => {
      counts[d.disease_class] = (counts[d.disease_class] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: DISEASE_COLORS[key]?.label || key,
      value: counts[key],
      color: DISEASE_COLORS[key]?.color || "#94a3b8"
    })).sort((a, b) => b.value - a.value);
  }, [diagnostics]);

  return (
    <div className="glass-card p-6 flex flex-col rounded-2xl">
      <h3 className="text-sm font-mono mb-4" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div className="flex-1 min-h-[220px] flex items-center justify-center">
        {data.length === 0 ? (
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "rgba(0, 255, 157, 0.08)", border: "1px solid rgba(0, 255, 157, 0.2)" }}>
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-[#00FF9D] animate-spin" />
            </div>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>No scan telemetry recorded yet</p>
            <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>Execute your first leaf analysis to plot distribution</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "var(--dropdown-bg)", border: "1px solid var(--dropdown-border)", borderRadius: "12px", backdropFilter: "blur(10px)", color: "var(--text-primary)" }}
                itemStyle={{ color: "var(--text-primary)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-mono)", opacity: 0.9, color: "var(--text-secondary)" }} 
                layout="vertical" verticalAlign="middle" align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
