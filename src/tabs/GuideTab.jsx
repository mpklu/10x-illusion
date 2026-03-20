export default function GuideTab({ setTab }) {
  return (
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
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>
          <strong style={{ color: "var(--text-primary)" }}>Specification quality is a force multiplier.</strong> Poor specs + 10x coding speed = 10x the wrong thing. The Estimator's Spec Quality dial lets you model this — watch how "Poor" specs can cut your effective AI gains nearly in half.
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
            { tab: "Timeline Estimator", icon: "🧮", desc: "Plug in your baseline, choose an AI adoption preset and spec quality level, then adjust per-phase multipliers. Poor specs can negate AI gains; excellent specs amplify them. Try different combinations to give stakeholders a realistic range." },
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
  );
}
