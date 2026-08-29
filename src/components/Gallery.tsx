"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Masonry, { type MasonryItem } from "./Masonry";
import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function Gallery() {
  const { c, tt, L } = useSite();
  const items = c.gallery.items;
  const [open, setOpen] = useState<number | null>(null);

  const masonryItems = useMemo<MasonryItem[]>(
    // Captions stay out of the grid; the lightbox still shows them.
    () => items.map((g) => ({ id: g.id, img: g.image })),
    [items, tt],
  );

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
    <section id="gallery" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="display text-[2.5rem] text-espresso sm:text-6xl">{tt(c.gallery.title)}</h2>
          <p className="mt-4 text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-5 sm:text-[1.02rem]">{tt(c.gallery.intro)}</p>
        </Reveal>

        <div className="-mx-1.5 mt-8 sm:mt-12">
          <Masonry
            items={masonryItems}
            animateFrom="bottom"
            duration={0.6}
            stagger={0.05}
            scaleOnHover
            hoverScale={0.97}
            blurToFocus
            onItemClick={(_item, index) => setOpen(index)}
          />
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
