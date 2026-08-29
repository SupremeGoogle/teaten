"use client";

import { useEffect, useRef } from "react";
import PageShell from "./PageShell";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";
import { WhatsAppIcon } from "./icons";
import type { SiteContent } from "@/lib/types";

export default function LocationView({ content }: { content: SiteContent }) {
  return (
    <PageShell content={content} images={[content.location.videoPoster]}>
      <Location />
    </PageShell>
  );
}

function Location() {
  const { c, tt, L } = useSite();
  const loc = c.location;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // React sets `muted` as a property, not an attribute, and browsers check the
  // attribute before allowing autoplay — so set it here and start playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute("muted", "");
    const play = () => v.play().catch(() => {});
    play();
    v.addEventListener("canplay", play);
    return () => v.removeEventListener("canplay", play);
  }, []);

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

        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {loc.video && (
            <Reveal variant="left">
              <div className="mx-auto w-full max-w-[19rem] overflow-hidden rounded-[1.75rem] shadow-[0_30px_70px_-30px_rgba(74,58,46,0.55)] sm:rounded-[2rem] lg:max-w-none">
                <video
                  ref={videoRef}
                  className="aspect-[9/16] h-full w-full object-cover"
                  src={loc.video}
                  poster={loc.videoPoster || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </Reveal>
          )}

          <Reveal variant="right">
            <h1 className="display text-[2.5rem] leading-[1.05] text-espresso sm:text-6xl">
              {tt(loc.title)}
            </h1>
            {tt(loc.intro) && (
              <p className="mt-5 text-[0.98rem] leading-relaxed text-espresso-soft sm:text-[1.05rem]">
                {tt(loc.intro)}
              </p>
            )}

            <dl className="glass-panel mt-7 space-y-5 rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-7">
              <div>
                <dt className="eyebrow text-espresso-soft/70">{L.address}</dt>
                <dd className="mt-1.5 text-lg text-espresso">
                  <a
                    href={c.contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
                  >
                    {tt(c.contact.address)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-espresso-soft/70">{L.openingHours}</dt>
                <dd className="mt-1.5 text-lg text-espresso">{tt(c.contact.hours)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-espresso-soft/70">{L.phones}</dt>
                <dd className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-lg text-espresso">
                  {c.contact.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="transition-colors hover:text-gold">
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
              {c.contact.instagram && (
                <div>
                  <dt className="eyebrow text-espresso-soft/70">Instagram</dt>
                  <dd className="mt-1.5 text-lg">
                    <a
                      href={c.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-espresso underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
                    >
                      @{c.contact.instagram.replace(/\/+$/, "").split("/").pop()}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(c.contact.whatsapp, L.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen inline-flex items-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft sm:text-xs"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {L.bookOnWhatsapp}
              </a>
              <a
                href={c.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass sheen inline-flex items-center rounded-full px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-espresso transition-all duration-300 hover:-translate-y-0.5 sm:text-xs"
              >
                {L.viewOnMap}
              </a>
            </div>
          </Reveal>
        </div>

        {loc.directions.length > 0 && (
          <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4">
            {loc.directions.map((line, i) => (
              <Reveal key={i} delay={(i % 2) * 60}>
                <p className="glass-panel flex h-full items-start gap-3 rounded-[1.25rem] p-4 text-[0.9rem] leading-relaxed text-espresso-soft sm:rounded-[1.5rem] sm:p-5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {tt(line)}
                </p>
              </Reveal>
            ))}
          </div>
        )}

        {c.contact.mapEmbedUrl && (
          <Reveal className="mt-6 sm:mt-8">
            <div className="h-[22rem] overflow-hidden rounded-[1.5rem] border border-espresso/10 sm:h-[28rem] sm:rounded-[2rem]">
              <iframe
                src={c.contact.mapEmbedUrl}
                title={tt(c.contact.address)}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
