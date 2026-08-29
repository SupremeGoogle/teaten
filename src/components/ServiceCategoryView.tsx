"use client";

import PageShell from "./PageShell";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";
import { WhatsAppIcon } from "./icons";
import type { ServiceCategory, SiteContent } from "@/lib/types";

export default function ServiceCategoryView({
  content,
  categoryId,
}: {
  content: SiteContent;
  categoryId: string;
}) {
  const lead = content.services.categories.find((k) => k.id === categoryId)?.images?.[0];
  return (
    <PageShell content={content} images={lead ? [lead] : []}>
      <CategoryPage categoryId={categoryId} />
    </PageShell>
  );
}

function CategoryPage({ categoryId }: { categoryId: string }) {
  const { c, tt, L } = useSite();
  const cat = c.services.categories.find((k) => k.id === categoryId);
  if (!cat) return null;

  const images = (cat.images ?? []).filter(Boolean);
  const others = c.services.categories.filter((k) => k.id !== cat.id);

  return (
    <div className="relative pt-[92px] pb-16 sm:pt-[124px] sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal>
          <a
            href="/#services"
            className="eyebrow inline-flex items-center gap-2 text-espresso-soft transition-colors hover:text-espresso"
          >
            ← {tt(c.services.title)}
          </a>
        </Reveal>

        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <Reveal variant="left">
            <h1 className="display text-[2.5rem] leading-[1.05] text-espresso sm:text-6xl">
              {tt(cat.title)}
            </h1>
            {tt(cat.intro) && (
              <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-espresso-soft sm:text-[1.05rem]">
                {tt(cat.intro)}
              </p>
            )}
            <a
              href={whatsappLink(c.contact.whatsapp, `${L.greeting}\n\n${tt(cat.title)}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen mt-7 inline-flex items-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft sm:text-xs"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {L.bookOnWhatsapp}
            </a>
          </Reveal>

          {images[0] && (
            <Reveal variant="right">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-[0_28px_60px_-28px_rgba(74,58,46,0.45)] sm:aspect-[5/4] sm:rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0]}
                  alt={tt(cat.title)}
                  className="ken-burns h-full w-full object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* prices */}
        <Reveal className="mt-10 sm:mt-16">
          <div className="glass-panel rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="display text-2xl text-espresso sm:text-[2rem]">{tt(c.services.title)}</h2>
              <span className="eyebrow text-espresso-soft/80">{cat.items.length}</span>
            </div>

            <ul className="mt-5 grid gap-x-12 sm:mt-7 lg:grid-cols-2">
              {cat.items.map((item, i) => (
                <li
                  key={item.id}
                  className="rise group border-b border-espresso/12 py-4 last:border-b-0"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <a
                    href={whatsappLink(
                      c.contact.whatsapp,
                      `${L.greeting}\n\n${L.service}: ${tt(item.name)}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform duration-500 group-hover:translate-x-1.5"
                  >
                    <div className="flex items-baseline gap-3">
                      <h3 className="display text-lg text-espresso transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                        {tt(item.name)}
                      </h3>
                      <span
                        className="mb-1.5 hidden flex-1 border-b border-dotted border-espresso/30 transition-colors duration-300 group-hover:border-gold/60 sm:block"
                        aria-hidden="true"
                      />
                      <span className="display shrink-0 text-lg text-espresso transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                        {item.price ? (
                          <>
                            {L.currency}
                            {item.price}
                          </>
                        ) : (
                          <span className="text-[0.65rem] tracking-[0.14em] uppercase text-espresso-soft">
                            {L.onRequest}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {tt(item.description) && (
                        <p className="text-[0.82rem] leading-relaxed text-espresso-soft">
                          {tt(item.description)}
                        </p>
                      )}
                      {item.duration && (
                        <span className="eyebrow shrink-0 text-espresso-soft/70">{item.duration}</span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* the rest of this category's photos */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
            {images.slice(1).map((src, i) => (
              <Reveal key={src} delay={(i % 4) * 60} variant="scale">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={tt(cat.title)}
                  className="aspect-square w-full rounded-[1.25rem] object-cover"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        )}

        {/* jump to the other categories */}
        {others.length > 0 && (
          <Reveal className="mt-12 sm:mt-16">
            <p className="eyebrow text-espresso-soft/80">{tt(c.services.title)}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {others.map((k) => (
                <a
                  key={k.id}
                  href={`/services/${k.slug}`}
                  className="glass sheen rounded-full px-5 py-2.5 text-[0.68rem] tracking-[0.14em] uppercase text-espresso-soft transition-all duration-300 hover:-translate-y-0.5 hover:text-espresso sm:text-xs"
                >
                  {tt(k.title)}
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export type { ServiceCategory };
