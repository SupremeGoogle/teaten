"use client";

import { useSite } from "./site-context";

export default function Hero() {
  const { c, tt, L } = useSite();

  return (
    <section id="top" className="relative isolate min-h-[46rem] overflow-hidden pt-[64px] sm:min-h-[48rem] sm:pt-[68px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.hero.image}
        alt={tt(c.hero.title)}
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[68%_center] sm:object-center"
        loading="eager"
      />
      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(249,239,223,0.1)_0%,rgba(249,239,223,0.25)_42%,rgba(249,239,223,0.96)_100%)] sm:bg-[linear-gradient(90deg,rgba(249,239,223,0.96)_0%,rgba(249,239,223,0.78)_38%,rgba(249,239,223,0.14)_68%,rgba(74,58,46,0.12)_100%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-3 z-0 rounded-[1.7rem] border border-white/45 sm:inset-5 sm:rounded-[2.5rem]" aria-hidden="true" />

      <div className="mx-auto flex min-h-[calc(46rem-64px)] max-w-6xl items-end px-4 pb-7 pt-24 sm:min-h-[calc(48rem-68px)] sm:items-center sm:px-8 sm:py-14">
        <div className="hero-copy glass-panel relative z-10 w-full max-w-[39rem] rounded-[1.75rem] px-5 py-7 sm:rounded-[2.25rem] sm:px-10 sm:py-10 lg:px-12 lg:py-11">
          <div className="rise mb-4 flex items-center gap-3 sm:mb-6" style={{ animationDelay: "80ms" }}>
            <span className="h-px w-8 bg-gold sm:w-12" aria-hidden="true" />
            <p className="eyebrow text-espresso-soft">{tt(c.hero.kicker)}</p>
          </div>

          <h1
            className="display rise max-w-xl text-[3rem] leading-[0.9] text-espresso min-[390px]:text-[3.35rem] sm:text-[4.8rem] lg:text-[5.5rem]"
            style={{ animationDelay: "200ms" }}
          >
            {tt(c.hero.title)}
          </h1>

          <p
            className="rise mt-5 max-w-lg text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-7 sm:text-[1.02rem]"
            style={{ animationDelay: "340ms" }}
          >
            {tt(c.hero.subtitle)}
          </p>

          <div className="rise mt-7 grid gap-2.5 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-3.5" style={{ animationDelay: "460ms" }}>
            <a
              href="#services"
              className="glass sheen inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-espresso transition-all duration-300 hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-xs sm:tracking-[0.2em]"
            >
              {tt(c.hero.secondaryCta)}
            </a>
          </div>

          <div
            className="rise mt-7 grid gap-2 border-t border-espresso/10 pt-5 text-[0.64rem] tracking-[0.12em] uppercase text-espresso-soft sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 sm:text-[0.68rem]"
            style={{ animationDelay: "600ms" }}
          >
            <span>{tt(c.contact.hours)}</span>
            <span className="hidden h-3 w-px bg-espresso/20 sm:block" />
            <span>{c.contact.phones.join(" · ")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
