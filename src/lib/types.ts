export type Lang = "en" | "sq" | "ru";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

/** A text value: English is required, other languages are optional overrides. */
export type I18nText = { en: string } & Partial<Record<Lang, string>>;

export type ServiceItem = {
  id: string;
  name: I18nText;
  description: I18nText;
  price: string;
  duration: string;
};

export type ServiceCategory = {
  id: string;
  /** URL segment for this category's own price page, e.g. "facial-treatments". */
  slug: string;
  title: I18nText;
  intro: I18nText;
  /** Several photos per category; the first one opens as the large image. */
  images: string[];
  items: ServiceItem[];
};

export type OfferItem = {
  id: string;
  name: I18nText;
  oldPrice: string;
  newPrice: string;
};

export type GalleryItem = {
  id: string;
  image: string;
  caption: I18nText;
};

export type Testimonial = {
  id: string;
  name: string;
  text: I18nText;
  rating: number;
};

export type LegalSection = {
  id: string;
  heading: I18nText;
  body: I18nText[];
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: I18nText;
    /** White artwork, used on the dark footer. Empty -> built-in vector wordmark. */
    logoImage: string;
    /** Dark artwork, used on the cream header. Falls back to the white one. */
    logoImageDark: string;
    favicon: string;
  };
  theme: {
    cream: string;
    creamDeep: string;
    taupe: string;
    sage: string;
    espresso: string;
    espressoSoft: string;
    gold: string;
  };
  contact: {
    phones: string[];
    whatsapp: string; // digits only, international format
    address: I18nText;
    mapUrl: string;
    mapEmbedUrl: string;
    hours: I18nText;
    email: string;
    instagram: string;
    facebook: string;
  };
  nav: { id: string; label: I18nText; href: string }[];
  hero: {
    image: string;
    kicker: I18nText;
    title: I18nText;
    subtitle: I18nText;
    primaryCta: I18nText;
    secondaryCta: I18nText;
  };
  marquee: I18nText[];
  about: {
    title: I18nText;
    body: I18nText[];
    image: string;
    signature: I18nText;
    stats: { id: string; value: string; label: I18nText }[];
  };
  services: {
    title: I18nText;
    intro: I18nText;
    categories: ServiceCategory[];
  };
  offers: {
    enabled: boolean;
    title: I18nText;
    intro: I18nText;
    validity: I18nText;
    image: string;
    items: OfferItem[];
  };
  gallery: {
    title: I18nText;
    intro: I18nText;
    items: GalleryItem[];
  };
  testimonials: {
    enabled: boolean;
    title: I18nText;
    items: Testimonial[];
  };
  booking: {
    title: I18nText;
    intro: I18nText;
    image: string;
    note: I18nText;
  };
  footer: {
    note: I18nText;
    credit: string;
  };
  seo: {
    title: I18nText;
    description: I18nText;
    ogImage: string;
  };
  legal: {
    /** Label used for the footer link. */
    linkLabel: I18nText;
    title: I18nText;
    /** Free text, e.g. "Last updated 29 August 2026". */
    updated: I18nText;
    intro: I18nText;
    sections: LegalSection[];
  };
};
