import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SettingsProvider } from "@/src/components/settings/SettingsProvider";
import { SITE, SITE_URL } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html lang="es-MX" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
        >
          Saltar al contenido
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <SettingsProvider settings={settings}>{children}</SettingsProvider>
      </body>
    </html>
  );
}
