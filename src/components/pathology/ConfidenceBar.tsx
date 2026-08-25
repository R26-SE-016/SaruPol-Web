export default function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "#00FF9D" : pct >= 75 ? "#E6AF2E" : "#FF4C4C";
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px] font-mono w-10 text-right" style={{ color }}>{pct}%</div>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
