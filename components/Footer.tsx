import Link from "next/link";
import AdSlot from "./AdSlot";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-900/[0.06] bg-white">
      <div className="container-app py-8">
        <AdSlot formato="leaderboard" label="Publicidade" />
      </div>
      <div className="container-app flex flex-col gap-4 pb-10 pt-4 text-sm font-medium text-ink-900/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CorridasPOA — o catálogo de corridas de rua de Porto Alegre.</p>
        <div className="flex gap-5">
          <Link href="/planos" className="transition hover:text-ink-900">
            Anuncie sua corrida
          </Link>
          <Link href="/cadastrar" className="transition hover:text-ink-900">
            Cadastrar gratuitamente
          </Link>
        </div>
      </div>
    </footer>
  );
}
