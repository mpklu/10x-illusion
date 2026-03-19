import { useState, useMemo, useCallback, useEffect } from "react";

const MAX_PHASES = 8;

const ICON_OPTIONS = ["📋","🏗️","⌨️","🔍","🧪","🚀","💬","🐛","📐","🔒","📄","🎨","⚙️","📊","🧩","🤝"];
const CATEGORY_OPTIONS = [
  { id: "think", label: "Think" },
  { id: "build", label: "Build" },
  { id: "verify", label: "Verify" },
  { id: "ship", label: "Ship" },
  { id: "coordinate", label: "Coordinate" },
];

const DARK_THEME = {
  "--accent": "#3B82F6", "--green": "#22C55E", "--red": "#EF4444", "--amber": "#F59E0B",
  "--text-primary": "#E2E8F0", "--text-secondary": "#94A3B8", "--text-tertiary": "#64748B",
  "--surface-0": "#0F172A", "--surface-1": "#1E293B", "--surface-2": "#334155",
  "--border": "#334155", "--overlay": "rgba(0,0,0,0.6)",
};

const LIGHT_THEME = {
  "--accent": "#3B82F6", "--green": "#16A34A", "--red": "#DC2626", "--amber": "#D97706",
  "--text-primary": "#0F172A", "--text-secondary": "#475569", "--text-tertiary": "#94A3B8",
  "--surface-0": "#FFFFFF", "--surface-1": "#F1F5F9", "--surface-2": "#E2E8F0",
  "--border": "#CBD5E1", "--overlay": "rgba(0,0,0,0.3)",
};

const DEFAULT_PHASES = [
  {
    id: "planning", name: "Planning & Requirements", icon: "📋", defaultPct: 12,
    aiMin: 1.0, aiMax: 1.5, aiDefault: 1.2,
    aiNotes: "AI drafts user stories, generates acceptance criteria, summarizes stakeholder input. But priority calls, scope negotiations, and strategic alignment remain human.",
    bottleneck: "Stakeholder availability, decision latency",
    newRisk: "Over-specified requirements that constrain AI implementation flexibility",
    category: "think", isDefault: true,
  },
  {
    id: "design", name: "Architecture & Design", icon: "🏗️", defaultPct: 10,
    aiMin: 1.0, aiMax: 2.0, aiDefault: 1.3,
    aiNotes: "AI suggests patterns, generates diagrams, explores trade-offs. Architects still own decisions on scalability, security posture, and system boundaries.",
    bottleneck: "Architect availability, cross-team alignment",
    newRisk: "AI-suggested architectures that look good on paper but lack operational wisdom",
    category: "think", isDefault: true,
  },
  {
    id: "coding", name: "Implementation / Coding", icon: "⌨️", defaultPct: 30,
    aiMin: 1.5, aiMax: 10.0, aiDefault: 5.0,
    aiNotes: "AI coding agents excel at boilerplate, CRUD, standard patterns, and well-specified modules. Complex business logic, novel algorithms, and system integration see lower gains.",
    bottleneck: "Specification clarity, review capacity",
    newRisk: "Volume of generated code outpaces team's ability to understand it",
    category: "build", isDefault: true,
  },
  {
    id: "review", name: "Code Review & QA", icon: "🔍", defaultPct: 8,
    aiMin: 0.5, aiMax: 2.0, aiDefault: 0.8,
    aiNotes: "AI catches surface bugs and style issues, but MORE code from AI means MORE review work. This phase often EXPANDS. A multiplier below 1.0 means the phase takes longer.",
    bottleneck: "Senior developer time, context-switching cost",
    newRisk: "Review fatigue from high-volume AI output; rubber-stamping risk",
    category: "verify", isDefault: true,
  },
  {
    id: "testing", name: "Testing & QA", icon: "🧪", defaultPct: 18,
    aiMin: 1.5, aiMax: 4.0, aiDefault: 2.5,
    aiNotes: "AI generates unit tests, integration tests, and edge cases well. Test strategy, exploratory testing, and UX validation still need humans.",
    bottleneck: "Test environment stability, edge case coverage",
    newRisk: "AI-generated tests that pass but don't actually validate business requirements",
    category: "verify", isDefault: true,
  },
  {
    id: "deployment", name: "Deployment & DevOps", icon: "🚀", defaultPct: 7,
    aiMin: 1.0, aiMax: 2.5, aiDefault: 1.5,
    aiNotes: "AI writes IaC, CI/CD configs, monitoring rules. Production go/no-go decisions, rollback judgment, and incident response remain human.",
    bottleneck: "Environment availability, compliance gates",
    newRisk: "Auto-generated infrastructure that's hard to debug when things go wrong",
    category: "ship", isDefault: true,
  },
  {
    id: "communication", name: "Meetings & Collaboration", icon: "💬", defaultPct: 10,
    aiMin: 1.0, aiMax: 1.3, aiDefault: 1.1,
    aiNotes: "AI summarizes meetings, drafts updates, generates reports. But the meetings themselves, alignment conversations, and relationship-building are irreducibly human.",
    bottleneck: "Calendar availability, timezone coordination",
    newRisk: "False sense of alignment from AI-generated summaries that miss nuance",
    category: "coordinate", isDefault: true,
  },
  {
    id: "bugfix", name: "Bug Fixing & Iteration", icon: "🐛", defaultPct: 5,
    aiMin: 0.7, aiMax: 3.0, aiDefault: 1.5,
    aiNotes: "AI is decent at fixing known bugs with clear repro steps. But AI-generated code may introduce MORE bugs, partially offsetting gains. Below 1.0 means net increase in bug work.",
    bottleneck: "Bug reproducibility, root cause complexity",
    newRisk: "Subtle bugs in AI-generated code that surface late in production",
    category: "build", isDefault: true,
  },
];

const NEW_CYCLES = [
  {
    id: "spec-first", name: "Spec-First Rapid Iteration", tagline: "Invest upfront, harvest downstream",
    description: "Front-load detailed specifications and acceptance criteria. AI agents then execute implementation in tight, fast loops. Human review gates between each iteration.",
    phases: [
      { name: "Deep Specification", pct: 25, color: "#4A90D9" }, { name: "AI Implementation Sprint", pct: 20, color: "#50C878" },
      { name: "Human Review Gate", pct: 15, color: "#E8A838" }, { name: "AI Test Generation", pct: 10, color: "#9B59B6" },
      { name: "Validation & Deploy", pct: 15, color: "#E74C3C" }, { name: "Retrospective", pct: 15, color: "#7F8C8D" },
    ],
    pros: ["Clear contracts reduce AI hallucination in code", "Review is focused and efficient", "Measurable acceptance criteria"],
    cons: ["Heavy upfront investment", "Less adaptive to changing requirements", "Specification skills become critical bottleneck"],
    bestFor: "Well-understood domains, compliance-heavy projects, teams with strong PMs",
  },
  {
    id: "generate-review", name: "Generate → Review → Refine", tagline: "Let AI draft, humans curate",
    description: "AI generates multiple solution approaches in parallel. Humans evaluate, pick the best direction, then AI refines. Rapid prototyping replaces detailed upfront design.",
    phases: [
      { name: "Problem Framing", pct: 10, color: "#4A90D9" }, { name: "AI Multi-Draft Generation", pct: 15, color: "#50C878" },
      { name: "Human Evaluation & Selection", pct: 20, color: "#E8A838" }, { name: "AI Refinement Sprints", pct: 20, color: "#9B59B6" },
      { name: "Integration & Testing", pct: 20, color: "#E74C3C" }, { name: "Deploy & Monitor", pct: 15, color: "#7F8C8D" },
    ],
    pros: ["Explores solution space faster", "Reduces design phase significantly", "Developers become curators, not typists"],
    cons: ["Requires strong evaluation skills", "Can produce Frankenstein architectures", "Harder to maintain consistency across drafts"],
    bestFor: "Greenfield projects, innovation sprints, experienced teams",
  },
  {
    id: "human-ai-pair", name: "Continuous Human-AI Pairing", tagline: "Always together, never alone",
    description: "Every task is a human-AI pair. Human thinks, AI implements in real-time. Continuous dialogue replaces handoffs. Review is built into the flow, not a separate phase.",
    phases: [
      { name: "Joint Planning", pct: 15, color: "#4A90D9" }, { name: "Paired Implementation", pct: 35, color: "#50C878" },
      { name: "Continuous Testing", pct: 15, color: "#9B59B6" }, { name: "Integration", pct: 15, color: "#E74C3C" },
      { name: "Deploy & Retro", pct: 20, color: "#7F8C8D" },
    ],
    pros: ["Eliminates review bottleneck", "Human context is always in the loop", "Natural quality control"],
    cons: ["Doesn't scale review-free coding", "Developer must stay engaged (no async delegation)", "Pace limited by human thinking speed"],
    bestFor: "Complex domains, small teams, high-stakes systems",
  },
];

const PRESETS = {
  conservative: { label: "Conservative", desc: "Established team, complex domain" },
  moderate: { label: "Moderate", desc: "Experienced team, mixed complexity" },
  aggressive: { label: "Aggressive", desc: "AI-native team, greenfield project" },
};

const PRESET_MULTIPLIERS = {
  conservative: { planning: 1.1, design: 1.1, coding: 2.5, review: 0.7, testing: 1.8, deployment: 1.2, communication: 1.05, bugfix: 1.0 },
  moderate: { planning: 1.2, design: 1.3, coding: 5.0, review: 0.8, testing: 2.5, deployment: 1.5, communication: 1.1, bugfix: 1.5 },
  aggressive: { planning: 1.4, design: 1.8, coding: 8.0, review: 1.2, testing: 3.5, deployment: 2.0, communication: 1.2, bugfix: 2.5 },
};

function SliderControl({ phase, value, onChange }) {
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

function PhaseBar({ phase, originalDays, aiDays, totalOriginal, totalAi }) {
  const origPct = (originalDays / totalOriginal) * 100;
  const aiPct = (aiDays / totalAi) * 100;
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

function CycleCard({ cycle, isSelected, onSelect }) {
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

/* ── Add Phase Modal ── */

function AddPhaseModal({ onAdd, onClose }) {
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

/* ── Main Component ── */

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
    setMultipliers(prev => {
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

        {/* ═══ GUIDE TAB ═══ */}
        {tab === "guide" && (
          <div>
            {/* Hero / Key Message */}
            <div style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "32px 28px", marginBottom: 20, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.04, lineHeight: 1 }}>10×</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)", lineHeight: 1.3 }}>
                Your dev team just got AI coding tools.<br />
                <span style={{ color: "var(--accent)" }}>How much faster will projects actually ship?</span>
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 0", maxWidth: 640 }}>
                The short answer: <strong style={{ color: "var(--text-primary)" }}>much less than you'd think.</strong> AI can write code 5-10x faster, but writing code is only about 30% of what a software project involves. The other 70% — planning, reviewing, testing, deploying, communicating — is still mostly human-speed work.
              </p>
            </div>

            {/* The Analogy */}
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "24px 28px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display)" }}>Think of it like building a house</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>
                Imagine you got a robot that can lay bricks 10x faster. Amazing! But the project still needs architects to draw plans, inspectors to check the work, permits from the city, plumbers and electricians to coordinate, and a final walkthrough before anyone moves in.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>
                Faster bricklaying helps — but the house doesn't get built 10x faster. Maybe <strong style={{ color: "var(--accent)" }}>30-40% faster</strong>. And if the bricklaying robot makes occasional mistakes, the inspectors actually need <em>more</em> time, not less.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                Software development works the same way. This tool helps you figure out the <em>real</em> number.
              </p>
            </div>

            {/* What the numbers say */}
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "24px 28px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display)" }}>What the numbers typically show</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
                {[
                  { label: "What vendors promise", value: "5-10×", sub: "faster coding", color: "var(--text-tertiary)", bg: "var(--surface-2)" },
                  { label: "What projects actually see", value: "1.3-1.8×", sub: "faster delivery", color: "var(--accent)", bg: "rgba(59,130,246,0.1)" },
                  { label: "Why the gap?", value: "70%", sub: "of work isn't coding", color: "var(--amber)", bg: "rgba(245,158,11,0.1)" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px", borderRadius: 10, background: item.bg, textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "var(--font-mono)" }}>{item.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: item.color, fontFamily: "var(--font-mono)" }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                These are typical ranges. Your actual results depend on your team, project type, and how well AI tools are integrated into your workflow — which is exactly what this tool helps you estimate.
              </p>
            </div>

            {/* Some things get slower */}
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "24px 28px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display)" }}>
                <span style={{ color: "var(--red)" }}>Counterintuitively</span> — some things get slower
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>
                When AI writes code faster, it produces <em>more</em> code. That code still needs to be reviewed by your senior developers, tested by QA, and validated against requirements. These downstream phases can actually take <em>longer</em> than before.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { emoji: "⚡", label: "Faster with AI", items: "Writing code, generating tests, creating boilerplate, drafting documentation", color: "var(--green)" },
                  { emoji: "🐌", label: "Same speed or slower", items: "Stakeholder decisions, code review, architecture choices, compliance, team meetings", color: "var(--red)" },
                ].map((col, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 220, padding: "14px 16px", borderRadius: 8, background: "var(--surface-2)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: col.color, marginBottom: 6 }}>{col.emoji} {col.label}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{col.items}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to use this tool */}
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "24px 28px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display)" }}>How to use this tool</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { tab: "Timeline Estimator", icon: "🧮", desc: "Plug in how long a project would take without AI, adjust how much AI helps each phase, and see the realistic new timeline. Try all three presets (Conservative, Moderate, Aggressive) to give stakeholders a range instead of a single guess." },
                  { tab: "Factor Deep-Dive", icon: "🔍", desc: "Explore each phase of the development cycle — how AI helps, what humans still need to do, and what new risks AI introduces. This is where you build informed judgment." },
                  { tab: "New Dev Cycles", icon: "♻️", desc: "Traditional Agile/Scrum was built for human-speed work. Explore three new development models designed around AI's strengths." },
                  { tab: "The Framework", icon: "📐", desc: "The math and principles behind the tool. Includes the formula, five estimation rules, and a matrix showing how team roles are changing." },
                ].map((item, i) => (
                  <div key={i} onClick={() => setTab(item.tab === "Timeline Estimator" ? "estimator" : item.tab === "Factor Deep-Dive" ? "factors" : item.tab === "New Dev Cycles" ? "cycles" : "framework")} style={{
                    display: "flex", gap: 14, padding: "14px 16px", borderRadius: 8, background: "var(--surface-2)",
                    cursor: "pointer", transition: "all 0.15s", border: "1px solid transparent",
                  }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: "var(--text-primary)" }}>{item.tab} →</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who this is for */}
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "24px 28px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display)" }}>Who this is for</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { role: "Executives & Stakeholders", desc: "Understand why \"we have AI now\" doesn't mean 10x faster delivery, and what realistic expectations look like." },
                  { role: "Project Managers", desc: "Build defensible estimates that account for AI's real impact on each phase — not just coding speed." },
                  { role: "Tech Leads & Developers", desc: "Identify where AI shifts bottlenecks, and how team roles need to evolve to capture real gains." },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 8, background: "var(--surface-2)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{item.role}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <button onClick={() => setTab("estimator")} style={{
                padding: "14px 32px", fontSize: 15, fontWeight: 700, background: "var(--accent)", color: "#fff",
                border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-body)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.3)", transition: "all 0.2s",
              }} onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                 onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                Try the Estimator →
              </button>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>No sign-up, no data stored — just adjust the sliders and see your numbers.</div>
            </div>
          </div>
        )}

        {/* ═══ ESTIMATOR TAB ═══ */}
        {tab === "estimator" && (
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
                <PhaseBar key={p.id} phase={p} originalDays={p.originalDays} aiDays={p.aiDays} totalOriginal={calculations.totalOriginal} totalAi={calculations.totalAi} />
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
        )}

        {/* ═══ FACTORS TAB ═══ */}
        {tab === "factors" && (
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
        )}

        {/* ═══ CYCLES TAB ═══ */}
        {tab === "cycles" && (
          <div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
              Traditional Agile/Scrum was designed for human-paced iteration. When AI handles implementation at 5-10x speed, the bottlenecks shift — and the cycle should shift with them.
            </p>
            <div style={{ padding: "12px 16px", background: "var(--surface-1)", borderRadius: 8, marginBottom: 20, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, borderLeft: "3px solid var(--amber)" }}>
              <strong style={{ color: "var(--amber)" }}>Key insight:</strong> In all three models, the ratio of "thinking/reviewing" to "building" time increases dramatically. Developer roles shift from "person who writes code" to "person who specifies, evaluates, and validates."
            </div>
            {NEW_CYCLES.map(c => (
              <CycleCard key={c.id} cycle={c} isSelected={selectedCycle === c.id} onSelect={() => setSelectedCycle(c.id)} />
            ))}
          </div>
        )}

        {/* ═══ FRAMEWORK TAB ═══ */}
        {tab === "framework" && (
          <div>
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-display)" }}>The Amdahl's Law Analogy</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 12px" }}>
                Amdahl's Law: overall speedup is limited by the portion that <em>cannot</em> be accelerated. Even if AI makes coding infinitely fast, the project speedup is capped by non-coding phases.
              </p>
              <div style={{ padding: "14px 18px", background: "var(--surface-2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ color: "var(--text-tertiary)", fontSize: 11, marginBottom: 4 }}>FORMULA</div>
                <div style={{ color: "var(--accent)" }}>Speedup = 1 / [ (1 − p) + p / s ]</div>
                <div style={{ color: "var(--text-tertiary)", fontSize: 12, marginTop: 8 }}>
                  p = fraction of work AI accelerates · s = AI's speedup factor · (1 − p) = irreducible human work
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "12px 0 0" }}>
                With coding at ~30% and AI at 10x speed: Speedup = 1 / [0.70 + 0.30/10] = <strong style={{ color: "var(--accent)" }}>1.37x</strong>. Significant, but far from 10x.
              </p>
            </div>

            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-display)" }}>The Five Estimation Principles</h3>
              {[
                { num: "01", title: "Decompose before you multiply", desc: "Break the project into phases first. Apply AI multipliers per-phase, not as a blanket factor. 'We'll be 3x faster with AI' is almost always wrong." },
                { num: "02", title: "Account for expanding phases", desc: "More AI-generated code → more review, more testing. Some phases get LONGER. Model this with multipliers below 1.0." },
                { num: "03", title: "Specification becomes the bottleneck", desc: "AI is fast but literal. Poor specs → fast garbage. Budget MORE time for requirements — this is the new critical path." },
                { num: "04", title: "Plan for the review funnel", desc: "Senior developers become the bottleneck. They can't review faster just because AI writes faster. Plan review capacity as a hard constraint." },
                { num: "05", title: "Use ranges, not points", desc: "AI impact varies by task type, codebase maturity, and team AI fluency. Always estimate with conservative/moderate/aggressive scenarios." },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 4 ? 16 : 0, paddingBottom: i < 4 ? 16 : 0, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", flexShrink: 0, opacity: 0.5 }}>{p.num}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-display)" }}>How to Use This Framework</h3>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: "var(--text-primary)" }}>Step 1:</strong> Customize phases. Remove what doesn't apply; add what's missing (Security Review, Documentation, etc.). Adjust percentages to sum to 100%.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: "var(--text-primary)" }}>Step 2:</strong> Enter your traditional pre-AI estimate as the baseline.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: "var(--text-primary)" }}>Step 3:</strong> Assess each phase's AI multiplier. Use the Factor Deep-Dive for guidance. Be honest about your team's actual AI fluency.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: "var(--text-primary)" }}>Step 4:</strong> Run all three presets. Present stakeholders with the range, not a single number.</p>
                <p style={{ margin: 0 }}><strong style={{ color: "var(--text-primary)" }}>Step 5:</strong> After each sprint, recalibrate. Your multipliers will converge toward your team's real AI leverage over 2-3 sprints.</p>
              </div>
            </div>

            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "20px 24px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-display)" }}>The Role Shift Matrix</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 14px" }}>AI doesn't just change timelines — it changes what people do.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--border)", borderRadius: 8, overflow: "hidden" }}>
                {["Role", "Before AI", "After AI"].map((h, i) => (
                  <div key={i} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, background: "var(--surface-2)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-mono)" }}>{h}</div>
                ))}
                {[
                  ["Junior Dev", "Write simple code, fix bugs", "Prompt AI, review output, learn patterns"],
                  ["Senior Dev", "Write complex code, mentor", "Architect, review AI output, define specs"],
                  ["Tech Lead", "Design + code + review", "Design + specify + validate + review more"],
                  ["PM", "Gather reqs, track progress", "Write precise specs, manage review bottleneck"],
                  ["QA", "Write tests, manual testing", "Define test strategy, validate AI-generated tests"],
                ].map((row, i) => row.map((cell, j) => (
                  <div key={`${i}-${j}`} style={{
                    padding: "10px 14px", fontSize: 12, background: "var(--surface-1)",
                    color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5,
                  }}>{cell}</div>
                )))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
