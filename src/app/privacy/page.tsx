import type { Metadata } from "next";
import LegalView from "@/components/LegalView";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `${content.legal.title.en} — ${content.brand.name}`,
  description: content.legal.intro.en,
};

export default function PrivacyPage() {
  return <LegalView content={content} />;
}
