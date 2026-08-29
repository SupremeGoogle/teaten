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
  ru: {
    book: "Записаться",
    bookOnWhatsapp: "Записаться в WhatsApp",
    call: "Позвонить",
    menu: "Меню",
    close: "Закрыть",
    language: "Язык",
    onRequest: "По запросу",
    from: "от",
    currency: "€",
    name: "Ваше имя",
    phone: "Телефон",
    service: "Услуга",
    chooseService: "Выберите услугу",
    date: "Желаемая дата",
    time: "Желаемое время",
    people: "Человек",
    notes: "Что нам важно знать?",
    notesPlaceholder: "Чувствительная кожа, первый визит, вопрос…",
    namePlaceholder: "например, Елена",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Отправить заявку в WhatsApp",
    required: "Укажите имя и выберите услугу.",
    openingHours: "Часы работы",
    address: "Адрес",
    phones: "Телефон",
    followUs: "Мы в соцсетях",
    viewOnMap: "Открыть в Google Maps",
    allRights: "Все права защищены.",
    was: "было",
    save: "выгода",
    scrollDown: "Вниз",
    greeting: "Здравствуйте, Tea Ten! Хочу записаться на процедуру.",
    requestLine: "Отправлено с сайта teaten",
  },
};

export function ui(lang: Lang): Record<UiKey, string> {
  return UI[lang] ?? UI.en;
}
