import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftCardsView from "@/components/GiftCardsView";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `${content.giftCards.title.en} — ${content.brand.name}`,
  description: content.giftCards.intro.en,
  openGraph: { images: content.giftCards.image ? [content.giftCards.image] : undefined },
};

export default function GiftCardsPage() {
  if (!content.giftCards.enabled) notFound();
  return <GiftCardsView content={content} />;
}
