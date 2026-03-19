export default function PhaseBar({ phase, originalDays, aiDays, totalOriginal }) {
  const maxDays = totalOriginal;
  const origPct = (originalDays / maxDays) * 100;
  const aiPct = (aiDays / maxDays) * 100;
  const isExpanded = aiDays > originalDays;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ width: 140, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {phase.icon} {phase.name.length > 18 ? phase.name.substring(0, 18) + "…" : phase.name}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ height: 14, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${origPct}%`, background: "var(--text-tertiary)", borderRadius: 3, opacity: 0.4, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ height: 14, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${aiPct}%`, background: isExpanded ? "var(--red)" : "var(--accent)", borderRadius: 3, opacity: 0.8, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ width: 80, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-secondary)", textAlign: "right", flexShrink: 0 }}>
        {originalDays.toFixed(0)}d → {aiDays.toFixed(0)}d
      </div>
    </div>
  );
}
