import { PRESETS } from "../data/presets";
import SliderControl from "../components/SliderControl";
import PhaseBar from "../components/PhaseBar";

export default function EstimatorTab({ baselineDays, setBaselineDays, preset, applyPreset, calculations, phases, multipliers, updateMultiplier, setConfirmRemove, setShowAddModal }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6, fontFamily: "var(--font-mono)" }}>Baseline (days)</label>
          <input type="number" value={baselineDays} onChange={(e) => setBaselineDays(Math.max(1, Number(e.target.value)))} style={{
            width: "100%", padding: "10px 12px", fontSize: 20, fontWeight: 700, background: "var(--surface-1)",
            border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-mono)", boxSizing: "border-box",
          }} />
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Pre-AI estimate for the full project</div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6, fontFamily: "var(--font-mono)" }}>AI Adoption Preset</label>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(PRESETS).map(([key, val]) => (
              <button key={key} onClick={() => applyPreset(key)} style={{
                flex: 1, padding: "10px 12px", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)",
                background: preset === key ? "var(--accent)" : "var(--surface-1)",
                color: preset === key ? "#fff" : "var(--text-secondary)",
                border: preset === key ? "none" : "1px solid var(--border)", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              }}>
                <div>{val.label}</div>
                <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{val.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "AI-Adjusted Timeline", value: `${calculations.totalAi.toFixed(0)} days`, sub: `was ${calculations.totalOriginal.toFixed(0)} days`, color: "var(--accent)" },
          { label: "Overall Speedup", value: `${calculations.overallSpeedup.toFixed(1)}x`, sub: `coding alone is ${calculations.codingSpeedup.toFixed(0)}x`, color: "var(--green)" },
          { label: "Days Saved", value: `${calculations.timeSaved.toFixed(0)}`, sub: `${((calculations.timeSaved / calculations.totalOriginal) * 100).toFixed(0)}% reduction`, color: "var(--amber)" },
          { label: "Bottleneck Phase", value: calculations.bottleneckPhase?.icon || "—", sub: calculations.bottleneckPhase?.name?.split(" /")[0]?.split(" &")[0] || "—", color: "var(--red)" },
        ].map((stat, i) => (
          <div key={i} style={{ padding: "16px", background: "var(--surface-1)", borderRadius: 10, borderLeft: `3px solid ${stat.color}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "var(--font-mono)" }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, fontFamily: "var(--font-mono)" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)" }}>Timeline Comparison</h3>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-tertiary)" }}>
            <span><span style={{ display: "inline-block", width: 12, height: 8, background: "var(--text-tertiary)", opacity: 0.4, borderRadius: 2, marginRight: 4 }} />Original</span>
            <span><span style={{ display: "inline-block", width: 12, height: 8, background: "var(--accent)", opacity: 0.8, borderRadius: 2, marginRight: 4 }} />AI-Adjusted</span>
            <span><span style={{ display: "inline-block", width: 12, height: 8, background: "var(--red)", opacity: 0.8, borderRadius: 2, marginRight: 4 }} />Expanded</span>
          </div>
        </div>
        {calculations.phases.map(p => (
          <PhaseBar key={p.id} phase={p} originalDays={p.originalDays} aiDays={p.aiDays} totalOriginal={calculations.totalOriginal} />
        ))}
      </div>

      <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-display)" }}>Adjust AI Impact by Phase</h3>
        <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 16px" }}>
          Below 1.0 = phase gets longer. Use × to remove phases, or "Add Phase" above to customize your cycle.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
          {phases.map(p => (
            <div key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.icon} {p.name}
                  <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-tertiary)", marginLeft: 6 }}>({p.defaultPct}%)</span>
                  {!p.isDefault && <span style={{ fontSize: 9, fontWeight: 600, color: "var(--accent)", marginLeft: 5, background: "rgba(59,130,246,0.12)", padding: "1px 5px", borderRadius: 3 }}>CUSTOM</span>}
                </div>
                {phases.length > 1 && (
                  <button onClick={() => setConfirmRemove(p.id)} title="Remove phase" style={{
                    background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 14, cursor: "pointer",
                    padding: "2px 6px", borderRadius: 4, lineHeight: 1, opacity: 0.4, transition: "opacity 0.15s", flexShrink: 0,
                  }} onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.color = "var(--red)"; }}
                     onMouseLeave={e => { e.target.style.opacity = 0.4; e.target.style.color = "var(--text-tertiary)"; }}>×</button>
                )}
              </div>
              <SliderControl phase={p} value={multipliers[p.id] || p.aiDefault} onChange={(v) => updateMultiplier(p.id, v)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
