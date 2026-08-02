import Link from "next/link";
import AdSlot from "./AdSlot";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-app py-6">
        <AdSlot formato="leaderboard" label="Publicidade" />
      </div>
      <div className="container-app flex flex-col gap-4 pb-10 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Corridas POA — o catálogo de corridas de rua de Porto Alegre.</p>
        <div className="flex gap-4">
          <Link href="/planos" className="hover:text-brand-600">
            Anuncie sua corrida
          </Link>
          <Link href="/cadastrar" className="hover:text-brand-600">
            Cadastrar gratuitamente
          </Link>
        </div>
      </div>
    </footer>
  );
}
