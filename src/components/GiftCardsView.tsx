"use client";

import PageShell from "./PageShell";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";
import { WhatsAppIcon } from "./icons";
import type { SiteContent } from "@/lib/types";

export default function GiftCardsView({ content }: { content: SiteContent }) {
  return (
    <PageShell content={content} images={[content.giftCards.image]}>
      <GiftCards />
    </PageShell>
  );
}

function GiftCards() {
  const { c, tt, L } = useSite();
  const g = c.giftCards;

  return (
    <div className="relative pt-[92px] pb-16 sm:pt-[124px] sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal>
          <a
            href="/"
            className="eyebrow inline-flex items-center gap-2 text-espresso-soft transition-colors hover:text-espresso"
          >
            ← {c.brand.name}
          </a>
        </Reveal>

        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <Reveal variant="left">
            <h1 className="display text-[2.5rem] leading-[1.05] text-espresso sm:text-6xl">
              {tt(g.title)}
            </h1>
            {tt(g.intro) && (
              <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-espresso-soft sm:text-[1.05rem]">
                {tt(g.intro)}
              </p>
            )}
            <a
              href={whatsappLink(c.contact.whatsapp, `${L.greeting}\n\n${tt(g.title)}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen mt-7 inline-flex items-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft sm:text-xs"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {L.bookOnWhatsapp}
            </a>
          </Reveal>

          {g.image && (
            <Reveal variant="right">
              <div className="mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[1.75rem] shadow-[0_28px_60px_-28px_rgba(74,58,46,0.45)] sm:aspect-[5/6] sm:max-w-sm sm:rounded-[2rem] lg:max-w-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt={tt(g.title)}
                  className="ken-burns h-full w-full object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>

        <div className="mt-10 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {g.items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 60} variant="scale">
              <a
                href={whatsappLink(
                  c.contact.whatsapp,
                  `${L.greeting}\n\n${tt(g.title)}: ${tt(item.name)} — ${L.currency}${item.price}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel group flex h-full flex-col justify-between gap-5 rounded-[1.5rem] p-5 transition-all duration-500 hover:-translate-y-1 sm:rounded-[1.75rem] sm:p-6"
              >
                <div>
                  <span className="eyebrow text-gold">{tt(item.badge)}</span>
                  <p className="display mt-2.5 text-[1.15rem] leading-snug text-espresso transition-colors duration-300 group-hover:text-gold sm:text-[1.35rem]">
                    {tt(item.name)}
                  </p>
                </div>
                <p className="display text-3xl text-espresso sm:text-4xl">
                  {L.currency}
                  {item.price}
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        {tt(g.note) && (
          <Reveal className="mt-6 sm:mt-8">
            <p className="glass rounded-2xl px-5 py-4 text-center text-[0.85rem] leading-relaxed text-espresso-soft">
              {tt(g.note)}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
