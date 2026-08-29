"use client";

import Logo from "./Logo";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Contact() {
  const { c, tt, L } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Logo name={c.brand.name} image={c.brand.logoImage} size="lg" className="text-cream" />
            {tt(c.footer.note) && (
              <p className="script mt-6 text-4xl text-gold">{tt(c.footer.note)}</p>
            )}

            <dl className="mt-12 space-y-7">
              <div>
                <dt className="eyebrow text-cream/50">{L.openingHours}</dt>
                <dd className="mt-1.5 text-lg text-cream/90">{tt(c.contact.hours)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-cream/50">{L.address}</dt>
                <dd className="mt-1.5 text-lg text-cream/90">
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
                <dt className="eyebrow text-cream/50">{L.phones}</dt>
                <dd className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-lg text-cream/90">
                  {c.contact.phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-gold"
                    >
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
              {c.contact.email && (
                <div>
                  <dt className="eyebrow text-cream/50">Email</dt>
                  <dd className="mt-1.5 text-lg">
                    <a href={`mailto:${c.contact.email}`} className="transition-colors hover:text-gold">
                      {c.contact.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-11 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(c.contact.whatsapp, L.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-cream px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-espresso transition-colors hover:bg-gold hover:text-cream"
              >
                {L.bookOnWhatsapp}
              </a>
              {c.contact.instagram && (
                <SocialLink href={c.contact.instagram} label="Instagram">
                  <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.63.07 4.81s0 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.63.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.56 2.2 15.18 2.2 12s0-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.21 8.82 2.2 12 2.2Zm0 1.8c-3.13 0-3.5.01-4.73.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.43 8.88 3.42 9.25 3.42 12s.01 3.12.07 4.15c.4.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.03.06 1.4.07 4.15.07s3.12-.01 4.15-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.03.07-1.4.07-4.15s-.01-3.12-.07-4.15c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.12 4.01 14.75 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
                </SocialLink>
              )}
              {c.contact.facebook && (
                <SocialLink href={c.contact.facebook} label="Facebook">
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.29-.04-1.27-.12-2.41-.12-2.39 0-4.02 1.46-4.02 4.13V9.9H7.55V13h2.72v8h3.23Z" />
                </SocialLink>
              )}
            </div>
          </Reveal>

          <Reveal delay={80}>
            {c.contact.mapEmbedUrl ? (
              <div className="h-full min-h-[22rem] overflow-hidden rounded-[2rem] border border-cream/15">
                <iframe
                  src={c.contact.mapEmbedUrl}
                  title={tt(c.contact.address)}
                  className="h-full min-h-[22rem] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
            <a
              href={c.contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow mt-5 inline-block text-cream/60 transition-colors hover:text-gold"
            >
              {L.viewOnMap} →
            </a>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cream/15 pt-7 text-xs tracking-[0.14em] uppercase text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {c.footer.credit}. {L.allRights}
          </span>
          <a href="/admin" className="transition-colors hover:text-cream/80">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold hover:text-gold"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
