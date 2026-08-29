"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import "./MagicBento.css";

export type BentoCard = {
  id: string;
  title: string;
  description?: string;
  label?: string;
  image?: string;
  href?: string;
};

export type MagicBentoProps = {
  cards: BentoCard[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  /** RGB triplet without the rgb() wrapper, e.g. "194, 161, 101". */
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
};

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 320;
const DEFAULT_GLOW_COLOR = "194, 161, 101";
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string) => {
  const el = document.createElement("span");
  el.className = "bento-particle";
  el.style.cssText = `
    position:absolute;width:4px;height:4px;border-radius:50%;
    background:rgba(${color},1);box-shadow:0 0 8px rgba(${color},0.7);
    pointer-events:none;z-index:4;left:${x}px;top:${y}px;`;
  return el;
};

const spotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/** A card that sprays particles, tilts and ripples under the cursor. */
function ParticleCard({
  card,
  className,
  glowColor,
  particleCount,
  disableAnimations,
  enableTilt,
  enableMagnetism,
  clickEffect,
  textAutoHide,
}: {
  card: BentoCard;
  className: string;
  glowColor: string;
  particleCount: number;
  disableAnimations: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  textAutoHide: boolean;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const spawned = useRef<HTMLElement[]>([]);
  const timers = useRef<number[]>([]);
  const hovered = useRef(false);
  const templates = useRef<HTMLElement[]>([]);
  const magnetism = useRef<gsap.core.Tween | null>(null);

  const clearParticles = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    magnetism.current?.kill();
    spawned.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    spawned.current = [];
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || disableAnimations) return;

    const spawn = () => {
      if (!hovered.current) return;
      if (!templates.current.length) {
        const { width, height } = el.getBoundingClientRect();
        templates.current = Array.from({ length: particleCount }, () =>
          createParticleElement(Math.random() * width, Math.random() * height, glowColor),
        );
      }
      templates.current.forEach((particle, i) => {
        const id = window.setTimeout(() => {
          if (!hovered.current) return;
          const clone = particle.cloneNode(true) as HTMLElement;
          el.appendChild(clone);
          spawned.current.push(clone);
          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
          );
          gsap.to(clone, {
            x: (Math.random() - 0.5) * 90,
            y: (Math.random() - 0.5) * 90,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
        }, i * 100);
        timers.current.push(id);
      });
    };

    const onEnter = () => {
      hovered.current = true;
      spawn();
      if (enableTilt) {
        gsap.to(el, { rotateX: 4, rotateY: 4, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
      }
    };

    const onLeave = () => {
      hovered.current = false;
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -7,
          rotateY: ((x - cx) / cx) * 7,
          duration: 0.15,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetism.current = gsap.to(el, {
          x: (x - cx) * 0.04,
          y: (y - cy) * 0.04,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const max = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;width:${max * 2}px;height:${max * 2}px;border-radius:50%;
        background:radial-gradient(circle, rgba(${glowColor},0.45) 0%, rgba(${glowColor},0.2) 30%, transparent 70%);
        left:${x - max}px;top:${y - max}px;pointer-events:none;z-index:5;`;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() },
      );
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    return () => {
      hovered.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearParticles();
    };
  }, [clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, particleCount]);

  return (
    <a
      ref={ref}
      href={card.href}
      className={`${className} bento-particle-host`}
      style={{ ["--glow-color" as string]: glowColor }}
      aria-label={card.title}
    >
      <CardInner card={card} textAutoHide={textAutoHide} />
    </a>
  );
}

function CardInner({ card, textAutoHide }: { card: BentoCard; textAutoHide: boolean }) {
  return (
    <>
      {card.image && (
        <span className="bento-card__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.image} alt="" loading="lazy" />
        </span>
      )}
      <span className="bento-card__scrim" aria-hidden="true" />

      <span className="bento-card__header">
        <span className="bento-card__label">{card.label}</span>
        <span className="bento-card__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>

      <span className="bento-card__content">
        <h3 className="bento-card__title">{card.title}</h3>
        {card.description && (
          <p
            className="bento-card__description"
            style={textAutoHide ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" } : undefined}
          >
            {card.description}
          </p>
        )}
      </span>
    </>
  );
}

/** One soft light that follows the cursor across the whole grid. */
function GlobalSpotlight({
  gridRef,
  enabled,
  disableAnimations,
  spotlightRadius,
  glowColor,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  disableAnimations: boolean;
  spotlightRadius: number;
  glowColor: string;
}) {
  useEffect(() => {
    if (!enabled || disableAnimations || !gridRef.current) return;

    const spotlight = document.createElement("div");
    spotlight.className = "bento-spotlight";
    spotlight.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;
      background:radial-gradient(circle,
        rgba(${glowColor},0.16) 0%, rgba(${glowColor},0.08) 18%,
        rgba(${glowColor},0.03) 40%, transparent 70%);
      z-index:5;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);

    const onMove = (e: MouseEvent) => {
      const grid = gridRef.current;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = grid.querySelectorAll<HTMLElement>(".bento-card");

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }

      const { proximity, fadeDistance } = spotlightValues(spotlightRadius);
      let nearest = Infinity;

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const distance = Math.max(
          0,
          Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) -
            Math.max(r.width, r.height) / 2,
        );
        nearest = Math.min(nearest, distance);

        let intensity = 0;
        if (distance <= proximity) intensity = 1;
        else if (distance <= fadeDistance) intensity = (fadeDistance - distance) / (fadeDistance - proximity);

        card.style.setProperty("--glow-x", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--glow-y", `${((e.clientY - r.top) / r.height) * 100}%`);
        card.style.setProperty("--glow-intensity", String(intensity));
        card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
      });

      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const opacity =
        nearest <= proximity
          ? 0.8
          : nearest <= fadeDistance
            ? ((fadeDistance - nearest) / (fadeDistance - proximity)) * 0.8
            : 0;
      gsap.to(spotlight, { opacity, duration: opacity > 0 ? 0.2 : 0.5, ease: "power2.out" });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>(".bento-card").forEach((c) =>
        c.style.setProperty("--glow-intensity", "0"),
      );
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotlight.parentNode?.removeChild(spotlight);
    };
  }, [gridRef, enabled, disableAnimations, spotlightRadius, glowColor]);

  return null;
}

export default function MagicBento({
  cards,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobile();
  const off = disableAnimations || isMobile;

  const className = `bento-card${enableBorderGlow ? " bento-card--border-glow" : ""}`;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          enabled={enableSpotlight}
          disableAnimations={off}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div ref={gridRef} className="bento-grid bento-section">
        {cards.map((card) =>
          enableStars && !off ? (
            <ParticleCard
              key={card.id}
              card={card}
              className={className}
              glowColor={glowColor}
              particleCount={particleCount}
              disableAnimations={off}
              enableTilt={enableTilt}
              enableMagnetism={enableMagnetism}
              clickEffect={clickEffect}
              textAutoHide={textAutoHide}
            />
          ) : (
            <a
              key={card.id}
              href={card.href}
              className={className}
              style={{ ["--glow-color" as string]: glowColor }}
              aria-label={card.title}
            >
              <CardInner card={card} textAutoHide={textAutoHide} />
            </a>
          ),
        )}
      </div>
    </>
  );
}
