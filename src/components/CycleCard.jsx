export default function CycleCard({ cycle, isSelected, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      padding: "18px 20px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s", marginBottom: 12,
      border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
      background: isSelected ? "var(--surface-2)" : "var(--surface-1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-display)" }}>{cycle.name}</h4>
        <span style={{ fontSize: 11, color: "var(--accent)", fontStyle: "italic", flexShrink: 0, marginLeft: 8 }}>{cycle.tagline}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{cycle.description}</p>
      {isSelected && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            {cycle.phases.map((p, i) => (
              <div key={i} style={{
                flex: p.pct, height: 28, background: p.color,
                borderRadius: i === 0 ? "4px 0 0 4px" : i === cycle.phases.length - 1 ? "0 4px 4px 0" : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 600, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                overflow: "hidden", whiteSpace: "nowrap", minWidth: 0,
              }}>{p.pct >= 12 ? p.name : ""}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {cycle.phases.map((p, i) => (
              <span key={i} style={{ fontSize: 10, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />{p.name} ({p.pct}%)
              </span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>Advantages</div>
              {cycle.pros.map((p, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 3, paddingLeft: 10, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--green)" }}>+</span>{p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>Trade-offs</div>
              {cycle.cons.map((c, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 3, paddingLeft: 10, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--red)" }}>−</span>{c}</div>)}
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 10px", background: "var(--surface-1)", borderRadius: 6, fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Best for: </span>
            <span style={{ color: "var(--text-secondary)" }}>{cycle.bestFor}</span>
          </div>
        </div>
      )}
    </div>
  );
}
