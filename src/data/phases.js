export const MAX_PHASES = 8;

export const ICON_OPTIONS = ["📋","🏗️","⌨️","🔍","🧪","🚀","💬","🐛","📐","🔒","📄","🎨","⚙️","📊","🧩","🤝"];

export const CATEGORY_OPTIONS = [
  { id: "think", label: "Think" },
  { id: "build", label: "Build" },
  { id: "verify", label: "Verify" },
  { id: "ship", label: "Ship" },
  { id: "coordinate", label: "Coordinate" },
];

export const DEFAULT_PHASES = [
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
