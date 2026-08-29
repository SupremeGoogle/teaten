"use client";

import { useRef, useState } from "react";
import { LANGS, type I18nText, type Lang } from "@/lib/types";
import { useUploads } from "./uploads";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-espresso-soft/70">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm text-espresso outline-none transition-colors focus:border-gold";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className={inputCls}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      className={`${inputCls} resize-y leading-relaxed`}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/**
 * A translatable value. English is the source; every other language is optional and
 * falls back to English on the site when left blank.
 */
export function I18nInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  hint,
}: {
  label: string;
  value: I18nText | undefined;
  onChange: (v: I18nText) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const v = value ?? { en: "" };
  const current = v[lang] ?? "";

  const set = (text: string) => onChange({ ...v, [lang]: text } as I18nText);

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
          {label}
        </span>
        <span className="flex gap-1">
          {LANGS.map((l) => {
            const filled = Boolean((v[l.code] ?? "").trim());
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                title={l.label}
                className={`rounded px-1.5 py-0.5 text-[0.62rem] uppercase transition-colors ${
                  l.code === lang
                    ? "bg-espresso text-cream"
                    : filled
                      ? "bg-gold/25 text-espresso"
                      : "bg-espresso/8 text-espresso-soft/70"
                }`}
              >
                {l.code}
              </button>
            );
          })}
        </span>
      </div>
      {multiline ? (
        <TextArea
          value={current}
          rows={rows}
          onChange={set}
          placeholder={lang === "en" ? "" : v.en}
        />
      ) : (
        <TextInput value={current} onChange={set} placeholder={lang === "en" ? "" : v.en} />
      )}
      <span className="mt-1.5 block text-xs text-espresso-soft/70">
        {hint ?? (lang === "en" ? "English is shown when a language is left empty." : `Leave empty to reuse the English text.`)}
      </span>
    </div>
  );
}

/** Picks an image from the device and queues it for the next save. */
export function ImageInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const { addFile, previewFor } = useUploads();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const src = previewFor(value) ?? value;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await addFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-espresso/15 bg-cream-deep">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-wider text-espresso-soft/60">
              none
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-espresso px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50"
            >
              {busy ? "Reading…" : "Choose file"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-espresso/20 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-espresso-soft transition-colors hover:border-espresso/45"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <input
            className={`${inputCls} mt-2 text-xs`}
            value={value ?? ""}
            placeholder="/gallery/example.jpg"
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="mt-1.5 text-xs text-[#a4553f]">{error}</p>}
          {hint && <p className="mt-1.5 text-xs text-espresso-soft/70">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

/** An ordered set of photos — used for the several images behind each service category. */
export function ImageListInput({
  label,
  values,
  onChange,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const list = values ?? [];
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
          {label} ({list.length})
        </span>
        <button
          type="button"
          onClick={() => onChange([...list, ""])}
          className="rounded-full border border-espresso/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-espresso transition-colors hover:border-espresso"
        >
          + Add photo
        </button>
      </div>

      <div className="space-y-3">
        {list.map((src, i) => (
          <div key={i} className="rounded-xl border border-espresso/12 bg-white/70 p-3">
            <ImageInput
              label={`Photo ${i + 1}`}
              value={src}
              onChange={(v) => onChange(list.map((row, j) => (j === i ? v : row)))}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                className="rounded-full border border-espresso/15 px-3 py-1 text-xs text-espresso-soft transition-colors hover:border-espresso/40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                className="rounded-full border border-espresso/15 px-3 py-1 text-xs text-espresso-soft transition-colors hover:border-espresso/40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="rounded-full border border-espresso/15 px-3 py-1 text-xs text-espresso-soft transition-colors hover:border-[#a4553f] hover:text-[#a4553f]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!list.length && (
        <p className="rounded-xl border border-dashed border-espresso/20 px-4 py-5 text-center text-sm text-espresso-soft">
          No photos yet.
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-espresso-soft/70">{hint}</p>}
    </div>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-espresso/15 bg-white p-1"
        />
        <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 text-sm text-espresso"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-espresso" : "bg-espresso/20"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-[1.4rem]" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

/** Add / remove / reorder rows of a list. */
export function ListEditor<T>({
  items,
  onChange,
  create,
  title,
  renderItem,
  labelFor,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  labelFor: (item: T, index: number) => string;
}) {
  const [open, setOpen] = useState<number | null>(items.length ? 0 : null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
    setOpen(to);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-espresso">{title}</h3>
        <button
          type="button"
          onClick={() => {
            onChange([...items, create()]);
            setOpen(items.length);
          }}
          className="rounded-full border border-espresso/20 px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] text-espresso transition-colors hover:border-espresso"
        >
          + Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="overflow-hidden rounded-xl border border-espresso/12 bg-white/60">
            <div className="flex items-center gap-1 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex flex-1 items-center gap-2 text-left text-sm text-espresso"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="truncate">{labelFor(item, i) || `Item ${i + 1}`}</span>
              </button>
              <IconBtn label="Move up" onClick={() => move(i, i - 1)} d="M12 19V5M5 12l7-7 7 7" />
              <IconBtn label="Move down" onClick={() => move(i, i + 1)} d="M12 5v14M19 12l-7 7-7-7" />
              <IconBtn
                label="Delete"
                danger
                onClick={() => {
                  if (!window.confirm("Delete this item?")) return;
                  onChange(items.filter((_, j) => j !== i));
                  setOpen(null);
                }}
                d="M6 6l12 12M18 6L6 18"
              />
            </div>
            {open === i && (
              <div className="space-y-4 border-t border-espresso/10 bg-cream/60 px-4 py-4">
                {renderItem(
                  item,
                  (patch) => onChange(items.map((row, j) => (j === i ? { ...row, ...patch } : row))),
                  i,
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {!items.length && (
        <p className="rounded-xl border border-dashed border-espresso/20 px-4 py-6 text-center text-sm text-espresso-soft">
          Nothing here yet.
        </p>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  d,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  d: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        danger
          ? "text-espresso-soft/70 hover:bg-[#a4553f]/10 hover:text-[#a4553f]"
          : "text-espresso-soft/70 hover:bg-espresso/8 hover:text-espresso"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function uid(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}
