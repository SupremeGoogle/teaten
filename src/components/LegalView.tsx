"use client";

import PageShell from "./PageShell";
import Reveal from "./Reveal";
import { useSite } from "./site-context";
import type { SiteContent } from "@/lib/types";

export default function LegalView({ content }: { content: SiteContent }) {
  return (
    <PageShell content={content}>
      <Policy />
    </PageShell>
  );
}

function Policy() {
  const { c, tt } = useSite();
  const legal = c.legal;

  return (
    <article className="relative pt-[104px] pb-16 sm:pt-[136px] sm:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <Reveal>
          <a
            href="/"
            className="eyebrow inline-flex items-center gap-2 text-espresso-soft transition-colors hover:text-espresso"
          >
            ← {c.brand.name}
          </a>
          <h1 className="display mt-5 text-[2.5rem] leading-[1.05] text-espresso sm:text-6xl">
            {tt(legal.title)}
          </h1>
          {tt(legal.updated) && (
            <p className="eyebrow mt-4 text-espresso-soft/80">{tt(legal.updated)}</p>
          )}
          {tt(legal.intro) && (
            <p className="mt-6 text-[0.98rem] leading-relaxed text-espresso-soft sm:text-[1.05rem]">
              {tt(legal.intro)}
            </p>
          )}
        </Reveal>

        <div className="mt-10 space-y-4 sm:mt-14 sm:space-y-5">
          {legal.sections.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 4) * 50}>
              <section className="glass-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8">
                <h2 className="display text-xl text-espresso sm:text-2xl">{tt(s.heading)}</h2>
                <div className="mt-3 space-y-3 text-[0.92rem] leading-relaxed text-espresso-soft sm:text-[0.98rem]">
                  {s.body.map((para, j) => (
                    <p key={j}>{tt(para)}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
