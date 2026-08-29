import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceCategoryView from "@/components/ServiceCategoryView";
import { content } from "@/lib/content";

export function generateStaticParams() {
  return content.services.categories.map((c) => ({ slug: c.slug }));
}

function find(slug: string) {
  return content.services.categories.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const cat = find((await params).slug);
  if (!cat) return {};
  return {
    title: `${cat.title.en} — ${content.brand.name}`,
    description: cat.intro.en || content.seo.description.en,
    openGraph: { images: cat.images?.[0] ? [cat.images[0]] : undefined },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cat = find((await params).slug);
  if (!cat) notFound();
  return <ServiceCategoryView content={content} categoryId={cat.id} />;
}
