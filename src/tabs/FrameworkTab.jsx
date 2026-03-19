export default function FrameworkTab() {
  return (
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
  );
}
