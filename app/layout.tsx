import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Corridas POA — Todas as corridas de rua de Porto Alegre",
  description:
    "Catálogo completo das corridas de rua de Porto Alegre: filtre por distância, região e data, veja tudo no calendário e cadastre seu evento gratuitamente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/*
        Google AdSense: depois de aprovado, cole aqui dentro do <head>
        o script fornecido pelo Google, algo como:
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossOrigin="anonymous"></script>
      */}
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
