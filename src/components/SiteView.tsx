"use client";

import About from "./About";
import Booking from "./Booking";
import Contact from "./Contact";
import Gallery from "./Gallery";
import Header from "./Header";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Offers from "./Offers";
import Services from "./Services";
import Testimonials from "./Testimonials";
import WhatsAppFab from "./WhatsAppFab";
import { SiteProvider } from "./site-context";
import type { SiteContent } from "@/lib/types";

export default function SiteView({ content }: { content: SiteContent }) {
  return (
    <SiteProvider content={content}>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Offers />
        <Gallery />
        <Testimonials />
        <Booking />
      </main>
      <Contact />
      <WhatsAppFab />
    </SiteProvider>
  );
}
