import { useState, useMemo, useCallback, useEffect } from "react";
import { DARK_THEME, LIGHT_THEME } from "./data/themes";
import { DEFAULT_PHASES, MAX_PHASES } from "./data/phases";
import { PRESET_MULTIPLIERS } from "./data/presets";
import AddPhaseModal from "./components/AddPhaseModal";
import GuideTab from "./tabs/GuideTab";
import EstimatorTab from "./tabs/EstimatorTab";
import FactorsTab from "./tabs/FactorsTab";
import CyclesTab from "./tabs/CyclesTab";
import FrameworkTab from "./tabs/FrameworkTab";

export default function AITimelineFramework() {
  const [tab, setTab] = useState("guide");
  const [baselineDays, setBaselineDays] = useState(90);
  const [preset, setPreset] = useState("moderate");
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [multipliers, setMultipliers] = useState(
    Object.fromEntries(DEFAULT_PHASES.map(p => [p.id, p.aiDefault]))
  );
  const [selectedCycle, setSelectedCycle] = useState("spec-first");
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.style.background = darkMode ? DARK_THEME["--surface-0"] : LIGHT_THEME["--surface-0"];
  }, [darkMode]);

  const totalPct = useMemo(() => phases.reduce((s, p) => s + p.defaultPct, 0), [phases]);
  const pctWarning = totalPct !== 100;

  const applyPreset = useCallback((key) => {
    setPreset(key);
    const vals = PRESET_MULTIPLIERS[key];
    setMultipliers(() => {
      const next = {};
      phases.forEach(p => {
        if (vals[p.id] !== undefined) {
          next[p.id] = vals[p.id];
        } else {
          const scale = key === "conservative" ? 0.15 : key === "moderate" ? 0.45 : 0.75;
          next[p.id] = Math.round((p.aiMin + (p.aiMax - p.aiMin) * scale) * 10) / 10;
        }
      });
      return next;
    });
  }, [phases]);

  const updateMultiplier = useCallback((id, val) => {
    setPreset(null);
    setMultipliers(prev => ({ ...prev, [id]: val }));
  }, []);

  const addPhase = useCallback((phase) => {
    setPhases(prev => [...prev, phase]);
    setMultipliers(prev => ({ ...prev, [phase.id]: phase.aiDefault }));
    setShowAddModal(false);
  }, []);

  const removePhase = useCallback((id) => {
    setPhases(prev => prev.filter(p => p.id !== id));
    setMultipliers(prev => { const next = { ...prev }; delete next[id]; return next; });
    setConfirmRemove(null);
    if (expandedPhase === id) setExpandedPhase(null);
  }, [expandedPhase]);

  const resetToDefaults = useCallback(() => {
    setPhases(DEFAULT_PHASES);
    const mults = {};
    const vals = PRESET_MULTIPLIERS["moderate"];
    DEFAULT_PHASES.forEach(p => { mults[p.id] = vals[p.id] || p.aiDefault; });
    setMultipliers(mults);
    setPreset("moderate");
  }, []);

  const calculations = useMemo(() => {
    const computed = phases.map(p => {
      const originalDays = (p.defaultPct / 100) * baselineDays;
      const aiDays = originalDays / (multipliers[p.id] || p.aiDefault);
      return { ...p, originalDays, aiDays };
    });
    const totalOriginal = computed.reduce((s, p) => s + p.originalDays, 0);
    const totalAi = computed.reduce((s, p) => s + p.aiDays, 0);
    const overallSpeedup = totalAi > 0 ? totalOriginal / totalAi : 1;
    const timeSaved = totalOriginal - totalAi;
    const codingPhase = phases.find(p => p.id === "coding");
    const codingSpeedup = codingPhase ? (multipliers[codingPhase.id] || codingPhase.aiDefault) : 1;
    const bottleneckPhase = computed.length > 0 ? computed.reduce((max, p) => (p.aiDays / totalAi) > (max.aiDays / totalAi) ? p : max) : computed[0];
    return { phases: computed, totalOriginal, totalAi, overallSpeedup, timeSaved, codingSpeedup, bottleneckPhase };
  }, [baselineDays, multipliers, phases]);

  const tabs = [
    { id: "guide", label: "Guide" },
    { id: "estimator", label: "Timeline Estimator" },
    { id: "factors", label: "Factor Deep-Dive" },
    { id: "cycles", label: "New Dev Cycles" },
    { id: "framework", label: "The Framework" },
  ];

  return (
    <div style={{
      ...(darkMode ? DARK_THEME : LIGHT_THEME),
      "--font-display": "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      "--font-body": "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      "--font-mono": "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      fontFamily: "var(--font-body)", color: "var(--text-primary)", background: "var(--surface-0)",
      minHeight: "100vh", padding: "24px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {showAddModal && <AddPhaseModal onAdd={addPhase} onClose={() => setShowAddModal(false)} />}

      {confirmRemove && (
        <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "var(--surface-1)", borderRadius: 12, padding: "24px 28px", maxWidth: 380, width: "100%", border: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>Remove Phase?</h4>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 18px", lineHeight: 1.5 }}>
              Remove <strong style={{ color: "var(--text-primary)" }}>{phases.find(p => p.id === confirmRemove)?.name}</strong>? You can re-add it later or adjust remaining percentages.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmRemove(null)} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, background: "var(--surface-2)", color: "var(--text-secondary)", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
              <button onClick={() => removePhase(confirmRemove)} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, background: "var(--red)", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-body)" }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Project Management Framework</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", lineHeight: 1.2, letterSpacing: -0.5 }}>AI-Era Timeline Estimation</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "8px 0 0", lineHeight: 1.6, maxWidth: 620 }}>
            Coding 10x faster ≠ shipping 10x faster. Model every phase of your actual dev cycle and see where AI truly moves the needle.
          </p>
          <button
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              position: "absolute", top: 0, right: 0,
              background: "none", border: "none",
              fontSize: 20, cursor: "pointer",
              lineHeight: 1, padding: 0,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24, background: "var(--surface-1)", borderRadius: 8, padding: 3 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              background: tab === t.id ? "var(--surface-2)" : "transparent",
              color: tab === t.id ? "var(--text-primary)" : "var(--text-tertiary)",
              border: "none", borderRadius: 6, cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Phase management bar */}
        {(tab === "estimator" || tab === "factors") && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{phases.length}/{MAX_PHASES} phases</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, fontFamily: "var(--font-mono)",
                color: pctWarning ? "var(--amber)" : "var(--green)",
                background: pctWarning ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)",
              }}>
                {pctWarning ? `⚠ Totals ${totalPct}%` : "✓ 100%"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={resetToDefaults} style={{
                padding: "6px 12px", fontSize: 11, fontWeight: 600, background: "var(--surface-1)", color: "var(--text-tertiary)",
                border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-body)",
              }}>Reset Defaults</button>
              {phases.length < MAX_PHASES && (
                <button onClick={() => setShowAddModal(true)} style={{
                  padding: "6px 12px", fontSize: 11, fontWeight: 600, background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-body)",
                }}>+ Add Phase</button>
              )}
            </div>
          </div>
        )}

        {tab === "guide" && <GuideTab setTab={setTab} />}
        {tab === "estimator" && <EstimatorTab baselineDays={baselineDays} setBaselineDays={setBaselineDays} preset={preset} applyPreset={applyPreset} calculations={calculations} phases={phases} multipliers={multipliers} updateMultiplier={updateMultiplier} setConfirmRemove={setConfirmRemove} setShowAddModal={setShowAddModal} />}
        {tab === "factors" && <FactorsTab phases={phases} multipliers={multipliers} expandedPhase={expandedPhase} setExpandedPhase={setExpandedPhase} setConfirmRemove={setConfirmRemove} setShowAddModal={setShowAddModal} />}
        {tab === "cycles" && <CyclesTab selectedCycle={selectedCycle} setSelectedCycle={setSelectedCycle} />}
        {tab === "framework" && <FrameworkTab />}
      </div>
    </div>
  );
}
