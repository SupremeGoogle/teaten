import type { I18nText, Lang } from "./types";

/** Resolve a translatable field, falling back to English. */
export function t(value: I18nText | undefined, lang: Lang): string {
  if (!value) return "";
  const v = value[lang];
  return v && v.trim() ? v : value.en ?? "";
}

type UiKey =
  | "book"
  | "bookOnWhatsapp"
  | "call"
  | "menu"
  | "close"
  | "language"
  | "onRequest"
  | "from"
  | "currency"
  | "name"
  | "phone"
  | "service"
  | "chooseService"
  | "date"
  | "time"
  | "people"
  | "notes"
  | "notesPlaceholder"
  | "namePlaceholder"
  | "phonePlaceholder"
  | "send"
  | "required"
  | "openingHours"
  | "address"
  | "phones"
  | "followUs"
  | "viewOnMap"
  | "allRights"
  | "was"
  | "save"
  | "scrollDown"
  | "greeting"
  | "requestLine";

export const UI: Record<Lang, Record<UiKey, string>> = {
  en: {
    book: "Book",
    bookOnWhatsapp: "Book on WhatsApp",
    call: "Call us",
    menu: "Menu",
    close: "Close",
    language: "Language",
    onRequest: "On request",
    from: "from",
    currency: "€",
    name: "Your name",
    phone: "Phone",
    service: "Service",
    chooseService: "Choose a service",
    date: "Preferred date",
    time: "Preferred time",
    people: "People",
    notes: "Anything we should know?",
    notesPlaceholder: "Sensitive skin, first visit, a question…",
    namePlaceholder: "e.g. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Send request on WhatsApp",
    required: "Please fill in your name and pick a service.",
    openingHours: "Opening hours",
    address: "Address",
    phones: "Phone",
    followUs: "Follow us",
    viewOnMap: "Open in Google Maps",
    allRights: "All rights reserved.",
    was: "was",
    save: "save",
    scrollDown: "Scroll",
    greeting: "Hello Tea Ten! I would like to book an appointment.",
    requestLine: "Sent from teaten website",
  },
  sq: {
    book: "Rezervo",
    bookOnWhatsapp: "Rezervo në WhatsApp",
    call: "Na telefono",
    menu: "Menu",
    close: "Mbyll",
    language: "Gjuha",
    onRequest: "Me kërkesë",
    from: "prej",
    currency: "€",
    name: "Emri juaj",
    phone: "Telefoni",
    service: "Shërbimi",
    chooseService: "Zgjidh një shërbim",
    date: "Data e preferuar",
    time: "Ora e preferuar",
    people: "Persona",
    notes: "Diçka që duhet ta dimë?",
    notesPlaceholder: "Lëkurë e ndjeshme, vizita e parë, një pyetje…",
    namePlaceholder: "p.sh. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Dërgo kërkesën në WhatsApp",
    required: "Ju lutem shkruani emrin dhe zgjidhni një shërbim.",
    openingHours: "Orari",
    address: "Adresa",
    phones: "Telefoni",
    followUs: "Na ndiqni",
    viewOnMap: "Hap në Google Maps",
    allRights: "Të gjitha të drejtat e rezervuara.",
    was: "ishte",
    save: "kurse",
    scrollDown: "Zbrit",
    greeting: "Përshëndetje Tea Ten! Dëshiroj të rezervoj një termin.",
    requestLine: "Dërguar nga faqja teaten",
  },
  sr: {
    book: "Rezerviši",
    bookOnWhatsapp: "Rezerviši putem WhatsApp-a",
    call: "Pozovite nas",
    menu: "Meni",
    close: "Zatvori",
    language: "Jezik",
    onRequest: "Na upit",
    from: "od",
    currency: "€",
    name: "Vaše ime",
    phone: "Telefon",
    service: "Usluga",
    chooseService: "Odaberite uslugu",
    date: "Željeni datum",
    time: "Željeno vreme",
    people: "Broj osoba",
    notes: "Ima li nešto što treba da znamo?",
    notesPlaceholder: "Osetljiva koža, prva poseta, pitanje…",
    namePlaceholder: "npr. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Pošaljite zahtev putem WhatsApp-a",
    required: "Unesite ime i odaberite uslugu.",
    openingHours: "Radno vreme",
    address: "Adresa",
    phones: "Telefon",
    followUs: "Pratite nas",
    viewOnMap: "Otvori u Google mapama",
    allRights: "Sva prava zadržana.",
    was: "bilo",
    save: "ušteda",
    scrollDown: "Dole",
    greeting: "Zdravo, Tea Ten! Želim da zakažem tretman.",
    requestLine: "Poslato sa sajta teaten",
  },
};

export function ui(lang: Lang): Record<UiKey, string> {
  return UI[lang] ?? UI.en;
}
