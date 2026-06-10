import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VENDEDORAS - TULIPA",
  description: "Ferramenta multiuso para facilitar o dia a dia das vendedoras",
  icons: { icon: "/logo.jpg" },
  openGraph: {
    title: "VENDEDORAS - TULIPA",
    description: "Ferramenta multiuso para facilitar o dia a dia das vendedoras",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
