import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SITE, SITE_URL } from "@/src/config/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  // Variable font: one file covers the 400, 500, 600 and 700 used in the design.
  weight: "variable",
  // Width axis, from 62 (condensed) to 125 (extended). Used through the .wide and .semi classes.
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

// Static, trusted data. Contact details are left out until the placeholders are replaced.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/solvyn-logo.png`,
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
        >
          Saltar al contenido
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
