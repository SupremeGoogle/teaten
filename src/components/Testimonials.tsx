"use client";

import Reveal from "./Reveal";
import { useSite } from "./site-context";

export default function Testimonials() {
  const { c, tt } = useSite();
  if (!c.testimonials.enabled || !c.testimonials.items.length) return null;

  return (
    <section className="bg-cream-deep py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="display text-center text-4xl text-espresso sm:text-5xl">
            {tt(c.testimonials.title)}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {c.testimonials.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <figure className="h-full rounded-[1.75rem] border border-espresso/10 bg-cream p-8">
                <div className="flex gap-1 text-gold" aria-label={`${item.rating} / 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill={s < item.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      aria-hidden="true"
                    >
                      <path d="m12 3 2.6 5.6 6 .8-4.4 4.3 1.1 6.2L12 17l-5.3 2.9 1.1-6.2L3.4 9.4l6-.8z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-5 text-[0.98rem] leading-relaxed text-espresso-soft">
                  {tt(item.text)}
                </blockquote>
                <figcaption className="eyebrow mt-6 text-espresso">{item.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
