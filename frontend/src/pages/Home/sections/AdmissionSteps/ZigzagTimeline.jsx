export default function ZigzagTimeline({
  width = "w-48",
  height = "h-full",
  strokeWidth = 4,
  dashArray = "8 8",
  fromColor = "#b38e19",
  toColor = "#876705",
  className = "",
}) {
  const gradientId = "timelineGradient-" + Math.random().toString(36).slice(2);

  return (
    <>
      <svg
        className={`absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none ${width} ${height} ${className}`}
        viewBox="0 0 200 1200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="
            M100 0
            C40 100,160 200,100 300
            C40 400,160 500,100 600
            C40 700,160 800,100 900
            C40 1000,160 1100,100 1200
          "
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
