export const PRESETS = {
  conservative: { label: "Conservative", desc: "Established team, complex domain" },
  moderate: { label: "Moderate", desc: "Experienced team, mixed complexity" },
  aggressive: { label: "Aggressive", desc: "AI-native team, greenfield project" },
};

export const PRESET_MULTIPLIERS = {
  conservative: { planning: 1.1, design: 1.1, coding: 2.5, review: 0.7, testing: 1.8, deployment: 1.2, communication: 1.05, bugfix: 1.0 },
  moderate: { planning: 1.2, design: 1.3, coding: 5.0, review: 0.8, testing: 2.5, deployment: 1.5, communication: 1.1, bugfix: 1.5 },
  aggressive: { planning: 1.4, design: 1.8, coding: 8.0, review: 1.2, testing: 3.5, deployment: 2.0, communication: 1.2, bugfix: 2.5 },
};

export const SPEC_QUALITY_LEVELS = {
  poor:      { label: "Poor", desc: "Vague or incomplete" },
  good:      { label: "Good", desc: "Baseline — no modifier" },
  excellent: { label: "Excellent", desc: "Clear, testable, scoped" },
};

export const SPEC_QUALITY_FACTORS = {
  poor: {
    planning: 1.0, design: 0.95, coding: 0.55, review: 0.70,
    testing: 0.75, deployment: 1.0, communication: 0.90, bugfix: 0.60,
  },
  good: {
    planning: 1.0, design: 1.0, coding: 1.0, review: 1.0,
    testing: 1.0, deployment: 1.0, communication: 1.0, bugfix: 1.0,
  },
  excellent: {
    planning: 1.0, design: 1.05, coding: 1.20, review: 1.15,
    testing: 1.15, deployment: 1.0, communication: 1.05, bugfix: 1.25,
  },
};

export const SPEC_AFFECTED_PHASES = new Set(["coding", "review", "testing", "bugfix"]);
