"use client";

import About from "./About";
import AmbientBackground from "./AmbientBackground";
import Booking from "./Booking";
import Contact from "./Contact";
import Gallery from "./Gallery";
import Header from "./Header";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Offers from "./Offers";
import ScrollProgress from "./ScrollProgress";
import Services from "./Services";
import SplashScreen from "./SplashScreen";
import Testimonials from "./Testimonials";
import WhatsAppFab from "./WhatsAppFab";
import { SiteProvider } from "./site-context";
import type { SiteContent } from "@/lib/types";

export default function SiteView({ content }: { content: SiteContent }) {
  return (
    <SiteProvider content={content}>
      <SplashScreen
        images={[content.hero.image, content.about.image]}
        brandName={content.brand.name}
        logo={content.brand.logoImageDark || content.brand.logoImage}
      />
      <AmbientBackground />
      <ScrollProgress />
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
