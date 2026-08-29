"use client";

import { useEffect, useState } from "react";

/** Thin gold line across the top showing how far down the page you are. */
export default function ScrollProgress() {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRatio(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-px">
      <div
        className="progress-bar h-full bg-gradient-to-r from-gold/0 via-gold to-gold/0"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );
}
