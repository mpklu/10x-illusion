import { MAX_PHASES } from "../data/phases";

export default function FactorsTab({ phases, multipliers, expandedPhase, setExpandedPhase, setConfirmRemove, setShowAddModal }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
        Each phase is affected differently by AI. Click to explore details. Remove phases that don't apply, or add custom ones to match your actual workflow.
      </p>
      {phases.map(p => {
        const isOpen = expandedPhase === p.id;
        const speedup = multipliers[p.id] || p.aiDefault;
        const isExpanding = speedup < 1.0;
        return (
          <div key={p.id} style={{
            background: "var(--surface-1)", borderRadius: 10, marginBottom: 10, overflow: "hidden",
            border: isOpen ? "1px solid var(--accent)" : "1px solid transparent",
          }}>
            <div onClick={() => setExpandedPhase(isOpen ? null : p.id)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {p.name}
                    {!p.isDefault && <span style={{ fontSize: 9, fontWeight: 600, color: "var(--accent)", background: "rgba(59,130,246,0.12)", padding: "1px 5px", borderRadius: 3 }}>CUSTOM</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.defaultPct}% of project · {p.category}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {phases.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(p.id); }} style={{
                    background: "none", border: "1px solid var(--border)", color: "var(--text-tertiary)", fontSize: 11,
                    cursor: "pointer", padding: "4px 8px", borderRadius: 4, fontFamily: "var(--font-body)",
                  }}>Remove</button>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", color: isExpanding ? "var(--red)" : speedup > 2 ? "var(--green)" : "var(--text-secondary)" }}>{speedup.toFixed(1)}x</span>
                <span style={{ color: "var(--text-tertiary)", fontSize: 18, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-mono)" }}>AI Impact</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.aiNotes}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-mono)" }}>Human Bottleneck</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.bottleneck}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-mono)" }}>New AI Risk</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.newRisk}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>REALISTIC RANGE</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{p.aiMin}x</span>
                      <div style={{ flex: 1, height: 6, background: "var(--surface-1)", borderRadius: 3, position: "relative" }}>
                        <div style={{
                          position: "absolute", left: `${Math.min(100, Math.max(0, ((p.aiDefault - p.aiMin) / (p.aiMax - p.aiMin)) * 100))}%`,
                          top: -3, width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--surface-0)",
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{p.aiMax}x</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4, textAlign: "center" }}>Default: {p.aiDefault}x</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {phases.length < MAX_PHASES && (
        <button onClick={() => setShowAddModal(true)} style={{
          width: "100%", padding: "14px", fontSize: 13, fontWeight: 600, background: "transparent",
          border: "2px dashed var(--border)", borderRadius: 10, color: "var(--text-tertiary)",
          cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)",
        }} onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
           onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-tertiary)"; }}>
          + Add Custom Phase ({phases.length}/{MAX_PHASES})
        </button>
      )}
    </div>
  );
}
