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
    <div className="glass-card p-5 flex flex-col">
      <h3 className="text-sm font-mono mb-4" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div className="flex-1 min-h-[220px]">
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
              contentStyle={{ background: "var(--dropdown-bg)", border: "1px solid var(--dropdown-border)", borderRadius: "8px", backdropFilter: "blur(10px)", color: "var(--text-primary)" }}
              itemStyle={{ color: "var(--text-primary)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-mono)", opacity: 0.9, color: "var(--text-secondary)" }} 
              layout="vertical" verticalAlign="middle" align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
