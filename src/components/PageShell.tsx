"use client";

import AmbientBackground from "./AmbientBackground";
import Contact from "./Contact";
import Header from "./Header";
import ScrollProgress from "./ScrollProgress";
import SplashScreen from "./SplashScreen";
import { SiteProvider } from "./site-context";
import type { SiteContent } from "@/lib/types";

/** Header, ambient background and footer around a standalone page. */
export default function PageShell({
  content,
  images = [],
  children,
}: {
  content: SiteContent;
  /** Large photos this page leads with — the opening screen waits for them. */
  images?: string[];
  children: React.ReactNode;
}) {
  return (
    <SiteProvider content={content}>
      <SplashScreen
        images={images}
        brandName={content.brand.name}
        logo={content.brand.logoImageDark || content.brand.logoImage}
      />
      <AmbientBackground />
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Contact />
    </SiteProvider>
  );
}
