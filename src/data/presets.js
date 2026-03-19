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
