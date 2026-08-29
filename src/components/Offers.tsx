"use client";

import { Blob, LeafLine } from "./Decor";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Offers() {
  const { c, tt, L } = useSite();
  if (!c.offers.enabled || !c.offers.items.length) return null;

  return (
    <section id="offers" className="relative overflow-hidden py-24 sm:py-32">
      <Blob className="-left-32 top-10 h-[22rem] w-[22rem]" color="var(--color-taupe)" opacity={0.5} />
      <LeafLine className="right-0 top-10 h-72 w-72 text-espresso-soft/20" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-espresso text-cream shadow-[0_40px_90px_-45px_rgba(74,58,46,0.75)]">
          <div className="grid lg:grid-cols-[1fr_0.9fr]">
            <div className="px-7 py-12 sm:px-12 sm:py-16">
              <Reveal>
                <p className="script text-5xl leading-none text-gold sm:text-6xl">{tt(c.offers.title)}</p>
                <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-cream/75">
                  {tt(c.offers.intro)}
                </p>
              </Reveal>

              <ul className="mt-10 space-y-1">
                {c.offers.items.map((o, i) => {
                  const msg = `${L.greeting}\n\n${L.service}: ${tt(o.name)} (${L.currency}${o.newPrice})`;
                  return (
                    <Reveal as="li" key={o.id} delay={i * 60}>
                      <a
                        href={whatsappLink(c.contact.whatsapp, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline gap-4 border-b border-cream/15 py-4 transition-colors hover:border-gold/60"
                      >
                        <span className="display text-xl leading-snug text-cream sm:text-2xl">
                          {tt(o.name)}
                        </span>
                        <span
                          className="mb-1.5 hidden flex-1 border-b border-dotted border-cream/25 sm:block"
                          aria-hidden="true"
                        />
                        <span className="flex shrink-0 items-baseline gap-2.5">
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
                    </Reveal>
                  );
                })}
              </ul>

              {tt(c.offers.validity) && (
                <p className="eyebrow mt-8 inline-block rounded-full border border-cream/25 px-4 py-2 text-cream/80">
                  {tt(c.offers.validity)}
                </p>
              )}
            </div>

            {c.offers.image && (
              <div className="relative min-h-[16rem] lg:min-h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.offers.image}
                  alt={tt(c.offers.title)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/25 to-transparent lg:from-espresso lg:via-espresso/40"
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
