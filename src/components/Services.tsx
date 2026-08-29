"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Services() {
  const { c, tt, L } = useSite();
  const cats = c.services.categories;
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState(0);

  const cat = cats[Math.min(active, cats.length - 1)];
  const images = cat?.images?.filter(Boolean) ?? [];

  // Switching category always starts from that category's first photo.
  useEffect(() => setShot(0), [active]);

  if (!cats.length) return null;

  return (
    <section id="services" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">{c.brand.name}</p>
          <h2 className="display mt-3 text-[2.5rem] text-espresso sm:mt-4 sm:text-6xl">{tt(c.services.title)}</h2>
          <p className="mt-4 text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-6 sm:text-[1.02rem]">{tt(c.services.intro)}</p>
        </Reveal>

        <div className="mobile-snap-row no-scrollbar mt-8 -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-12 sm:px-0">
          {cats.map((k, i) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setActive(i)}
              className={`mobile-snap-item sheen shrink-0 rounded-full px-4 py-2.5 text-[0.68rem] tracking-[0.14em] uppercase transition-all duration-300 sm:px-5 sm:text-xs sm:tracking-[0.16em] ${
                i === active
                  ? "bg-espresso text-cream shadow-[0_12px_26px_-14px_rgba(74,58,46,0.8)]"
                  : "glass text-espresso-soft hover:-translate-y-0.5 hover:text-espresso"
              }`}
            >
              {tt(k.title)}
            </button>
          ))}
        </div>

        <div key={cat.id} className="glass-panel mt-7 grid gap-7 rounded-[2rem] p-4 sm:mt-10 sm:gap-10 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-10">
          <Reveal variant="left">
            <div className="lg:sticky lg:top-28">
              {images.length > 0 && (
                <div className="glass-image relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-[1.5rem] sm:aspect-[3/4] sm:rounded-[2rem]">
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt={tt(cat.title)}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        i === shot ? "scale-100 opacity-100" : "scale-105 opacity-0"
                      }`}
                      loading="lazy"
                    />
                  ))}
                  <div className="glass-sheen absolute inset-0" />
                </div>
              )}

              {images.length > 1 && (
                <div className="mobile-snap-row no-scrollbar mt-3 flex max-w-sm gap-2.5 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`${tt(cat.title)} ${i + 1}`}
                      className={`mobile-snap-item h-14 w-14 shrink-0 overflow-hidden rounded-xl transition-all duration-300 sm:h-16 sm:w-16 ${
                        i === shot
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-cream-deep"
                          : "opacity-60 hover:-translate-y-0.5 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {tt(cat.intro) && (
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-espresso-soft sm:mt-6">{tt(cat.intro)}</p>
              )}
            </div>
          </Reveal>

          <ul className="mobile-snap-row no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:block sm:divide-y sm:divide-espresso/12 sm:overflow-visible sm:px-0 sm:pb-0">
            {cat.items.map((item, i) => {
              const msg = `${L.greeting}\n\n${L.service}: ${tt(item.name)}`;
              return (
                <Reveal as="li" key={item.id} delay={i * 45} variant="right" className="mobile-snap-item glass-card group min-w-[82vw] rounded-[1.5rem] p-5 sm:min-w-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-6 sm:shadow-none sm:first:pt-0">
                  <a
                    href={whatsappLink(c.contact.whatsapp, msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform duration-500 group-hover:translate-x-1.5"
                  >
                    <div className="flex items-start justify-between gap-4 sm:items-baseline">
                      <h3 className="display text-[1.55rem] text-espresso transition-colors duration-300 group-hover:text-gold sm:text-[1.7rem]">
                        {tt(item.name)}
                      </h3>
                      <span
                        className="mb-1.5 hidden flex-1 border-b border-dotted border-espresso/30 transition-colors duration-300 group-hover:border-gold/60 sm:block"
                        aria-hidden="true"
                      />
                      <span className="display shrink-0 text-2xl text-espresso transition-colors duration-300 group-hover:text-gold">
                        {item.price ? (
                          <>
                            {L.currency}
                            {item.price}
                          </>
                        ) : (
                          <span className="text-sm tracking-[0.14em] uppercase text-espresso-soft">
                            {L.onRequest}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      {tt(item.description) && (
                        <p className="max-w-xl text-sm leading-relaxed text-espresso-soft">
                          {tt(item.description)}
                        </p>
                      )}
                      {item.duration && (
                        <span className="eyebrow shrink-0 text-espresso-soft/80">{item.duration}</span>
                      )}
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
