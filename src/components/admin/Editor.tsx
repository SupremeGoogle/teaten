"use client";

import { useEffect, useMemo, useState } from "react";
import Logo from "../Logo";
import { applyTranslations, collectMissing } from "@/lib/i18n-fields";
import { LANGS, type Lang, type SiteContent } from "@/lib/types";
import {
  ColorInput,
  Field,
  I18nInput,
  ImageInput,
  ImageListInput,
  ListEditor,
  TextArea,
  TextInput,
  Toggle,
  uid,
} from "./fields";
import { useUploads } from "./uploads";

type SectionId =
  | "brand"
  | "contact"
  | "nav"
  | "hero"
  | "about"
  | "services"
  | "offers"
  | "gallery"
  | "testimonials"
  | "booking"
  | "giftcards"
  | "location"
  | "footer"
  | "legal";

const SECTIONS: { id: SectionId; label: string; note: string }[] = [
  { id: "brand", label: "Brand & colours", note: "Name, logo, palette, page title" },
  { id: "contact", label: "Contact", note: "Phones, WhatsApp, address, hours" },
  { id: "nav", label: "Navigation", note: "Menu links" },
  { id: "hero", label: "Hero", note: "First screen and the moving strip" },
  { id: "about", label: "About", note: "Story, photo, numbers" },
  { id: "services", label: "Services", note: "Categories, treatments, prices" },
  { id: "offers", label: "Offers", note: "Discounted treatments" },
  { id: "gallery", label: "Gallery", note: "Photos" },
  { id: "testimonials", label: "Reviews", note: "Client quotes" },
  { id: "booking", label: "Booking", note: "Form texts" },
  { id: "giftcards", label: "Gift cards", note: "Packages and prices" },
  { id: "location", label: "Location", note: "Video, address, directions" },
  { id: "footer", label: "Footer", note: "Closing line" },
  { id: "legal", label: "Privacy page", note: "Personal data policy" },
];

const TARGET_LANGS: Lang[] = LANGS.map((l) => l.code).filter((l) => l !== "en");

export default function Editor({
  draft,
  setDraft,
  baseline,
  setBaseline,
  onReload,
}: {
  draft: SiteContent;
  setDraft: (c: SiteContent) => void;
  baseline: SiteContent;
  setBaseline: (c: SiteContent) => void;
  onReload: () => void;
}) {
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [section, setSection] = useState<SectionId>("brand");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const { pending, clearPending, pendingBytes } = useUploads();

  const set = useMemo(
    () =>
      <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
        setDraft({ ...draft, [key]: value });
        setDirty(true);
        setMessage(null);
      },
    [draft, setDraft],
  );

  useEffect(() => {
    if (!dirty && !pending.length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending.length]);

  /**
   * Fills Albanian and Russian from the English source. Only fields whose English
   * changed, or whose translation is empty, are sent — a translation typed by hand
   * survives as long as its English text stays the same.
   */
  const runTranslation = async (content: SiteContent): Promise<SiteContent> => {
    const entries = collectMissing(content, baseline, TARGET_LANGS);
    if (!entries.length) return content;

    setTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Translation is a convenience: never let it block a save.
        setMessage({ kind: "err", text: `Translation skipped — ${data.error || res.status}` });
        return content;
      }
      return applyTranslations(content, data.translations || {});
    } catch (e) {
      setMessage({
        kind: "err",
        text: `Translation skipped — ${e instanceof Error ? e.message : "network error"}`,
      });
      return content;
    } finally {
      setTranslating(false);
    }
  };

  const translateNow = async () => {
    const translated = await runTranslation(draft);
    if (translated !== draft) {
      setDraft(translated);
      setDirty(true);
      setMessage({ kind: "ok", text: "Albanian and Russian filled in from the English text." });
    } else {
      setMessage({ kind: "ok", text: "Nothing new to translate." });
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = autoTranslate ? await runTranslation(draft) : draft;
      if (payload !== draft) setDraft(payload);

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload, uploads: pending }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error || `Save failed (${res.status})` });
        return;
      }
      clearPending();
      setDirty(false);
      // What we just published becomes the yardstick for the next round of changes.
      setBaseline(structuredClone(payload));
      setMessage({
        kind: "ok",
        text: "Saved. The changes appear on the site in about a minute.",
      });
    } catch (e) {
      setMessage({ kind: "err", text: e instanceof Error ? e.message : "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream text-espresso">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-espresso/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-espresso/15 lg:hidden"
            aria-label="Sections"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <Logo name={draft.brand.name} image={draft.brand.logoImageDark || draft.brand.logoImage} size="sm" />
          <span className="hidden text-[0.65rem] uppercase tracking-[0.18em] text-espresso-soft sm:inline">
            Admin
          </span>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-espresso/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-espresso-soft transition-colors hover:border-espresso hover:text-espresso sm:inline-block"
            >
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-espresso/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-espresso-soft transition-colors hover:border-espresso hover:text-espresso"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || translating || (!dirty && !pending.length)}
              className="rounded-full bg-espresso px-5 py-2 text-xs uppercase tracking-[0.14em] text-cream transition-colors hover:bg-espresso-soft disabled:opacity-40"
            >
              {translating ? "Translating…" : saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        {(message || pending.length > 0) && (
          <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
            {message && (
              <p
                className={`rounded-lg px-3.5 py-2.5 text-sm ${
                  message.kind === "ok"
                    ? "bg-[#e6efe3] text-[#3f6b46]"
                    : "bg-[#f6e3de] text-[#a4553f]"
                }`}
              >
                {message.text}
              </p>
            )}
            {pending.length > 0 && (
              <p className="mt-2 text-xs text-espresso-soft">
                {pending.length} new image{pending.length > 1 ? "s" : ""} waiting (
                {Math.round((pendingBytes * 0.75) / 1024)} KB) — they upload when you publish.
              </p>
            )}
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        {/* section list */}
        <nav
          className={`${
            navOpen ? "block" : "hidden"
          } fixed inset-x-4 top-20 z-20 rounded-xl border border-espresso/12 bg-cream p-2 shadow-xl lg:static lg:block lg:w-56 lg:shrink-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSection(s.id);
                    setNavOpen(false);
                    window.scrollTo({ top: 0 });
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                    section === s.id ? "bg-espresso text-cream" : "text-espresso hover:bg-espresso/8"
                  }`}
                >
                  <span className="block text-sm">{s.label}</span>
                  <span
                    className={`block text-[0.68rem] ${
                      section === s.id ? "text-cream/60" : "text-espresso-soft/70"
                    }`}
                  >
                    {s.note}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-espresso/12 bg-white/60 px-3 py-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-espresso-soft">
              Translation
            </p>
            <label className="mt-2 flex cursor-pointer items-start gap-2 text-[0.72rem] leading-snug text-espresso">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="mt-0.5 accent-[color:var(--color-espresso)]"
              />
              <span>Fill Albanian and Russian automatically when publishing</span>
            </label>
            <button
              type="button"
              onClick={translateNow}
              disabled={translating || saving}
              className="mt-2.5 w-full rounded-full border border-espresso/20 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.12em] text-espresso transition-colors hover:border-espresso disabled:opacity-50"
            >
              {translating ? "Translating…" : "Translate now"}
            </button>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-espresso-soft/70">
              Only English that you changed is re-translated. Anything you wrote yourself
              in Albanian or Russian stays untouched.
            </p>
          </div>

          <p className="mt-4 px-3 text-[0.68rem] leading-relaxed text-espresso-soft/70">
            <button type="button" onClick={onReload} className="underline">
              Reload the latest version
            </button>
          </p>
          </div>
        </nav>

        <main className="min-w-0 flex-1 space-y-8 pb-24">
          {section === "brand" && <BrandSection draft={draft} set={set} />}
          {section === "contact" && <ContactSection draft={draft} set={set} />}
          {section === "nav" && <NavSection draft={draft} set={set} />}
          {section === "hero" && <HeroSection draft={draft} set={set} />}
          {section === "about" && <AboutSection draft={draft} set={set} />}
          {section === "services" && <ServicesSection draft={draft} set={set} />}
          {section === "offers" && <OffersSection draft={draft} set={set} />}
          {section === "gallery" && <GallerySection draft={draft} set={set} />}
          {section === "testimonials" && <TestimonialsSection draft={draft} set={set} />}
          {section === "booking" && <BookingSection draft={draft} set={set} />}
          {section === "giftcards" && <GiftCardsSection draft={draft} set={set} />}
          {section === "location" && <LocationSection draft={draft} set={set} />}
          {section === "footer" && <FooterSection draft={draft} set={set} />}
          {section === "legal" && <LegalSectionEditor draft={draft} set={set} />}
        </main>
      </div>
    </div>
  );
}

type SetFn = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
type Props = { draft: SiteContent; set: SetFn };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-espresso/12 bg-white/55 p-5 sm:p-7">
      <h2 className="mb-5 text-lg font-medium">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function BrandSection({ draft, set }: Props) {
  const b = draft.brand;
  return (
    <>
      <Card title="Brand">
        <Field label="Salon name">
          <TextInput value={b.name} onChange={(v) => set("brand", { ...b, name: v })} />
        </Field>
        <I18nInput
          label="Tagline"
          value={b.tagline}
          onChange={(v) => set("brand", { ...b, tagline: v })}
        />
        <ImageInput
          label="Logo — white version"
          value={b.logoImage}
          onChange={(v) => set("brand", { ...b, logoImage: v })}
          hint="Used on the dark footer. Transparent PNG. Empty = built-in TEA·TEN wordmark."
        />
        <ImageInput
          label="Logo — dark version"
          value={b.logoImageDark}
          onChange={(v) => set("brand", { ...b, logoImageDark: v })}
          hint="Used on the cream header. Falls back to the white version."
        />
        <ImageInput
          label="Favicon"
          value={b.favicon}
          onChange={(v) => set("brand", { ...b, favicon: v })}
          hint="Small square icon shown in the browser tab."
        />
      </Card>

      <Card title="Colours">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["cream", "Background"],
              ["creamDeep", "Alternate background"],
              ["taupe", "Soft shapes"],
              ["sage", "Green shapes"],
              ["espresso", "Text & dark blocks"],
              ["espressoSoft", "Secondary text"],
              ["gold", "Accent"],
            ] as const
          ).map(([key, label]) => (
            <ColorInput
              key={key}
              label={label}
              value={draft.theme[key]}
              onChange={(v) => set("theme", { ...draft.theme, [key]: v })}
            />
          ))}
        </div>
      </Card>

      <Card title="Search engines & sharing">
        <I18nInput
          label="Page title"
          value={draft.seo.title}
          onChange={(v) => set("seo", { ...draft.seo, title: v })}
        />
        <I18nInput
          label="Description"
          value={draft.seo.description}
          onChange={(v) => set("seo", { ...draft.seo, description: v })}
          multiline
        />
        <ImageInput
          label="Sharing image"
          value={draft.seo.ogImage}
          onChange={(v) => set("seo", { ...draft.seo, ogImage: v })}
          hint="Shown when the link is posted on WhatsApp or Facebook."
        />
      </Card>
    </>
  );
}

function ContactSection({ draft, set }: Props) {
  const c = draft.contact;
  return (
    <Card title="Contact details">
      <Field label="Phone numbers" hint="One per line — each becomes a tap-to-call link.">
        <TextArea
          rows={3}
          value={c.phones.join("\n")}
          onChange={(v) =>
            set("contact", { ...c, phones: v.split("\n").map((s) => s.trim()).filter(Boolean) })
          }
        />
      </Field>
      <Field
        label="WhatsApp number"
        hint="International format, digits only. Kosovo 044 158 234 becomes 38344158234."
      >
        <TextInput value={c.whatsapp} onChange={(v) => set("contact", { ...c, whatsapp: v })} />
      </Field>
      <I18nInput label="Address" value={c.address} onChange={(v) => set("contact", { ...c, address: v })} />
      <Field label="Google Maps link">
        <TextInput value={c.mapUrl} onChange={(v) => set("contact", { ...c, mapUrl: v })} />
      </Field>
      <Field label="Map embed link" hint="The map shown in the footer. Leave empty to hide it.">
        <TextInput value={c.mapEmbedUrl} onChange={(v) => set("contact", { ...c, mapEmbedUrl: v })} />
      </Field>
      <I18nInput label="Opening hours" value={c.hours} onChange={(v) => set("contact", { ...c, hours: v })} />
      <Field label="Email">
        <TextInput value={c.email} onChange={(v) => set("contact", { ...c, email: v })} />
      </Field>
      <Field label="Instagram link">
        <TextInput value={c.instagram} onChange={(v) => set("contact", { ...c, instagram: v })} />
      </Field>
      <Field label="Facebook link">
        <TextInput value={c.facebook} onChange={(v) => set("contact", { ...c, facebook: v })} />
      </Field>
    </Card>
  );
}

function NavSection({ draft, set }: Props) {
  return (
    <Card title="Menu">
      <ListEditor
        title="Links"
        items={draft.nav}
        onChange={(v) => set("nav", v)}
        create={() => ({ id: uid("n"), label: { en: "New link" }, href: "#about" })}
        labelFor={(item) => item.label.en}
        renderItem={(item, update) => (
          <>
            <I18nInput label="Label" value={item.label} onChange={(v) => update({ label: v })} />
            <Field label="Target" hint="#about, #services, #offers, #gallery, #booking or #contact">
              <TextInput value={item.href} onChange={(v) => update({ href: v })} />
            </Field>
          </>
        )}
      />
    </Card>
  );
}

function HeroSection({ draft, set }: Props) {
  const h = draft.hero;
  return (
    <>
      <Card title="First screen">
        <ImageInput label="Photo" value={h.image} onChange={(v) => set("hero", { ...h, image: v })} />
        <I18nInput label="Small line above the title" value={h.kicker} onChange={(v) => set("hero", { ...h, kicker: v })} />
        <I18nInput label="Title" value={h.title} onChange={(v) => set("hero", { ...h, title: v })} />
        <I18nInput label="Subtitle" value={h.subtitle} onChange={(v) => set("hero", { ...h, subtitle: v })} multiline />
        <div className="grid gap-4 sm:grid-cols-2">
          <I18nInput label="Main button" value={h.primaryCta} onChange={(v) => set("hero", { ...h, primaryCta: v })} />
          <I18nInput label="Second button" value={h.secondaryCta} onChange={(v) => set("hero", { ...h, secondaryCta: v })} />
        </div>
      </Card>

      <Card title="Moving strip">
        <ListEditor
          title="Words"
          items={draft.marquee}
          onChange={(v) => set("marquee", v)}
          create={() => ({ en: "New word" })}
          labelFor={(item) => item.en}
          renderItem={(item, update) => (
            <I18nInput label="Text" value={item} onChange={(v) => update(v)} />
          )}
        />
      </Card>
    </>
  );
}

function AboutSection({ draft, set }: Props) {
  const a = draft.about;
  return (
    <>
      <Card title="About">
        <I18nInput label="Title" value={a.title} onChange={(v) => set("about", { ...a, title: v })} />
        <ImageInput label="Photo" value={a.image} onChange={(v) => set("about", { ...a, image: v })} />
        <I18nInput
          label="Handwritten line"
          value={a.signature}
          onChange={(v) => set("about", { ...a, signature: v })}
        />
      </Card>

      <Card title="Text">
        <ListEditor
          title="Paragraphs"
          items={a.body}
          onChange={(v) => set("about", { ...a, body: v })}
          create={() => ({ en: "" })}
          labelFor={(item, i) => item.en.slice(0, 60) || `Paragraph ${i + 1}`}
          renderItem={(item, update) => (
            <I18nInput label="Paragraph" value={item} onChange={(v) => update(v)} multiline rows={5} />
          )}
        />
      </Card>

      <Card title="Numbers">
        <ListEditor
          title="Stats"
          items={a.stats}
          onChange={(v) => set("about", { ...a, stats: v })}
          create={() => ({ id: uid("s"), value: "0", label: { en: "Label" } })}
          labelFor={(item) => `${item.value} — ${item.label.en}`}
          renderItem={(item, update) => (
            <>
              <Field label="Value">
                <TextInput value={item.value} onChange={(v) => update({ value: v })} />
              </Field>
              <I18nInput label="Label" value={item.label} onChange={(v) => update({ label: v })} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function ServicesSection({ draft, set }: Props) {
  const s = draft.services;
  return (
    <>
      <Card title="Services intro">
        <I18nInput label="Title" value={s.title} onChange={(v) => set("services", { ...s, title: v })} />
        <I18nInput label="Intro" value={s.intro} onChange={(v) => set("services", { ...s, intro: v })} multiline />
      </Card>

      <Card title="Categories">
        <ListEditor
          title="Categories"
          items={s.categories}
          onChange={(v) => set("services", { ...s, categories: v })}
          create={() => ({
            id: uid("c"),
            slug: `category-${uid("")}`,
            title: { en: "New category" },
            intro: { en: "" },
            images: [],
            items: [],
          })}
          labelFor={(cat) => `${cat.title.en} (${cat.items.length})`}
          renderItem={(cat, update) => (
            <>
              <I18nInput label="Category name" value={cat.title} onChange={(v) => update({ title: v })} />
              <Field
                label="Page address"
                hint={`This category's own price page: /services/${cat.slug || "…"}. Lower-case letters and dashes only — changing it breaks old links.`}
              >
                <TextInput
                  value={cat.slug}
                  onChange={(v) =>
                    update({ slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") })
                  }
                />
              </Field>
              <I18nInput label="Short intro" value={cat.intro} onChange={(v) => update({ intro: v })} multiline />
              <ImageListInput
                label="Photos"
                values={cat.images}
                onChange={(images) => update({ images })}
                hint="The first photo opens large; the rest appear as thumbnails visitors can click."
              />
              <div className="rounded-xl border border-espresso/12 bg-white/70 p-4">
                <ListEditor
                  title="Treatments"
                  items={cat.items}
                  onChange={(items) => update({ items })}
                  create={() => ({
                    id: uid("i"),
                    name: { en: "New treatment" },
                    description: { en: "" },
                    price: "",
                    duration: "",
                  })}
                  labelFor={(item) => `${item.name.en}${item.price ? ` — €${item.price}` : ""}`}
                  renderItem={(item, updateItem) => (
                    <>
                      <I18nInput label="Name" value={item.name} onChange={(v) => updateItem({ name: v })} />
                      <I18nInput
                        label="Description"
                        value={item.description}
                        onChange={(v) => updateItem({ description: v })}
                        multiline
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Price in €" hint="Leave empty to show “On request”.">
                          <TextInput value={item.price} onChange={(v) => updateItem({ price: v })} />
                        </Field>
                        <Field label="Duration">
                          <TextInput
                            value={item.duration}
                            onChange={(v) => updateItem({ duration: v })}
                            placeholder="60 min"
                          />
                        </Field>
                      </div>
                    </>
                  )}
                />
              </div>
            </>
          )}
        />
      </Card>
    </>
  );
}

function OffersSection({ draft, set }: Props) {
  const o = draft.offers;
  return (
    <>
      <Card title="Offers block">
        <Toggle
          label="Show the offers section on the site"
          value={o.enabled}
          onChange={(v) => set("offers", { ...o, enabled: v })}
        />
        <I18nInput label="Title" value={o.title} onChange={(v) => set("offers", { ...o, title: v })} />
        <I18nInput label="Intro" value={o.intro} onChange={(v) => set("offers", { ...o, intro: v })} multiline />
        <I18nInput
          label="Validity"
          value={o.validity}
          onChange={(v) => set("offers", { ...o, validity: v })}
          hint="For example: Valid 26 August – 3 September"
        />
        <ImageInput label="Photo" value={o.image} onChange={(v) => set("offers", { ...o, image: v })} />
      </Card>

      <Card title="Discounted treatments">
        <ListEditor
          title="Offers"
          items={o.items}
          onChange={(v) => set("offers", { ...o, items: v })}
          create={() => ({ id: uid("o"), name: { en: "New offer" }, oldPrice: "", newPrice: "" })}
          labelFor={(item) => `${item.name.en} — €${item.newPrice}`}
          renderItem={(item, update) => (
            <>
              <I18nInput label="Treatment" value={item.name} onChange={(v) => update({ name: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Old price in €">
                  <TextInput value={item.oldPrice} onChange={(v) => update({ oldPrice: v })} />
                </Field>
                <Field label="New price in €">
                  <TextInput value={item.newPrice} onChange={(v) => update({ newPrice: v })} />
                </Field>
              </div>
            </>
          )}
        />
      </Card>
    </>
  );
}

function GallerySection({ draft, set }: Props) {
  const g = draft.gallery;
  return (
    <>
      <Card title="Gallery intro">
        <I18nInput label="Title" value={g.title} onChange={(v) => set("gallery", { ...g, title: v })} />
        <I18nInput label="Intro" value={g.intro} onChange={(v) => set("gallery", { ...g, intro: v })} multiline />
      </Card>

      <Card title="Photos">
        <ListEditor
          title="Photos"
          items={g.items}
          onChange={(v) => set("gallery", { ...g, items: v })}
          create={() => ({ id: uid("g"), image: "", caption: { en: "" } })}
          labelFor={(item, i) => item.caption.en || `Photo ${i + 1}`}
          renderItem={(item, update) => (
            <>
              <ImageInput label="Photo" value={item.image} onChange={(v) => update({ image: v })} />
              <I18nInput label="Caption" value={item.caption} onChange={(v) => update({ caption: v })} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function TestimonialsSection({ draft, set }: Props) {
  const r = draft.testimonials;
  return (
    <Card title="Reviews">
      <Toggle
        label="Show reviews on the site"
        value={r.enabled}
        onChange={(v) => set("testimonials", { ...r, enabled: v })}
      />
      <I18nInput label="Title" value={r.title} onChange={(v) => set("testimonials", { ...r, title: v })} />
      <ListEditor
        title="Quotes"
        items={r.items}
        onChange={(v) => set("testimonials", { ...r, items: v })}
        create={() => ({ id: uid("t"), name: "", text: { en: "" }, rating: 5 })}
        labelFor={(item, i) => item.name || `Review ${i + 1}`}
        renderItem={(item, update) => (
          <>
            <Field label="Client name">
              <TextInput value={item.name} onChange={(v) => update({ name: v })} />
            </Field>
            <I18nInput label="Text" value={item.text} onChange={(v) => update({ text: v })} multiline />
            <Field label="Stars (1–5)">
              <TextInput
                type="number"
                value={String(item.rating)}
                onChange={(v) => update({ rating: Math.max(1, Math.min(5, Number(v) || 5)) })}
              />
            </Field>
          </>
        )}
      />
    </Card>
  );
}

function BookingSection({ draft, set }: Props) {
  const b = draft.booking;
  return (
    <Card title="Booking form">
      <I18nInput label="Title" value={b.title} onChange={(v) => set("booking", { ...b, title: v })} />
      <I18nInput label="Intro" value={b.intro} onChange={(v) => set("booking", { ...b, intro: v })} multiline />
      <ImageInput label="Photo" value={b.image} onChange={(v) => set("booking", { ...b, image: v })} />
      <I18nInput label="Small note under the button" value={b.note} onChange={(v) => set("booking", { ...b, note: v })} />
    </Card>
  );
}

function GiftCardsSection({ draft, set }: Props) {
  const g = draft.giftCards;
  return (
    <>
      <Card title="Gift cards page">
        <Toggle
          label="Show the gift cards page"
          value={g.enabled}
          onChange={(v) => set("giftCards", { ...g, enabled: v })}
        />
        <I18nInput label="Menu label" value={g.linkLabel} onChange={(v) => set("giftCards", { ...g, linkLabel: v })} />
        <I18nInput label="Title" value={g.title} onChange={(v) => set("giftCards", { ...g, title: v })} />
        <I18nInput label="Intro" value={g.intro} onChange={(v) => set("giftCards", { ...g, intro: v })} multiline />
        <I18nInput
          label="Small print"
          value={g.note}
          onChange={(v) => set("giftCards", { ...g, note: v })}
          multiline
          hint="Shown under the packages — minimum order, who the offer is for, dates."
        />
        <ImageInput label="Photo" value={g.image} onChange={(v) => set("giftCards", { ...g, image: v })} />
      </Card>

      <Card title="Packages">
        <ListEditor
          title="Packages"
          items={g.items}
          onChange={(items) => set("giftCards", { ...g, items })}
          create={() => ({ id: uid("gc"), badge: { en: "Package" }, name: { en: "New package" }, price: "" })}
          labelFor={(item) => `${item.name.en}${item.price ? ` — €${item.price}` : ""}`}
          renderItem={(item, update) => (
            <>
              <I18nInput label="Badge" value={item.badge} onChange={(v) => update({ badge: v })} />
              <I18nInput label="What is included" value={item.name} onChange={(v) => update({ name: v })} />
              <Field label="Price in €">
                <TextInput value={item.price} onChange={(v) => update({ price: v })} />
              </Field>
            </>
          )}
        />
      </Card>
    </>
  );
}

function LocationSection({ draft, set }: Props) {
  const l = draft.location;
  return (
    <>
      <Card title="Location page">
        <Toggle
          label="Show the location page"
          value={l.enabled}
          onChange={(v) => set("location", { ...l, enabled: v })}
        />
        <I18nInput label="Menu label" value={l.linkLabel} onChange={(v) => set("location", { ...l, linkLabel: v })} />
        <I18nInput label="Title" value={l.title} onChange={(v) => set("location", { ...l, title: v })} />
        <I18nInput label="Intro" value={l.intro} onChange={(v) => set("location", { ...l, intro: v })} multiline />
        <Field
          label="Video file"
          hint="Path to a vertical clip in the project, e.g. /video/salon.mp4. Upload new video files to the repository — the panel only handles images."
        >
          <TextInput value={l.video} onChange={(v) => set("location", { ...l, video: v })} />
        </Field>
        <ImageInput
          label="Video poster"
          value={l.videoPoster}
          onChange={(v) => set("location", { ...l, videoPoster: v })}
          hint="Still frame shown before the video starts."
        />
      </Card>

      <Card title="How to find us">
        <ListEditor
          title="Directions"
          items={l.directions}
          onChange={(directions) => set("location", { ...l, directions })}
          create={() => ({ en: "" })}
          labelFor={(item, i) => item.en.slice(0, 60) || `Line ${i + 1}`}
          renderItem={(item, update) => (
            <I18nInput label="Line" value={item} onChange={(v) => update(v)} multiline rows={3} />
          )}
        />
      </Card>
    </>
  );
}

function LegalSectionEditor({ draft, set }: Props) {
  const l = draft.legal;
  return (
    <>
      <Card title="Privacy page">
        <I18nInput label="Footer link label" value={l.linkLabel} onChange={(v) => set("legal", { ...l, linkLabel: v })} />
        <I18nInput label="Page title" value={l.title} onChange={(v) => set("legal", { ...l, title: v })} />
        <I18nInput
          label="Last updated"
          value={l.updated}
          onChange={(v) => set("legal", { ...l, updated: v })}
          hint="Change this date whenever you edit the policy."
        />
        <I18nInput label="Intro" value={l.intro} onChange={(v) => set("legal", { ...l, intro: v })} multiline />
      </Card>

      <Card title="Sections">
        <ListEditor
          title="Sections"
          items={l.sections}
          onChange={(sections) => set("legal", { ...l, sections })}
          create={() => ({ id: uid("l"), heading: { en: "New section" }, body: [{ en: "" }] })}
          labelFor={(item) => item.heading.en}
          renderItem={(item, update) => (
            <>
              <I18nInput label="Heading" value={item.heading} onChange={(v) => update({ heading: v })} />
              <ListEditor
                title="Paragraphs"
                items={item.body}
                onChange={(body) => update({ body })}
                create={() => ({ en: "" })}
                labelFor={(para, i) => para.en.slice(0, 60) || `Paragraph ${i + 1}`}
                renderItem={(para, updatePara) => (
                  <I18nInput label="Text" value={para} onChange={(v) => updatePara(v)} multiline rows={5} />
                )}
              />
            </>
          )}
        />
      </Card>
    </>
  );
}

function FooterSection({ draft, set }: Props) {
  const f = draft.footer;
  return (
    <Card title="Footer">
      <I18nInput label="Closing line" value={f.note} onChange={(v) => set("footer", { ...f, note: v })} />
      <Field label="Copyright name">
        <TextInput value={f.credit} onChange={(v) => set("footer", { ...f, credit: v })} />
      </Field>
    </Card>
  );
}
