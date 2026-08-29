"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "./Logo";

const SESSION_KEY = "teaten-splash";
/** Never hold the page back longer than this, however slow the images are. */
const MAX_WAIT = 4000;
/** Long enough that the screen reads as intentional rather than a flicker. */
const MIN_WAIT = 900;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Holds a cream screen with the logo over the page while the large background
 * photos download, so they do not appear half-drawn. Shown once per browser
 * session — moving between pages afterwards goes straight through.
 */
export default function SplashScreen({
  images = [],
  brandName,
  logo,
}: {
  images?: string[];
  brandName?: string;
  logo?: string;
}) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const skipped = useRef(false);

  // Decide before paint, so a repeat visit never flashes the screen.
  useIsomorphicLayoutEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "done") {
        skipped.current = true;
        setVisible(false);
      }
    } catch {
      /* private mode — just show it */
    }
  }, []);

  useEffect(() => {
    if (skipped.current) return;

    const started = Date.now();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "done");
      } catch {
        /* nothing to do */
      }
      const wait = Math.max(0, MIN_WAIT - (Date.now() - started));
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => setVisible(false), 600);
      }, wait);
    };

    const urls = images.filter(Boolean);
    if (!urls.length) {
      finish();
    } else {
      let left = urls.length;
      const tick = () => {
        left -= 1;
        if (left <= 0) finish();
      };
      urls.forEach((src) => {
        const img = new Image();
        img.onload = tick;
        img.onerror = tick;
        img.src = src;
        if (img.complete) tick();
      });
    }

    const bail = window.setTimeout(finish, MAX_WAIT);
    return () => window.clearTimeout(bail);
  }, [images]);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-cream transition-opacity duration-[600ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="splash-logo text-espresso">
          <Logo name={brandName} image={logo} size="lg" />
        </div>
        <span className="splash-bar" />
      </div>
    </div>
  );
}
