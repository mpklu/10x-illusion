export const NEW_CYCLES = [
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
