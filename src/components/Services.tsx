"use client";

import MagicBento, { type BentoCard } from "./MagicBento";
import Reveal from "./Reveal";
import { useMemo } from "react";
import { useSite } from "./site-context";

export default function Services() {
  const { c, tt, L } = useSite();
  const cats = c.services.categories;

  const cards = useMemo<BentoCard[]>(
    () =>
      cats.map((cat) => {
        const prices = cat.items
          .map((item) => Number(item.price))
          .filter((n) => Number.isFinite(n) && n > 0);
        // An explicit entry price wins; otherwise fall back to the cheapest treatment.
        const override = Number(cat.fromPrice);
        const from = Number.isFinite(override) && override > 0
          ? override
          : prices.length
            ? Math.min(...prices)
            : null;
        return {
          id: cat.id,
          href: `/services/${cat.slug}`,
          image: (cat.images ?? []).filter(Boolean)[0],
          label: `${cat.items.length} ${tt(c.services.title)}`,
          title: tt(cat.title),
          description: from !== null ? `${L.from} ${L.currency}${from}` : L.onRequest,
        };
      }),
    [cats, tt, c.services.title, L],
  );

  if (!cats.length) return null;

  return (
    <section id="services" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">{c.brand.name}</p>
          <h2 className="display mt-3 text-[2.5rem] text-espresso sm:mt-4 sm:text-6xl">
            {tt(c.services.title)}
          </h2>
          <p className="mt-4 text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-6 sm:text-[1.02rem]">
            {tt(c.services.intro)}
          </p>
        </Reveal>

        <Reveal className="mt-8 sm:mt-12" variant="scale">
          <MagicBento
            cards={cards}
            glowColor="194, 161, 101"
            spotlightRadius={340}
            particleCount={10}
            enableTilt
            enableMagnetism
            clickEffect
            enableBorderGlow
            textAutoHide
          />
        </Reveal>
      </div>
    </section>
  );
}
