"use client";

import { Blob, LeafLine } from "./Decor";
import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function About() {
  const { c, tt } = useSite();

  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <Blob className="-right-40 top-16 h-[24rem] w-[24rem]" color="var(--color-sage)" opacity={0.25} />
      <LeafLine className="-left-10 bottom-0 h-64 w-64 rotate-[200deg] text-espresso-soft/20" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.about.image}
              alt={tt(c.about.title)}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_28px_60px_-28px_rgba(74,58,46,0.4)]"
              loading="lazy"
            />
            <div className="absolute inset-3 rounded-[1.6rem] border border-cream/40" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={80}>
          <h2 className="display text-4xl text-espresso sm:text-5xl">{tt(c.about.title)}</h2>
          <div className="rule my-8 max-w-24" />

          <div className="space-y-5 text-[1.02rem] leading-relaxed text-espresso-soft">
            {c.about.body.map((p, i) => (
              <p key={i}>{tt(p)}</p>
            ))}
          </div>

          {tt(c.about.signature) && (
            <p className="script mt-9 text-4xl text-gold">{tt(c.about.signature)}</p>
          )}

          {c.about.stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-espresso/10 pt-8">
              {c.about.stats.map((s) => (
                <div key={s.id}>
                  <dt className="display text-4xl text-espresso">{s.value}</dt>
                  <dd className="eyebrow mt-2 text-espresso-soft">{tt(s.label)}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </div>
    </section>
  );
}
