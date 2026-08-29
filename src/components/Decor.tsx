/** Soft organic shapes and line-art leaves lifted from the printed Tea Ten stationery. */

export function Blob({
  className = "",
  color = "var(--color-taupe)",
  opacity = 0.5,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`blob pointer-events-none absolute ${className}`}
      style={{ background: color, opacity }}
    />
  );
}

export function LeafLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M172 24c-16 62-52 108-104 138" />
      <path d="M172 24c-44-6-82 10-108 46-24 34-30 74-16 110 40-4 74-24 96-56 22-32 30-68 28-100z" />
      <path d="M150 44c-30 0-56 12-74 34M136 74c-24 4-44 18-56 38M126 108c-18 6-32 18-40 34" />
    </svg>
  );
}

/** Wavy top edge used to separate cream sections without a hard line. */
export function WaveDivider({ flip = false, color = "var(--color-cream)" }: { flip?: boolean; color?: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-[60px] w-full ${flip ? "rotate-180" : ""}`}
    >
      <path
        d="M0 48c180-40 360-40 540-8s360 48 540 16 300-40 360-48v72H0z"
        fill={color}
      />
    </svg>
  );
}
