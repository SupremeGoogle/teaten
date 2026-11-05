"use client";

import Reveal from "./Reveal";
import { useSite, bookingLink, viberLink } from "./site-context";
import { WhatsAppIcon, ViberIcon } from "./icons";

export default function Booking() {
  const { c, tt, L } = useSite();

  return (
    <section id="booking" className="relative overflow-hidden py-12 sm:py-28">

      <div className="relative mx-auto grid max-w-6xl gap-7 px-4 sm:gap-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <h2 className="display text-[2.5rem] text-espresso sm:text-5xl">{tt(c.booking.title)}</h2>
          <p className="mt-4 max-w-md text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-6 sm:text-[1.02rem]">
            {tt(c.booking.intro)}
          </p>

          {c.booking.image && (
            <div className="mt-10 hidden aspect-[4/3] w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-28px_rgba(74,58,46,0.45)] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.booking.image}
              alt={tt(c.booking.title)}
              className="ken-burns h-full w-full object-cover"
              loading="lazy"
            />
            </div>
          )}
        </Reveal>

        <Reveal delay={80} variant="right">
          <div className="glass-panel glass-sheen relative flex flex-col gap-3 rounded-[1.5rem] p-5 sm:gap-4 sm:rounded-[2rem] sm:p-9">
            <a
              href={bookingLink(c.contact)}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen flex w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-6 py-4 text-[0.68rem] tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft hover:shadow-[0_16px_32px_-16px_rgba(74,58,46,0.7)] sm:px-7 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {L.bookOnWhatsapp}
            </a>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={viberLink(c.contact.whatsapp)}
                className="flex items-center justify-center gap-2.5 rounded-full border border-espresso/20 px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-espresso transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso/5 sm:text-xs"
              >
                <ViberIcon className="h-4 w-4" />
                Viber
              </a>
              <a
                href={`tel:${(c.contact.phones[0] || "").replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2.5 rounded-full border border-espresso/20 px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-espresso transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso/5 sm:text-xs"
              >
                {L.call} · {c.contact.phones[0]}
              </a>
            </div>
            {tt(c.booking.note) && (
              <p className="mt-2 text-center text-xs leading-relaxed text-espresso-soft/80">{tt(c.booking.note)}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
