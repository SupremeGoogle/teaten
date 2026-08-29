"use client";

import { Blob, LeafLine } from "./Decor";
import { useSite, whatsappLink } from "./site-context";

export default function Hero() {
  const { c, tt, L } = useSite();
  const wa = whatsappLink(c.contact.whatsapp, L.greeting);

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-[68px]">
      <Blob className="-left-40 -top-24 h-[26rem] w-[26rem]" color="var(--color-taupe)" opacity={0.55} />
      <Blob className="-left-16 top-40 h-72 w-72" color="var(--color-sage)" opacity={0.32} />
      <Blob className="-right-32 -top-16 h-[22rem] w-[22rem]" color="var(--color-taupe-deep)" opacity={0.4} />
      <LeafLine className="right-4 top-24 h-56 w-56 text-espresso-soft/25 sm:right-16" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20 lg:pb-28">
        <div className="relative z-10">
          <p className="eyebrow mb-6 text-espresso-soft">{tt(c.hero.kicker)}</p>

          <h1 className="display text-[3.25rem] leading-[0.98] text-espresso sm:text-7xl lg:text-[5.2rem]">
            {tt(c.hero.title)}
          </h1>

          <p className="mt-7 max-w-lg text-[1.02rem] leading-relaxed text-espresso-soft">
            {tt(c.hero.subtitle)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-espresso px-7 py-4 text-xs tracking-[0.2em] uppercase text-cream transition-colors hover:bg-espresso-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.65-1.24-1.47-1.38-1.71-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
              </svg>
              {tt(c.hero.primaryCta)}
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/25 px-7 py-4 text-xs tracking-[0.2em] uppercase text-espresso transition-colors hover:border-espresso hover:bg-espresso/5"
            >
              {tt(c.hero.secondaryCta)}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs tracking-[0.14em] uppercase text-espresso-soft">
            <span>{tt(c.contact.hours)}</span>
            <span className="hidden h-3 w-px bg-espresso/20 sm:block" />
            <span>{c.contact.phones.join(" · ")}</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10">
            <Blob className="inset-0 h-full w-full" color="var(--color-taupe-deep)" opacity={0.45} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.hero.image}
            alt={tt(c.hero.title)}
            className="blob aspect-[4/5] w-full object-cover shadow-[0_30px_70px_-30px_rgba(74,58,46,0.45)]"
            loading="eager"
          />
          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-espresso/10 bg-cream/95 px-6 py-4 backdrop-blur sm:block">
            <p className="script text-3xl leading-none text-gold">Tea Ten</p>
            <p className="eyebrow mt-1.5 text-espresso-soft">{tt(c.brand.tagline)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
