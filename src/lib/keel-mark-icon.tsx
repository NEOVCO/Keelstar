/** Keel mark for favicon / app icons — matches Header KeelMark, sized to fill the canvas. */
const ACCENT = "#1F3A5F";
const BG = "#FBFAF8";

export function KeelMarkIcon({ size }: { size: number }) {
  const pad = Math.max(1, Math.round(size * 0.03125)); // ~1px at 32, ~6px at 180
  const box = size - pad * 2;
  const radius = Math.round(box * 0.235);
  const border = Math.max(2, Math.round(box * 0.083));
  const bar = Math.max(2, Math.round(box * 0.09));
  const barLength = Math.round(box * 0.62);
  const barOffset = Math.round((box - barLength) / 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BG,
      }}
    >
      <div
        style={{
          width: box,
          height: box,
          border: `${border}px solid ${ACCENT}`,
          borderRadius: radius,
          position: "relative",
          display: "flex",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: barOffset,
            top: "50%",
            width: barLength,
            height: bar,
            marginTop: -bar / 2,
            background: ACCENT,
            borderRadius: bar,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: barOffset,
            width: bar,
            height: barLength,
            marginLeft: -bar / 2,
            background: ACCENT,
            borderRadius: bar,
          }}
        />
      </div>
    </div>
  );
}
