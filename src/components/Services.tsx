"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Services() {
  const { c, tt, L } = useSite();
  const cats = c.services.categories;
  const [active, setActive] = useState(0);
  const cat = cats[Math.min(active, cats.length - 1)];

  if (!cats.length) return null;

  return (
    <section id="services" className="relative bg-cream-deep py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">{c.brand.name}</p>
          <h2 className="display mt-4 text-4xl text-espresso sm:text-6xl">{tt(c.services.title)}</h2>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-espresso-soft">{tt(c.services.intro)}</p>
        </Reveal>

        <div className="no-scrollbar mt-12 -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {cats.map((k, i) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-xs tracking-[0.16em] uppercase transition-colors ${
                i === active
                  ? "border-espresso bg-espresso text-cream"
                  : "border-espresso/20 text-espresso-soft hover:border-espresso/45 hover:text-espresso"
              }`}
            >
              {tt(k.title)}
            </button>
          ))}
        </div>

        <div key={cat.id} className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              {cat.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.image}
                  alt={tt(cat.title)}
                  className="aspect-[3/4] w-full max-w-sm rounded-[2rem] object-cover shadow-[0_24px_50px_-26px_rgba(74,58,46,0.45)]"
                  loading="lazy"
                />
              )}
              {tt(cat.intro) && (
                <p className="mt-6 text-sm leading-relaxed text-espresso-soft">{tt(cat.intro)}</p>
              )}
            </div>
          </Reveal>

          <ul className="divide-y divide-espresso/12">
            {cat.items.map((item, i) => {
              const msg = `${L.greeting}\n\n${L.service}: ${tt(item.name)}`;
              return (
                <Reveal as="li" key={item.id} delay={i * 45} className="group py-6 first:pt-0">
                  <a
                    href={whatsappLink(c.contact.whatsapp, msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-baseline gap-4">
                      <h3 className="display text-2xl text-espresso transition-colors group-hover:text-gold sm:text-[1.7rem]">
                        {tt(item.name)}
                      </h3>
                      <span
                        className="mb-1.5 hidden flex-1 border-b border-dotted border-espresso/30 sm:block"
                        aria-hidden="true"
                      />
                      <span className="display shrink-0 text-2xl text-espresso">
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
