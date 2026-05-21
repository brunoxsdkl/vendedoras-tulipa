import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VENDEDORAS - TULIPA",
  description: "Ferramenta multiuso para facilitar o dia a dia das vendedoras",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
