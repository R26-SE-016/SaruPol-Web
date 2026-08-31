"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Sliders,
  DollarSign,
  Scale,
  Calendar,
  Building,
  ArrowUpRight,
  PieChart as PieIcon,
  Percent
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import type { CdaRatesResponse, YieldPredictionResponse } from "@/lib/api";

interface CdaMarketTabProps {
  cdaRates: CdaRatesResponse | null;
  result: YieldPredictionResponse | null;
  treesCount: number;
}

const HISTORICAL_CDA_PRICES = [
  { month: "Mar '25", gradeA: 135, gradeB: 105, gradeC: 80 },
  { month: "May '25", gradeA: 142, gradeB: 112, gradeC: 88 },
  { month: "Jul '25", gradeA: 148, gradeB: 118, gradeC: 92 },
  { month: "Sep '25", gradeA: 140, gradeB: 110, gradeC: 85 },
  { month: "Nov '25", gradeA: 150, gradeB: 115, gradeC: 90 },
  { month: "Jan '26", gradeA: 152, gradeB: 118, gradeC: 94 },
  { month: "Aug '26", gradeA: 155, gradeB: 120, gradeC: 95 },
];

export default function CdaMarketTab({ cdaRates, result, treesCount }: CdaMarketTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Price States
  const priceA = cdaRates?.a_grade_price || 155;
  const priceB = cdaRates?.b_grade_price || 120;
  const priceC = cdaRates?.c_grade_price || 95;

  // Grade Distribution Sensitivity States
  const [pctA, setPctA] = useState(50);
  const [pctB, setPctB] = useState(35);
  const [pctC, setPctC] = useState(15);
  const [harvestCostPerNut, setHarvestCostPerNut] = useState(18); // LKR per nut (plucking + husking + transport)

  const totalNuts = result ? result.predicted_next_pick_yield_nuts : 1600;
  const annualTotalNuts = result ? result.predicted_annual_yield_nuts : 12800;

  // Financial Computations
  const nutsA = Math.round(totalNuts * (pctA / 100));
  const nutsB = Math.round(totalNuts * (pctB / 100));
  const nutsC = Math.round(totalNuts * (pctC / 100));

  const grossRevenue = Math.round(nutsA * priceA + nutsB * priceB + nutsC * priceC);
  const totalCost = Math.round(totalNuts * harvestCostPerNut);
  const netProfit = Math.max(0, grossRevenue - totalCost);
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Live CDA Auction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Grade A */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(230, 175, 46, 0.08), rgba(230, 175, 46, 0.02))",
            borderColor: "rgba(230, 175, 46, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-500">{t.yield.gradeA}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-amber-500" style={{ borderColor: "rgba(230,175,46,0.3)" }}>
              Premium
            </span>
          </div>
          <p className="text-3xl font-mono font-bold text-amber-500">
            LKR {priceA.toFixed(2)}
          </p>
          <p className="text-[10px] font-mono text-muted">
            CDA Colombo Auction Reference • Large Export Grade
          </p>
        </div>

        {/* Grade B */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(0, 229, 255, 0.02))",
            borderColor: "rgba(0, 229, 255, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">{t.yield.gradeB}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-cyan-400" style={{ borderColor: "rgba(0,229,255,0.3)" }}>
              Standard
            </span>
          </div>
          <p className="text-3xl font-mono font-bold text-cyan-400">
            LKR {priceB.toFixed(2)}
          </p>
          <p className="text-[10px] font-mono text-muted">
            Medium Commercial Copra & Desiccated Milling
          </p>
        </div>

        {/* Grade C */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl shadow-md space-y-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 255, 157, 0.02))",
            borderColor: "rgba(0, 255, 157, 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">{t.yield.gradeC}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-emerald-400" style={{ borderColor: "rgba(0,255,157,0.3)" }}>
              Domestic
            </span>
          </div>
          <p className="text-3xl font-mono font-bold text-emerald-400">
            LKR {priceC.toFixed(2)}
          </p>
          <p className="text-[10px] font-mono text-muted">
            Small / Oil Extraction Processing Grade
          </p>
        </div>
      </div>

      {/* Financial Revenue & Sensitivity Forecaster */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl shadow-md space-y-5"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
          <div>
            <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{t.yield.revenueProjection}</span>
            </h3>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Simulate gross revenue and net plantation margins based on yield pick distribution and operational cost.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {profitMargin}% Net Margin
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders Area */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-500 font-bold">Grade A Nut Ratio: {pctA}%</span>
                <span style={{ color: "var(--text-primary)" }}>{nutsA.toLocaleString()} nuts</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={pctA}
                onChange={(e) => setPctA(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #E6AF2E ${pctA}%, var(--card-border) 0%)` }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400 font-bold">Grade B Nut Ratio: {pctB}%</span>
                <span style={{ color: "var(--text-primary)" }}>{nutsB.toLocaleString()} nuts</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={pctB}
                onChange={(e) => setPctB(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #00E5FF ${pctB}%, var(--card-border) 0%)` }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-bold">Grade C Nut Ratio: {pctC}%</span>
                <span style={{ color: "var(--text-primary)" }}>{nutsC.toLocaleString()} nuts</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={pctC}
                onChange={(e) => setPctC(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #00FF9D ${pctC}%, var(--card-border) 0%)` }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-red-400 font-bold">Harvesting & Transport Cost (LKR/nut):</span>
                <span className="text-red-400">LKR {harvestCostPerNut}</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={harvestCostPerNut}
                onChange={(e) => setHarvestCostPerNut(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #EF4444 ${((harvestCostPerNut - 5) / 35) * 100}%, var(--card-border) 0%)` }}
              />
            </div>
          </div>

          {/* Revenue Breakdown KPI Card */}
          <div
            className="p-5 rounded-2xl border flex flex-col justify-between"
            style={{ background: "rgba(0,0,0,0.02)", borderColor: "var(--card-border)" }}
          >
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Total Pick Volume:</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>{totalNuts.toLocaleString()} nuts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Estimated Gross Revenue:</span>
                <span className="font-bold text-amber-500">LKR {grossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Harvesting & Field Cost:</span>
                <span className="font-bold text-red-400">- LKR {totalCost.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-sm" style={{ borderColor: "var(--card-border)" }}>
                <span className="font-bold text-emerald-400">Estimated Net Profit:</span>
                <span className="font-bold text-emerald-400">LKR {netProfit.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[10px] font-mono text-muted text-center" style={{ borderColor: "var(--card-border)" }}>
              Annualized Gross: LKR {Math.round(grossRevenue * 8).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Historical CDA Auction Price Chart */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl shadow-md space-y-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--card-border)" }}>
          <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>CDA Auction Price Fluctuation Trend (LKR/Nut)</span>
          </h3>
          <span className="text-[10px] font-mono text-muted">Colombo Auction Benchmark</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HISTORICAL_CDA_PRICES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} fontFamily="monospace" />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} fontFamily="monospace" domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{
                  background: theme === "dark" ? "rgba(10, 20, 14, 0.95)" : "rgba(255, 255, 255, 0.98)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "var(--text-primary)",
                }}
                formatter={(val: any) => [`LKR ${val}`, "Auction Price"]}
              />
              <Line type="monotone" dataKey="gradeA" stroke="#E6AF2E" strokeWidth={2.5} name="Grade A" />
              <Line type="monotone" dataKey="gradeB" stroke="#00E5FF" strokeWidth={2} name="Grade B" />
              <Line type="monotone" dataKey="gradeC" stroke="#00FF9D" strokeWidth={1.5} name="Grade C" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
