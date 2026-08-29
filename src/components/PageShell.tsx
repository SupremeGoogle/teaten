"use client";

import AmbientBackground from "./AmbientBackground";
import Contact from "./Contact";
import Header from "./Header";
import ScrollProgress from "./ScrollProgress";
import { SiteProvider } from "./site-context";
import type { SiteContent } from "@/lib/types";

/** Header, ambient background and footer around a standalone page. */
export default function PageShell({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteProvider content={content}>
      <AmbientBackground />
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Contact />
    </SiteProvider>
  );
}
