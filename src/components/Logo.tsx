/** The Tea Ten wordmark: TEA · leaf mark · TEN. `image` overrides it with an uploaded file. */
export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" aria-hidden="true" className={className} fill="currentColor">
      <path d="M64 4C96 34 92 62 54 76 46 50 50 24 64 4Z" />
      <path d="M36 126C4 96 8 68 46 54 54 80 50 106 36 126Z" />
    </svg>
  );
}

export default function Logo({
  name = "Tea Ten",
  image = "",
  className = "",
  size = "md",
}: {
  name?: string;
  image?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} className={`w-auto ${sizes[size].img} ${className}`} />;
  }

  const [first, ...rest] = name.split(" ");
  const second = rest.join(" ") || "";

  return (
    <span
      className={`inline-flex items-center ${sizes[size].gap} ${sizes[size].text} font-display font-normal uppercase leading-none ${className}`}
      style={{ letterSpacing: "0.16em" }}
      aria-label={name}
    >
      <span>{first}</span>
      <LeafMark className={sizes[size].mark} />
      <span className="-ml-[0.16em]">{second}</span>
    </span>
  );
}

const sizes = {
  sm: { text: "text-lg", mark: "h-5", gap: "gap-[0.18em]", img: "h-6" },
  md: { text: "text-2xl", mark: "h-7", gap: "gap-[0.18em]", img: "h-8" },
  lg: { text: "text-4xl sm:text-5xl", mark: "h-12 sm:h-14", gap: "gap-[0.2em]", img: "h-12 sm:h-14" },
} as const;
