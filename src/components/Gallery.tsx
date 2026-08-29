"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function Gallery() {
  const { c, tt, L } = useSite();
  const items = c.gallery.items;
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (step: number) => setOpen((i) => (i === null ? null : (i + step + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  if (!items.length) return null;

  return (
    <section id="gallery" className="relative bg-cream-deep py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="display text-4xl text-espresso sm:text-6xl">{tt(c.gallery.title)}</h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-espresso-soft">{tt(c.gallery.intro)}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((g, i) => (
            <Reveal
              key={g.id}
              delay={(i % 4) * 70}
              className={i % 6 === 0 || i % 6 === 5 ? "lg:row-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt={tt(g.caption)}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    i % 6 === 0 || i % 6 === 5 ? "aspect-[3/4] lg:h-full" : "aspect-square"
                  }`}
                  loading="lazy"
                />
                {tt(g.caption) && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent px-4 pb-3.5 pt-10 text-left text-xs tracking-[0.14em] uppercase text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {tt(g.caption)}
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-espresso/92 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label={L.close}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {items.length > 1 && (
            <>
              <NavButton side="left" onClick={() => move(-1)} />
              <NavButton side="right" onClick={() => move(1)} />
            </>
          )}

          <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[open].image}
              alt={tt(items[open].caption)}
              className="max-h-[78vh] w-auto rounded-xl object-contain"
            />
            {tt(items[open].caption) && (
              <figcaption className="mt-4 text-center text-xs tracking-[0.2em] uppercase text-cream/75">
                {tt(items[open].caption)}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 sm:flex ${
        side === "left" ? "left-5" : "right-5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
