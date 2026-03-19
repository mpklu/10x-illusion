export default function SliderControl({ phase, value, onChange }) {
  const isExpanding = value < 1.0;
  const pctChange = value >= 1.0 ? Math.round((1 - 1/value) * 100) : -Math.round((1/value - 1) * 100);
  return (
    <div style={{ marginBottom: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{value.toFixed(1)}x</span>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)", color: isExpanding ? "var(--red)" : pctChange > 0 ? "var(--green)" : "var(--text-tertiary)" }}>
          {isExpanding ? `+${Math.abs(pctChange)}% longer` : pctChange > 0 ? `${pctChange}% faster` : "no change"}
        </span>
      </div>
      <input type="range" min={phase.aiMin * 10} max={phase.aiMax * 10} value={value * 10}
        onChange={(e) => onChange(Number(e.target.value) / 10)} style={{ width: "100%", accentColor: isExpanding ? "var(--red)" : "var(--accent)" }} />
    </div>
  );
}
