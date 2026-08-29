"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useSite, whatsappLink } from "./site-context";
import { LANGS } from "@/lib/types";

export default function Header() {
  const { c, tt, L, lang, setLang } = useSite();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const linkTo = (href: string) => (onHome || !href.startsWith("#") ? href : `/${href}`);
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
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-cream/35 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "glass rounded-none border-x-0 border-t-0"
            : "shadow-[0_12px_40px_-32px_rgba(74,58,46,0.5)]"
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-[68px] sm:gap-6 sm:px-8">
          <a href="#top" className="text-espresso transition-opacity hover:opacity-70">
            <Logo name={c.brand.name} image={c.brand.logoImageDark || c.brand.logoImage} size="md" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {c.nav.map((item) => (
              <a
                key={item.id}
                href={linkTo(item.href)}
                className="eyebrow relative text-espresso-soft transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-espresso hover:after:w-full"
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
                className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs tracking-[0.16em] uppercase text-espresso-soft transition-all duration-300 hover:-translate-y-0.5 hover:text-espresso"
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
                  className="glass absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl"
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
              className="sheen hidden rounded-full bg-espresso px-5 py-2.5 text-xs tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft sm:inline-block"
            >
              {L.book}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-espresso lg:hidden"
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
        <div className="absolute inset-0 bg-espresso/35 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div
          className={`glass absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col rounded-none border-y-0 border-r-0 px-6 pt-5 pb-7 transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-7 flex items-center justify-between">
            <Logo name={c.brand.name} image={c.brand.logoImageDark || c.brand.logoImage} size="sm" />
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
                href={linkTo(item.href)}
                onClick={() => setMenuOpen(false)}
                className="display border-b border-white/45 py-3.5 text-[1.75rem] text-espresso transition-all duration-300 hover:translate-x-1.5 hover:text-gold"
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
