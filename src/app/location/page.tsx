import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationView from "@/components/LocationView";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `${content.location.title.en} — ${content.brand.name}`,
  description: content.location.intro.en,
  openGraph: { images: content.location.videoPoster ? [content.location.videoPoster] : undefined },
};

export default function LocationPage() {
  if (!content.location.enabled) notFound();
  return <LocationView content={content} />;
}
