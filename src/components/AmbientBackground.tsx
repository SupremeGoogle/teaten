"use client";

/**
 * A fixed layer behind the whole page: the brand's organic shapes on cream,
 * slowly and endlessly zooming so the background is never quite still.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream">
      <div className="ambient-zoom absolute inset-[-12%]">
        <div
          className="drift-a absolute left-[-14%] top-[-8%] h-[46vw] w-[46vw] rounded-[46%_54%_52%_48%/40%_38%_62%_60%] blur-[2px]"
          style={{ background: "var(--color-taupe)", opacity: 0.5 }}
        />
        <div
          className="drift-b absolute right-[-16%] top-[6%] h-[52vw] w-[52vw] rounded-[58%_42%_38%_62%/52%_46%_54%_48%] blur-[2px]"
          style={{ background: "var(--color-sage)", opacity: 0.26 }}
        />
        <div
          className="drift-b absolute bottom-[-18%] left-[6%] h-[40vw] w-[40vw] rounded-[42%_58%_60%_40%/46%_56%_44%_54%] blur-[2px]"
          style={{ background: "var(--color-taupe-deep)", opacity: 0.34, animationDelay: "-12s" }}
        />
        <div
          className="drift-a absolute bottom-[4%] right-[4%] h-[30vw] w-[30vw] rounded-[52%_48%_44%_56%/48%_52%_48%_52%] blur-[2px]"
          style={{ background: "var(--color-taupe)", opacity: 0.3, animationDelay: "-20s" }}
        />
      </div>

      {/* a soft vignette keeps text legible over the moving shapes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 20%, transparent 30%, color-mix(in srgb, var(--color-cream) 78%, transparent) 100%)",
        }}
      />
    </div>
  );
}
