import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-ink-900">Página não encontrada</h1>
      <p className="mt-3 text-slate-600">Essa corrida ou página não existe (ou foi removida).</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Voltar para o site
      </Link>
    </div>
  );
}
