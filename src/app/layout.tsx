import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { content } from "@/lib/content";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teaten.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: content.seo.title.en,
  description: content.seo.description.en,
  openGraph: {
    title: content.seo.title.en,
    description: content.seo.description.en,
    images: content.seo.ogImage ? [content.seo.ogImage] : undefined,
    type: "website",
  },
  icons: {
    icon: content.brand.favicon || "/brand/favicon.png",
    apple: "/brand/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable}`}>
      <head>
        {/* Palette comes from the editable content, so the admin can restyle the site. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{
  --color-cream:${content.theme.cream};
  --color-cream-deep:${content.theme.creamDeep};
  --color-taupe:${content.theme.taupe};
  --color-sage:${content.theme.sage};
  --color-espresso:${content.theme.espresso};
  --color-espresso-soft:${content.theme.espressoSoft};
  --color-gold:${content.theme.gold};
}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
