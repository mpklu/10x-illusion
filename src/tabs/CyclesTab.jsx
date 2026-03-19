import { NEW_CYCLES } from "../data/cycles";
import CycleCard from "../components/CycleCard";

export default function CyclesTab({ selectedCycle, setSelectedCycle }) {
  return (
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
  );
}
