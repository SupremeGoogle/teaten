"use client";

import { useEffect, useState } from "react";
import { useSite, bookingLink } from "./site-context";
import { WhatsAppIcon } from "./icons";

/** Floating WhatsApp button — appears once the visitor has scrolled past the hero. */
export default function WhatsAppFab() {
  const { c, L } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={bookingLink(c.contact, L.greeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={L.bookOnWhatsapp}
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-white shadow-lg shadow-espresso/25 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
