export type Lang = "en" | "sq" | "de" | "it" | "tr" | "ru";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
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
  title: I18nText;
  intro: I18nText;
  image: string;
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

export type SiteContent = {
  brand: {
    name: string;
    tagline: I18nText;
    logoImage: string; // empty string -> use the built-in vector logo
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
};
