"use client";

import { LeafLine } from "./Decor";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Offers() {
  const { c, tt, L } = useSite();
  if (!c.offers.enabled || !c.offers.items.length) return null;

  return (
    <section id="offers" className="relative overflow-hidden py-16 sm:py-28">
      <LeafLine className="right-0 top-10 h-72 w-72 text-espresso-soft/20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="glass-dark glass-sheen relative overflow-hidden rounded-[2rem] text-cream sm:rounded-[2.5rem]">
          <div className="grid min-w-0 lg:grid-cols-[1fr_0.9fr]">
            <div className="min-w-0 px-5 py-8 sm:px-12 sm:py-16">
              <Reveal>
                <p className="script text-[2.7rem] leading-none text-gold sm:text-6xl">{tt(c.offers.title)}</p>
                <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-cream/75 sm:mt-6 sm:text-[0.98rem]">
                  {tt(c.offers.intro)}
                </p>
              </Reveal>

              <Reveal>
                <ul className="mobile-snap-row no-scrollbar -mx-5 mt-7 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-10 sm:block sm:space-y-1 sm:overflow-visible sm:px-0 sm:pb-0">
                {c.offers.items.map((o, i) => {
                  const msg = `${L.greeting}\n\n${L.service}: ${tt(o.name)} (${L.currency}${o.newPrice})`;
                  return (
                    <li
                      key={o.id}
                      className="rise mobile-snap-item min-w-[78vw] sm:min-w-0"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <a
                        href={whatsappLink(c.contact.whatsapp, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full items-start justify-between gap-4 rounded-[1.4rem] border border-white/15 bg-white/[0.06] p-5 transition-all duration-500 hover:translate-x-1.5 hover:border-gold/60 sm:items-baseline sm:rounded-none sm:border-x-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-4"
                      >
                        <span className="display text-[1.35rem] leading-snug text-cream transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                          {tt(o.name)}
                        </span>
                        <span
                          className="mb-1.5 hidden flex-1 border-b border-dotted border-cream/25 sm:block"
                          aria-hidden="true"
                        />
                        <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-baseline sm:gap-2.5">
                          {o.oldPrice && (
                            <s className="text-sm text-cream/45 decoration-gold/80">
                              {L.currency}
                              {o.oldPrice}
                            </s>
                          )}
                          <span className="display text-2xl text-gold sm:text-3xl">
                            {L.currency}
                            {o.newPrice}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
                </ul>
              </Reveal>

              {tt(c.offers.validity) && (
                <p className="eyebrow glass-dark mt-6 inline-block rounded-full px-4 py-2 text-cream/80 sm:mt-8">
                  {tt(c.offers.validity)}
                </p>
              )}
            </div>

            {c.offers.image && (
              <div className="relative aspect-[16/9] min-h-0 min-w-0 w-full overflow-hidden sm:aspect-auto sm:min-h-[16rem] lg:min-h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.offers.image}
                  alt={tt(c.offers.title)}
                  className="ken-burns absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/75 to-espresso/25"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
