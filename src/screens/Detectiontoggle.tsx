function DetectionToggle({
  open,
  onToggle,
  cameraReady,
  faceStress,
}: {
  open: boolean;
  onToggle: () => void;
  cameraReady: boolean;
  faceStress: number;
}) {
  const stressColor =
    faceStress >= 70 ? "#f87171" : faceStress >= 40 ? "#fb923c" : "#34d399";

  const borderColor = open ? "rgba(167,139,250,0.45)" : "rgba(255,255,255,0.1)";

  return (
    <button
      onClick={onToggle}
      title={open ? "Hide live detection" : "Show live detection"}
      style={{
        position: "fixed",
        right: open ? 348 : 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: 28,
        height: 96,
        background: open ? "rgba(124,58,237,0.25)" : "rgba(10,13,26,0.85)",
        backdropFilter: "blur(12px)",
        // Use individual border sides — no shorthand mixed with borderRight
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: `1px solid ${borderColor}`,
        borderRight: "none",
        borderRadius: "10px 0 0 10px",
        cursor: "pointer",
        transition:
          "right 0.22s cubic-bezier(.4,0,.2,1), background 0.2s, border-color 0.2s",
        padding: 0,
      }}
    >
      {/* Status dot */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cameraReady ? stressColor : "#475569",
          display: "inline-block",
          animation: cameraReady ? "blink 2s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      />

      {/* Vertical label */}
      <span
        style={{
          fontSize: 9,
          color: open ? "#c4b5fd" : "#94a3b8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
          transition: "color 0.2s",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Detection
      </span>

      {/* Arrow chevron */}
      <span
        style={{
          fontSize: 10,
          color: open ? "#c4b5fd" : "#64748b",
          transition: "color 0.2s, transform 0.2s",
          transform: open ? "rotate(0deg)" : "rotate(180deg)",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ‹
      </span>
    </button>
  );
}
