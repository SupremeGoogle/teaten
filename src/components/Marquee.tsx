"use client";

import { useSite } from "./site-context";

export default function Marquee() {
  const { c, tt } = useSite();
  const items = c.marquee.filter((m) => tt(m).trim());
  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-espresso/10 bg-cream-deep py-5">
      <div className="marquee-track flex w-max items-center gap-14 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-14">
            <span className="display text-2xl text-espresso-soft sm:text-3xl">{tt(item)}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
