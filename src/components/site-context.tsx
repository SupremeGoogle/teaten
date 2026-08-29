"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { t, ui } from "@/lib/i18n";
import { LANGS, type I18nText, type Lang, type SiteContent } from "@/lib/types";

type Ctx = {
  c: SiteContent;
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a content field. */
  tt: (v: I18nText | undefined) => string;
  /** Translate a UI string. */
  L: ReturnType<typeof ui>;
};

const SiteContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "teaten-lang";

export function SiteProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ru") {
      // Migrate the retired Russian option for returning visitors.
      setLangState("sr");
      window.localStorage.setItem(STORAGE_KEY, "sr");
      return;
    }
    if (LANGS.some(({ code }) => code === stored)) {
      setLangState(stored as Lang);
      return;
    }
    // Auto-select the visitor's language only once it has real translations,
    // otherwise a half-translated page would look worse than plain English.
    const guess = navigator.language.slice(0, 2).toLowerCase() as Lang;
    const translated = Boolean(content.hero.title[guess]?.trim());
    if (guess !== "en" && translated) setLangState(guess);
  }, [content]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      c: content,
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          window.localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* private mode — the choice just won't persist */
        }
      },
      tt: (v) => t(v, lang),
      L: ui(lang),
    }),
    [content, lang],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): Ctx {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}

/** Builds the wa.me link that carries a pre-filled booking request. */
export function whatsappLink(number: string, message: string): string {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
