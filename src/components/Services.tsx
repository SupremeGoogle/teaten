"use client";

import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function Services() {
  const { c, tt, L } = useSite();
  const cats = c.services.categories;

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

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
          {cats.map((cat, i) => {
            const shot = (cat.images ?? []).filter(Boolean)[0] ?? "";
            const cheapest = cat.items
              .map((item) => Number(item.price))
              .filter((n) => Number.isFinite(n) && n > 0);
            const from = cheapest.length ? Math.min(...cheapest) : null;

            return (
              <Reveal key={cat.id} delay={(i % 4) * 70} variant="scale">
                <a
                  href={`/services/${cat.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.5rem] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(74,58,46,0.6)] sm:rounded-[1.75rem]"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden">
                    {shot && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={shot}
                        alt={tt(cat.title)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/25 to-transparent"
                      aria-hidden="true"
                    />

                    <span className="absolute inset-x-3.5 bottom-3.5 sm:inset-x-5 sm:bottom-5">
                      <span className="display block text-left text-[1.15rem] leading-tight text-cream sm:text-[1.45rem]">
                        {tt(cat.title)}
                      </span>
                      <span className="mt-1.5 flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-cream/70 sm:text-[0.68rem]">
                        <span>
                          {cat.items.length} {tt(c.services.title)}
                        </span>
                        {from !== null && (
                          <>
                            <span className="h-2.5 w-px bg-cream/30" aria-hidden="true" />
                            <span className="text-gold">
                              {L.from} {L.currency}
                              {from}
                            </span>
                          </>
                        )}
                      </span>
                    </span>

                    <span
                      className="glass-dark absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-cream transition-transform duration-500 group-hover:translate-x-0.5 sm:right-5 sm:top-5 sm:h-9 sm:w-9"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
