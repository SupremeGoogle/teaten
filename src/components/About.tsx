"use client";

import CountUp from "./CountUp";
import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function About() {
  const { c, tt } = useSite();

  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-28">
      <div className="relative mx-4 min-h-[52rem] max-w-6xl overflow-hidden rounded-[2rem] border border-white/55 shadow-[0_34px_90px_-46px_rgba(74,58,46,0.7)] sm:mx-8 sm:min-h-[47rem] sm:rounded-[2.75rem] lg:mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.about.image}
          alt={tt(c.about.title)}
          className="absolute inset-0 h-full w-full object-cover object-[34%_center] sm:object-center"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(74,58,46,0)_0%,rgba(74,58,46,0.05)_50%,rgba(74,58,46,0.4)_100%)] sm:bg-[linear-gradient(90deg,rgba(74,58,46,0.02)_0%,rgba(74,58,46,0.16)_38%,rgba(74,58,46,0.82)_66%,rgba(74,58,46,0.96)_100%)]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-3 rounded-[1.55rem] border border-white/30 sm:inset-5 sm:rounded-[2.15rem]" aria-hidden="true" />

        <div className="relative flex min-h-[52rem] items-end p-4 sm:min-h-[47rem] sm:items-center sm:justify-end sm:p-10 lg:p-12">
          <Reveal className="about-copy glass-dark w-full rounded-[1.7rem] p-5 text-cream sm:max-w-[34rem] sm:rounded-[2rem] sm:p-9" delay={80} variant="right">
          <p className="eyebrow text-gold">{c.brand.name}</p>
          <h2 className="display mt-3 text-[2.35rem] text-cream sm:text-5xl">{tt(c.about.title)}</h2>
          <div className="my-5 h-px w-20 bg-gradient-to-r from-gold/80 to-transparent sm:my-7" />

          <div className="space-y-4 text-[0.9rem] leading-relaxed text-cream/75 sm:space-y-5 sm:text-[0.98rem]">
            {c.about.body.map((p, i) => (
              <p key={i}>{tt(p)}</p>
            ))}
          </div>

          {tt(c.about.signature) && (
            <p className="script mt-6 text-3xl text-gold sm:mt-8 sm:text-4xl">{tt(c.about.signature)}</p>
          )}

          {c.about.stats.length > 0 && (
            <dl className="mt-7 grid grid-cols-3 gap-2 sm:mt-9 sm:gap-3">
              {c.about.stats.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/15 bg-white/[0.07] px-2.5 py-3.5 backdrop-blur-md sm:p-4">
                  <dt className="display text-3xl text-cream sm:text-4xl">
                    <CountUp value={s.value} />
                  </dt>
                  <dd className="eyebrow mt-2 text-cream/55">{tt(s.label)}</dd>
                </div>
              ))}
            </dl>
          )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
