"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useSite, whatsappLink } from "./site-context";
import { LANGS } from "@/lib/types";

export default function Header() {
  const { c, tt, L, lang, setLang } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const wa = whatsappLink(c.contact.whatsapp, L.greeting);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-cream/92 shadow-[0_1px_0_rgba(122,102,83,0.14)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#top" className="text-espresso transition-opacity hover:opacity-70">
            <Logo name={c.brand.name} image={c.brand.logoImage} size="md" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {c.nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="eyebrow text-espresso-soft transition-colors hover:text-espresso"
              >
                {tt(item.label)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                onBlur={() => window.setTimeout(() => setLangOpen(false), 160)}
                className="flex items-center gap-1.5 rounded-full border border-espresso/15 px-3 py-1.5 text-xs tracking-[0.16em] uppercase text-espresso-soft transition-colors hover:border-espresso/35 hover:text-espresso"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={L.language}
              >
                <span aria-hidden="true">{current.flag}</span>
                <span>{current.code}</span>
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-espresso/10 bg-cream shadow-lg shadow-espresso/10"
                >
                  {LANGS.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={l.code === lang}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-taupe/35 ${
                          l.code === lang ? "text-espresso" : "text-espresso-soft"
                        }`}
                      >
                        <span aria-hidden="true">{l.flag}</span>
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-espresso px-5 py-2.5 text-xs tracking-[0.18em] uppercase text-cream transition-colors hover:bg-espresso-soft sm:inline-block"
            >
              {L.book}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-espresso lg:hidden"
              aria-label={L.menu}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-espresso/35" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-cream px-7 pt-6 pb-10 transition-transform duration-400 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <Logo name={c.brand.name} image={c.brand.logoImage} size="sm" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={L.close}
              className="flex h-9 w-9 items-center justify-center text-espresso-soft"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {c.nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="display border-b border-espresso/10 py-4 text-3xl text-espresso"
              >
                {tt(item.label)}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-espresso px-6 py-3.5 text-center text-xs tracking-[0.18em] uppercase text-cream"
            >
              {L.bookOnWhatsapp}
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                    l.code === lang
                      ? "border-espresso bg-espresso text-cream"
                      : "border-espresso/20 text-espresso-soft"
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
