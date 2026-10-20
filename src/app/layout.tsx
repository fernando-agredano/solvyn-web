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
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Software a medida para negocios en México. Configura tu solución y recibe una propuesta con módulos, fases e inversión.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
