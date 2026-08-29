"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat up to its value once it scrolls into view. Anything that is not
 * a plain number (or number with a suffix like "10+") is rendered as-is.
 */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(target === null ? target : 0);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    // A stat can sit inside a horizontally scrollable row, where it is clipped
    // out of view and would never intersect. Watch the row itself in that case —
    // it scrolls with the page like anything else.
    let watched: Element = el;
    for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
      if (getComputedStyle(node).overflowX !== "visible") {
        watched = node;
        break;
      }
    }

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(watched);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  if (target === null) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
