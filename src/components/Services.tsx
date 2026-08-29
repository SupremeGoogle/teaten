"use client";

import { useMemo, useState } from "react";
import AccordionGallery, { type AccordionGalleryItem } from "./AccordionGallery";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Services() {
  const { c, tt, L } = useSite();
  const cats = c.services.categories;
  const [active, setActive] = useState(0);

  const cat = cats[Math.min(active, Math.max(cats.length - 1, 0))];

  const panels = useMemo<AccordionGalleryItem[]>(
    () =>
      cats.map((k) => {
        const images = (k.images ?? []).filter(Boolean);
        return {
          image: images[0] ?? "",
          images: images.length ? images : undefined,
          label: tt(k.title),
          alt: tt(k.title),
        };
      }),
    [cats, tt],
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
          <AccordionGallery
            items={panels}
            defaultIndex={0}
            trigger="hover"
            accentColor="var(--color-gold)"
            overlayColor="var(--color-espresso)"
            textColor="var(--color-cream)"
            height={420}
            gap={12}
            radius={26}
            expandRatio={0.4}
            tilt={6}
            parallax={0.45}
            grayscale={false}
            onActiveChange={setActive}
          />
        </Reveal>

        <Reveal className="mt-6 sm:mt-8">
          <div className="glass-panel rounded-[2rem] p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="display text-2xl text-espresso sm:text-[2rem]">{tt(cat.title)}</h3>
              <span className="eyebrow text-espresso-soft/80">
                {cat.items.length} {tt(c.services.title)}
              </span>
            </div>

            {tt(cat.intro) && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-espresso-soft">
                {tt(cat.intro)}
              </p>
            )}

            <ul key={cat.id} className="mt-6 grid gap-x-12 sm:mt-8 lg:grid-cols-2">
              {cat.items.map((item, i) => {
                const msg = `${L.greeting}\n\n${L.service}: ${tt(item.name)}`;
                return (
                  <li
                    key={item.id}
                    className="rise group border-b border-espresso/12 py-4 last:border-b-0 lg:last:border-b lg:[&:nth-last-child(-n+1)]:border-b-0"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <a
                      href={whatsappLink(c.contact.whatsapp, msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-transform duration-500 group-hover:translate-x-1.5"
                    >
                      <div className="flex items-baseline gap-3">
                        <h4 className="display text-xl text-espresso transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                          {tt(item.name)}
                        </h4>
                        <span
                          className="mb-1.5 hidden flex-1 border-b border-dotted border-espresso/30 transition-colors duration-300 group-hover:border-gold/60 sm:block"
                          aria-hidden="true"
                        />
                        <span className="display shrink-0 text-xl text-espresso transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                          {item.price ? (
                            <>
                              {L.currency}
                              {item.price}
                            </>
                          ) : (
                            <span className="text-[0.7rem] tracking-[0.14em] uppercase text-espresso-soft">
                              {L.onRequest}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {tt(item.description) && (
                          <p className="text-[0.83rem] leading-relaxed text-espresso-soft">
                            {tt(item.description)}
                          </p>
                        )}
                        {item.duration && (
                          <span className="eyebrow shrink-0 text-espresso-soft/70">{item.duration}</span>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
