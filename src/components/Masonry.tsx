"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import "./Masonry.css";

export type MasonryItem = {
  id: string;
  img: string;
  /** Optional caption shown on hover. */
  caption?: string;
  /** Layout height in px. Left out, it is measured from the image itself. */
  height?: number;
};

type AnimateFrom = "top" | "bottom" | "left" | "right" | "center" | "random";

/** `useLayoutEffect` warns during SSR; the layout only matters in the browser anyway. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = useCallback(() => {
    if (typeof window === "undefined") return defaultValue;
    const index = queries.findIndex((q) => window.matchMedia(q).matches);
    return values[index] ?? defaultValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handler = () => setValue(get());
    handler();
    const lists = queries.map((q) => window.matchMedia(q));
    lists.forEach((l) => l.addEventListener("change", handler));
    return () => lists.forEach((l) => l.removeEventListener("change", handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get]);

  return value;
};

const useMeasure = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
};

/** Loads every image and reports its aspect ratio, so tiles keep their real proportions. */
const preloadImages = (urls: string[]) =>
  Promise.all(
    urls.map(
      (src) =>
        new Promise<[string, number]>((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve([src, img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1]);
          img.onerror = () => resolve([src, 1]);
          img.src = src;
        }),
    ),
  );

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
}: {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: AnimateFrom;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: MasonryItem, index: number) => void;
}) {
  const columns = useMedia(
    // 340px keeps two columns on every phone; one column made the section endless.
    ["(min-width:1500px)", "(min-width:1000px)", "(min-width:600px)", "(min-width:340px)"],
    [4, 4, 3, 2],
    1,
  );

  const [containerRef, width] = useMeasure();
  const [ratios, setRatios] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    preloadImages(items.map((i) => i.img)).then((pairs) => {
      if (!cancelled) setRatios(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const imagesReady = ratios !== null;

  const { grid, totalHeight } = useMemo(() => {
    if (!width || !ratios) return { grid: [] as (MasonryItem & { x: number; y: number; w: number; h: number })[], totalHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const grid = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const y = colHeights[col];
      // Real aspect ratio wins; `height` is only a fallback for items we could not load.
      const ratio = ratios[child.img] || 1;
      const h = child.height ? child.height / 2 : columnWidth / ratio;

      colHeights[col] += h;
      return { ...child, x, y, w: columnWidth, h };
    });

    return { grid, totalHeight: Math.max(...colHeights, 0) };
  }, [columns, items, width, ratios]);

  const hasMounted = useRef(false);

  const getInitialPosition = useCallback(
    (item: { x: number; y: number; w: number; h: number }) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: item.x, y: item.y };

      let direction = animateFrom;
      if (animateFrom === "random") {
        const directions: AnimateFrom[] = ["top", "bottom", "left", "right"];
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      switch (direction) {
        case "top":
          return { x: item.x, y: -200 };
        case "bottom":
          return { x: item.x, y: window.innerHeight + 200 };
        case "left":
          return { x: -200, y: item.y };
        case "right":
          return { x: window.innerWidth + 200, y: item.y };
        case "center":
          return { x: rect.width / 2 - item.w / 2, y: rect.height / 2 - item.h / 2 };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef],
  );

  useIsomorphicLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      grid.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;
        const layout = { x: item.x, y: item.y, width: item.w, height: item.h };

        if (!hasMounted.current && !reduced) {
          const from = getInitialPosition(item);
          gsap.fromTo(
            selector,
            {
              opacity: 0,
              x: from.x,
              y: from.y,
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: "blur(10px)" }),
            },
            {
              opacity: 1,
              ...layout,
              ...(blurToFocus && { filter: "blur(0px)" }),
              duration: 0.8,
              ease: "power3.out",
              delay: index * stagger,
            },
          );
        } else {
          gsap.to(selector, {
            opacity: 1,
            ...layout,
            duration: reduced ? 0 : duration,
            ease,
            overwrite: "auto",
          });
        }
      });
    }, root);

    hasMounted.current = true;
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const setHoverState = (item: MasonryItem, element: HTMLElement, entering: boolean) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${item.id}"]`, {
        scale: entering ? hoverScale : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: entering ? 0.3 : 0, duration: 0.3 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ height: totalHeight ? `${totalHeight}px` : undefined }}
    >
      {grid.map((item, index) => (
        <div
          key={item.id}
          data-key={item.id}
          className="masonry-item"
          role="button"
          tabIndex={0}
          aria-label={item.caption || undefined}
          style={{ opacity: imagesReady ? undefined : 0 }}
          onClick={() => onItemClick?.(item, index)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemClick?.(item, index);
            }
          }}
          onMouseEnter={(e) => setHoverState(item, e.currentTarget, true)}
          onMouseLeave={(e) => setHoverState(item, e.currentTarget, false)}
        >
          <div className="masonry-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && (
              <div
                className="color-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, color-mix(in srgb, var(--color-gold) 60%, transparent), color-mix(in srgb, var(--color-taupe) 60%, transparent))",
                  opacity: 0,
                  pointerEvents: "none",
                  borderRadius: "inherit",
                }}
              />
            )}
            {item.caption && <span className="masonry-caption glass-dark">{item.caption}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
