import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Página não encontrada</h1>
      <p className="mt-3 text-[15px] font-medium text-ink-900/45">Essa corrida ou página não existe (ou foi removida).</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Voltar para o site
      </Link>
    </div>
  );
}
