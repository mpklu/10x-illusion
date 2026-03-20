export default function SegmentedControl({ options, value, onChange, accentColor }) {
  const keys = options.map(o => o.key);
  const activeIndex = keys.indexOf(value);
  const activeOption = options[activeIndex] || options[0];
  const color = typeof accentColor === "function" ? accentColor(value) : (accentColor || "var(--accent)");

  return (
    <div>
      <div style={{
        position: "relative", display: "flex",
        background: "var(--surface-1)", borderRadius: 20, padding: 3,
        border: "1px solid var(--border)",
      }}>
        {/* Sliding indicator */}
        <div style={{
          position: "absolute", top: 3, left: 3, bottom: 3,
          width: `calc(${100 / keys.length}% - ${6 / keys.length}px)`,
          borderRadius: 17, background: color,
          transition: "transform 0.25s ease, background 0.25s ease",
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 6 / keys.length}px))`,
        }} />
        {options.map(o => (
          <button key={o.key} onClick={() => onChange(o.key)} style={{
            flex: 1, position: "relative", zIndex: 1,
            padding: "7px 4px", fontSize: 12, fontWeight: 600,
            fontFamily: "var(--font-body)", border: "none", borderRadius: 17,
            background: "transparent", cursor: "pointer",
            color: value === o.key ? "#fff" : "var(--text-tertiary)",
            transition: "color 0.2s",
          }}>
            {o.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 5, minHeight: 16 }}>
        {activeOption.desc}
      </div>
    </div>
  );
}
