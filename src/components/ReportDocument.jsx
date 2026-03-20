import { Document, Page, Text, View, Svg, Rect, Font, StyleSheet } from "@react-pdf/renderer";
import { PRESETS, SPEC_QUALITY_LEVELS, AI_MATURITY_LEVELS } from "../data/presets";

Font.register({
  family: "DM Sans",
  fonts: [
    { src: "/fonts/DMSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/DMSans-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/DMSans-Bold.ttf", fontWeight: 700 },
  ],
});

const blue = "#3B82F6";
const green = "#16A34A";
const red = "#DC2626";
const amber = "#D97706";
const slate50 = "#F8FAFC";
const slate100 = "#F1F5F9";
const slate200 = "#E2E8F0";
const slate400 = "#94A3B8";
const slate500 = "#64748B";
const slate700 = "#334155";
const slate900 = "#0F172A";

const s = StyleSheet.create({
  page: { fontFamily: "DM Sans", fontSize: 9, color: slate900, padding: "32 36", backgroundColor: "#FFFFFF" },
  header: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 700, color: slate900, letterSpacing: -0.3 },
  subtitle: { fontSize: 9, color: slate500, marginTop: 3 },
  tagline: { fontSize: 8, color: blue, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  divider: { height: 1, backgroundColor: slate200, marginVertical: 12 },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: slate700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 },
  metricsRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  metricCard: { flex: 1, backgroundColor: slate50, borderRadius: 6, padding: "10 12", borderLeftWidth: 3 },
  metricLabel: { fontSize: 7, fontWeight: 500, color: slate500, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  metricValue: { fontSize: 22, fontWeight: 700 },
  metricSub: { fontSize: 7, color: slate500, marginTop: 2 },
  settingsRow: { flexDirection: "row", gap: 16, marginBottom: 4 },
  settingItem: { flexDirection: "row", gap: 4, alignItems: "center" },
  settingLabel: { fontSize: 8, color: slate500 },
  settingValue: { fontSize: 8, fontWeight: 700, color: slate900 },
  tableHeader: { flexDirection: "row", backgroundColor: slate100, borderRadius: 4, padding: "6 8", marginBottom: 3 },
  tableHeaderCell: { fontSize: 7, fontWeight: 700, color: slate500, textTransform: "uppercase", letterSpacing: 0.6 },
  tableRow: { flexDirection: "row", padding: "5 8", borderBottomWidth: 0.5, borderBottomColor: slate200 },
  tableCell: { fontSize: 8, color: slate900 },
  tableCellMuted: { fontSize: 8, color: slate500 },
  chartSection: { marginTop: 4 },
  footer: { position: "absolute", bottom: 28, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7, color: slate400 },
});

const colWidths = { name: "32%", weight: "12%", original: "14%", aiAdj: "14%", multiplier: "14%", change: "14%" };

export default function ReportDocument({ calculations, baselineDays, preset, specQuality, aiMaturity }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const presetLabel = PRESETS[preset]?.label || "Custom";
  const specLabel = SPEC_QUALITY_LEVELS[specQuality]?.label || specQuality;
  const maturityLabel = AI_MATURITY_LEVELS[aiMaturity]?.label || aiMaturity;
  const maxOriginalDays = Math.max(...calculations.phases.map(p => p.originalDays));

  const stats = [
    { label: "AI-Adjusted Timeline", value: `${calculations.totalAi.toFixed(0)} days`, sub: `was ${calculations.totalOriginal.toFixed(0)} days`, color: blue },
    { label: "Overall Speedup", value: `${calculations.overallSpeedup.toFixed(2)}x`, sub: `coding alone is ${calculations.codingSpeedup.toFixed(0)}x`, color: green },
    { label: "Days Saved", value: `${calculations.timeSaved.toFixed(0)} days`, sub: `${((calculations.timeSaved / calculations.totalOriginal) * 100).toFixed(0)}% reduction`, color: amber },
    { label: "Bottleneck Phase", value: calculations.bottleneckPhase?.name?.split(" /")[0]?.split(" &")[0] || "—", sub: "largest share of AI timeline", color: red },
  ];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.tagline}>AI-Era Project Estimation</Text>
          <Text style={s.title}>10x Illusion — Timeline Analysis</Text>
          <Text style={s.subtitle}>Generated {dateStr} · Baseline: {baselineDays} days</Text>
        </View>

        <View style={s.divider} />

        {/* Key Metrics */}
        <View style={s.metricsRow}>
          {stats.map((stat, i) => (
            <View key={i} style={[s.metricCard, { borderLeftColor: stat.color }]}>
              <Text style={s.metricLabel}>{stat.label}</Text>
              <Text style={[s.metricValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.metricSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Settings */}
        <View style={s.settingsRow}>
          <View style={s.settingItem}>
            <Text style={s.settingLabel}>Preset:</Text>
            <Text style={s.settingValue}>{presetLabel}</Text>
          </View>
          <View style={s.settingItem}>
            <Text style={s.settingLabel}>Spec Quality:</Text>
            <Text style={s.settingValue}>{specLabel}</Text>
          </View>
          <View style={s.settingItem}>
            <Text style={s.settingLabel}>AI Maturity:</Text>
            <Text style={s.settingValue}>{maturityLabel}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Phase Breakdown Table */}
        <Text style={s.sectionTitle}>Phase Breakdown</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, { width: colWidths.name }]}>Phase</Text>
          <Text style={[s.tableHeaderCell, { width: colWidths.weight, textAlign: "right" }]}>Weight</Text>
          <Text style={[s.tableHeaderCell, { width: colWidths.original, textAlign: "right" }]}>Original</Text>
          <Text style={[s.tableHeaderCell, { width: colWidths.aiAdj, textAlign: "right" }]}>AI-Adjusted</Text>
          <Text style={[s.tableHeaderCell, { width: colWidths.multiplier, textAlign: "right" }]}>Effective</Text>
          <Text style={[s.tableHeaderCell, { width: colWidths.change, textAlign: "right" }]}>Change</Text>
        </View>
        {calculations.phases.map((p, i) => {
          const pctChange = p.effectiveMultiplier >= 1.0
            ? `-${((1 - 1/p.effectiveMultiplier) * 100).toFixed(0)}%`
            : `+${((1/p.effectiveMultiplier - 1) * 100).toFixed(0)}%`;
          const changeColor = p.effectiveMultiplier >= 1.0 ? green : red;
          return (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tableCell, { width: colWidths.name, fontWeight: 500 }]}>{p.name}</Text>
              <Text style={[s.tableCellMuted, { width: colWidths.weight, textAlign: "right" }]}>{p.defaultPct}%</Text>
              <Text style={[s.tableCell, { width: colWidths.original, textAlign: "right" }]}>{p.originalDays.toFixed(1)}d</Text>
              <Text style={[s.tableCell, { width: colWidths.aiAdj, textAlign: "right" }]}>{p.aiDays.toFixed(1)}d</Text>
              <Text style={[s.tableCell, { width: colWidths.multiplier, textAlign: "right" }]}>{p.effectiveMultiplier.toFixed(2)}x</Text>
              <Text style={[s.tableCell, { width: colWidths.change, textAlign: "right", color: changeColor }]}>{pctChange}</Text>
            </View>
          );
        })}

        {/* Totals row */}
        <View style={[s.tableRow, { borderTopWidth: 1, borderTopColor: slate700, borderBottomWidth: 0, marginTop: 2 }]}>
          <Text style={[s.tableCell, { width: colWidths.name, fontWeight: 700 }]}>Total</Text>
          <Text style={[s.tableCellMuted, { width: colWidths.weight, textAlign: "right" }]}>100%</Text>
          <Text style={[s.tableCell, { width: colWidths.original, textAlign: "right", fontWeight: 700 }]}>{calculations.totalOriginal.toFixed(1)}d</Text>
          <Text style={[s.tableCell, { width: colWidths.aiAdj, textAlign: "right", fontWeight: 700 }]}>{calculations.totalAi.toFixed(1)}d</Text>
          <Text style={[s.tableCell, { width: colWidths.multiplier, textAlign: "right", fontWeight: 700 }]}>{calculations.overallSpeedup.toFixed(2)}x</Text>
          <Text style={[s.tableCell, { width: colWidths.change, textAlign: "right", fontWeight: 700, color: green }]}>
            -{((calculations.timeSaved / calculations.totalOriginal) * 100).toFixed(0)}%
          </Text>
        </View>

        <View style={[s.divider, { marginTop: 14 }]} />

        {/* Timeline Comparison Chart */}
        <Text style={s.sectionTitle}>Timeline Comparison</Text>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 10, height: 6, backgroundColor: slate200, borderRadius: 1 }} />
            <Text style={{ fontSize: 7, color: slate500 }}>Original</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 10, height: 6, backgroundColor: blue, borderRadius: 1 }} />
            <Text style={{ fontSize: 7, color: slate500 }}>AI-Adjusted</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 10, height: 6, backgroundColor: red, borderRadius: 1 }} />
            <Text style={{ fontSize: 7, color: slate500 }}>Expanded (slower)</Text>
          </View>
        </View>

        <View style={s.chartSection}>
          {calculations.phases.map((p, i) => {
            const barMax = 340;
            const origW = maxOriginalDays > 0 ? (p.originalDays / maxOriginalDays) * barMax : 0;
            const aiW = maxOriginalDays > 0 ? (p.aiDays / maxOriginalDays) * barMax : 0;
            const isExpanded = p.aiDays > p.originalDays;
            const label = p.name.length > 20 ? p.name.substring(0, 20) + "…" : p.name;
            return (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ width: 110, fontSize: 7, color: slate500, textAlign: "right", paddingRight: 8 }}>{label}</Text>
                <Svg width={barMax + 60} height={22}>
                  <Rect x={0} y={1} width={Math.max(origW, 1)} height={9} rx={2} fill={slate200} />
                  <Rect x={0} y={12} width={Math.max(aiW, 1)} height={9} rx={2} fill={isExpanded ? red : blue} opacity={0.85} />
                  <Text x={Math.max(origW, aiW) + 6} y={15} style={{ fontSize: 7, fontFamily: "DM Sans" }} fill={slate500}>
                    {p.originalDays.toFixed(0)}d → {p.aiDays.toFixed(0)}d
                  </Text>
                </Svg>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>10x Illusion — AI-Era Timeline Estimation</Text>
          <Text style={s.footerText}>Coding 10x faster ≠ shipping 10x faster</Text>
        </View>
      </Page>
    </Document>
  );
}
