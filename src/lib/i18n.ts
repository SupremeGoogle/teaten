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
  de: {
    book: "Buchen",
    bookOnWhatsapp: "Über WhatsApp buchen",
    call: "Anrufen",
    menu: "Menü",
    close: "Schließen",
    language: "Sprache",
    onRequest: "Auf Anfrage",
    from: "ab",
    currency: "€",
    name: "Ihr Name",
    phone: "Telefon",
    service: "Behandlung",
    chooseService: "Behandlung wählen",
    date: "Wunschtermin",
    time: "Wunschzeit",
    people: "Personen",
    notes: "Sollten wir etwas wissen?",
    notesPlaceholder: "Empfindliche Haut, erster Besuch, eine Frage…",
    namePlaceholder: "z. B. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Anfrage über WhatsApp senden",
    required: "Bitte Namen eintragen und eine Behandlung wählen.",
    openingHours: "Öffnungszeiten",
    address: "Adresse",
    phones: "Telefon",
    followUs: "Folgen Sie uns",
    viewOnMap: "In Google Maps öffnen",
    allRights: "Alle Rechte vorbehalten.",
    was: "statt",
    save: "sparen",
    scrollDown: "Mehr",
    greeting: "Hallo Tea Ten! Ich möchte gerne einen Termin buchen.",
    requestLine: "Gesendet über die teaten Website",
  },
  it: {
    book: "Prenota",
    bookOnWhatsapp: "Prenota su WhatsApp",
    call: "Chiamaci",
    menu: "Menu",
    close: "Chiudi",
    language: "Lingua",
    onRequest: "Su richiesta",
    from: "da",
    currency: "€",
    name: "Il tuo nome",
    phone: "Telefono",
    service: "Trattamento",
    chooseService: "Scegli un trattamento",
    date: "Data preferita",
    time: "Ora preferita",
    people: "Persone",
    notes: "Qualcosa che dovremmo sapere?",
    notesPlaceholder: "Pelle sensibile, prima visita, una domanda…",
    namePlaceholder: "es. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "Invia richiesta su WhatsApp",
    required: "Inserisci il tuo nome e scegli un trattamento.",
    openingHours: "Orari",
    address: "Indirizzo",
    phones: "Telefono",
    followUs: "Seguici",
    viewOnMap: "Apri in Google Maps",
    allRights: "Tutti i diritti riservati.",
    was: "era",
    save: "risparmi",
    scrollDown: "Scorri",
    greeting: "Ciao Tea Ten! Vorrei prenotare un appuntamento.",
    requestLine: "Inviato dal sito teaten",
  },
  tr: {
    book: "Randevu",
    bookOnWhatsapp: "WhatsApp'tan randevu al",
    call: "Bizi arayın",
    menu: "Menü",
    close: "Kapat",
    language: "Dil",
    onRequest: "Talep üzerine",
    from: "başlangıç",
    currency: "€",
    name: "Adınız",
    phone: "Telefon",
    service: "Hizmet",
    chooseService: "Bir hizmet seçin",
    date: "Tercih edilen tarih",
    time: "Tercih edilen saat",
    people: "Kişi",
    notes: "Bilmemiz gereken bir şey var mı?",
    notesPlaceholder: "Hassas cilt, ilk ziyaret, bir soru…",
    namePlaceholder: "örn. Elena",
    phonePlaceholder: "+383 4x xxx xxx",
    send: "WhatsApp'tan gönder",
    required: "Lütfen adınızı yazın ve bir hizmet seçin.",
    openingHours: "Çalışma saatleri",
    address: "Adres",
    phones: "Telefon",
    followUs: "Bizi takip edin",
    viewOnMap: "Google Haritalar'da aç",
    allRights: "Tüm hakları saklıdır.",
    was: "eski",
    save: "indirim",
    scrollDown: "Kaydır",
    greeting: "Merhaba Tea Ten! Randevu almak istiyorum.",
    requestLine: "teaten web sitesinden gönderildi",
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
