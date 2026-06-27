import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estância 27 | Cutelaria Premium & Rifas",
  description: "Cutelaria de luxo, artigos de churrasco, chimarrão e campanhas exclusivas de rifas. Qualidade superior desde Santa Catarina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0e] text-[#f2ebd9] font-sans">
        {children}
      </body>
    </html>
  );
}
