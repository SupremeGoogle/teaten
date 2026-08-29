"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { useSite, whatsappLink } from "./site-context";

export default function Booking() {
  const { c, tt, L } = useSite();
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  const [error, setError] = useState("");


  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.service) {
      setError(L.required);
      return;
    }
    const lines = [
      L.greeting,
      "",
      `${L.name}: ${form.name.trim()}`,
      `${L.service}: ${form.service}`,
      form.date && `${L.date}: ${form.date}`,
      form.time && `${L.time}: ${form.time}`,
      form.phone && `${L.phone}: ${form.phone.trim()}`,
      form.notes.trim() && `${L.notes} ${form.notes.trim()}`,
      "",
      `— ${L.requestLine}`,
    ].filter(Boolean) as string[];

    window.open(whatsappLink(c.contact.whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="booking" className="relative overflow-hidden py-12 sm:py-28">

      <div className="relative mx-auto grid max-w-6xl gap-7 px-4 sm:gap-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <h2 className="display text-[2.5rem] text-espresso sm:text-5xl">{tt(c.booking.title)}</h2>
          <p className="mt-4 max-w-md text-[0.94rem] leading-relaxed text-espresso-soft sm:mt-6 sm:text-[1.02rem]">
            {tt(c.booking.intro)}
          </p>

          {c.booking.image && (
            <div className="mt-10 hidden aspect-[4/3] w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-28px_rgba(74,58,46,0.45)] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.booking.image}
              alt={tt(c.booking.title)}
              className="ken-burns h-full w-full object-cover"
              loading="lazy"
            />
            </div>
          )}
        </Reveal>

        <Reveal delay={80} variant="right">
          <form
            onSubmit={submit}
            className="glass-panel glass-sheen relative rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-9"
          >
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              <div>
                <label className="label" htmlFor="bk-name">
                  {L.name} *
                </label>
                <input
                  id="bk-name"
                  className="field"
                  value={form.name}
                  onChange={set("name")}
                  placeholder={L.namePlaceholder}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="label" htmlFor="bk-phone">
                  {L.phone}
                </label>
                <input
                  id="bk-phone"
                  className="field"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder={L.phonePlaceholder}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="bk-service">
                  {L.service} *
                </label>
                <select id="bk-service" className="field" value={form.service} onChange={set("service")}>
                  <option value="">{L.chooseService}</option>
                  {c.services.categories.map((cat) => (
                    <optgroup key={cat.id} label={tt(cat.title)}>
                      {cat.items.map((item) => (
                        <option key={item.id} value={tt(item.name)}>
                          {tt(item.name)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  {c.offers.enabled &&
                    c.offers.items.length > 0 && (
                      <optgroup label={tt(c.offers.title)}>
                        {c.offers.items.map((o) => (
                          <option key={o.id} value={`${tt(o.name)} — ${L.currency}${o.newPrice}`}>
                            {tt(o.name)} — {L.currency}
                            {o.newPrice}
                          </option>
                        ))}
                      </optgroup>
                    )}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="bk-date">
                  {L.date}
                </label>
                <input id="bk-date" type="date" className="field" value={form.date} onChange={set("date")} />
              </div>
              <div>
                <label className="label" htmlFor="bk-time">
                  {L.time}
                </label>
                <input id="bk-time" type="time" className="field" value={form.time} onChange={set("time")} />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="bk-notes">
                  {L.notes}
                </label>
                <textarea
                  id="bk-notes"
                  className="field min-h-20 resize-y sm:min-h-24"
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder={L.notesPlaceholder}
                />
              </div>
            </div>

            {error && <p className="mt-5 text-sm text-[#a4553f]">{error}</p>}

            <button
              type="submit"
              className="sheen mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft hover:shadow-[0_16px_32px_-16px_rgba(74,58,46,0.7)] sm:mt-7 sm:px-7 sm:py-4 sm:text-xs sm:tracking-[0.2em]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.65-1.24-1.47-1.38-1.71-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
              </svg>
              {L.send}
            </button>

            {tt(c.booking.note) && (
              <p className="mt-4 text-center text-xs leading-relaxed text-espresso-soft/80">
                {tt(c.booking.note)}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
