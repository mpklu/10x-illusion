import { useState } from "react";
import { ICON_OPTIONS, CATEGORY_OPTIONS } from "../data/phases";

export default function AddPhaseModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚙️");
  const [pct, setPct] = useState(10);
  const [aiMin, setAiMin] = useState(1.0);
  const [aiMax, setAiMax] = useState(3.0);
  const [aiDefault, setAiDefault] = useState(1.5);
  const [category, setCategory] = useState("build");
  const [aiNotes, setAiNotes] = useState("");
  const [bottleneck, setBottleneck] = useState("");
  const [newRisk, setNewRisk] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const canSave = name.trim().length > 0 && pct > 0 && pct <= 100 && aiMin > 0 && aiMax > aiMin && aiDefault >= aiMin && aiDefault <= aiMax;

  const handleSave = () => {
    if (!canSave) return;
    onAdd({
      id: "custom_" + Date.now(),
      name: name.trim(), icon, defaultPct: pct,
      aiMin, aiMax, aiDefault,
      aiNotes: aiNotes || "Custom phase — adjust AI impact based on your team's experience.",
      bottleneck: bottleneck || "Varies by team and project context",
      newRisk: newRisk || "Assess based on your specific AI tooling and workflow",
      category, isDefault: false,
    });
  };

  const fieldLabel = (text) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontFamily: "var(--font-mono)" }}>{text}</div>
  );
  const inputStyle = {
    width: "100%", padding: "8px 10px", fontSize: 13, background: "var(--surface-2)", border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text-primary)", fontFamily: "var(--font-body)", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "var(--surface-1)", borderRadius: 14, padding: "24px 28px", maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)" }}>Add Custom Phase</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ position: "relative" }}>
            {fieldLabel("Icon")}
            <button onClick={() => setShowIconPicker(!showIconPicker)} style={{
              width: 44, height: 38, fontSize: 20, background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{icon}</button>
            {showIconPicker && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2, width: 260 }}>
                {ICON_OPTIONS.map(ic => (
                  <button key={ic} onClick={() => { setIcon(ic); setShowIconPicker(false); }} style={{
                    width: 30, height: 30, fontSize: 16, background: ic === icon ? "var(--accent)" : "transparent",
                    border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{ic}</button>
                ))}
              </div>
            )}
          </div>
          <div>
            {fieldLabel("Phase Name")}
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Security Review, Documentation" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            {fieldLabel("% of Baseline")}
            <input type="number" min={1} max={100} value={pct} onChange={e => setPct(Math.max(0, Math.min(100, Number(e.target.value))))} style={inputStyle} />
          </div>
          <div>
            {fieldLabel("Category")}
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
              {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          {fieldLabel("AI Speed Multiplier Range")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Min</div>
              <input type="number" min={0.1} max={10} step={0.1} value={aiMin} onChange={e => setAiMin(Number(e.target.value))} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Default</div>
              <input type="number" min={0.1} max={10} step={0.1} value={aiDefault} onChange={e => setAiDefault(Number(e.target.value))} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Max</div>
              <input type="number" min={0.1} max={20} step={0.1} value={aiMax} onChange={e => setAiMax(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4 }}>
            Below 1.0 = AI makes this phase slower. Above 1.0 = AI makes it faster.
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          {fieldLabel("AI Impact Notes (optional)")}
          <textarea value={aiNotes} onChange={e => setAiNotes(e.target.value)} placeholder="How does AI affect this phase?" rows={2} style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-body)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            {fieldLabel("Human Bottleneck (optional)")}
            <input value={bottleneck} onChange={e => setBottleneck(e.target.value)} placeholder="What limits speed here?" style={inputStyle} />
          </div>
          <div>
            {fieldLabel("New AI Risk (optional)")}
            <input value={newRisk} onChange={e => setNewRisk(e.target.value)} placeholder="What could go wrong?" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, background: "var(--surface-2)", color: "var(--text-secondary)", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave} style={{
            padding: "9px 18px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 7, cursor: canSave ? "pointer" : "not-allowed", fontFamily: "var(--font-body)",
            background: canSave ? "var(--accent)" : "var(--surface-2)", color: canSave ? "#fff" : "var(--text-tertiary)", opacity: canSave ? 1 : 0.5,
          }}>Add Phase</button>
        </div>
      </div>
    </div>
  );
}
