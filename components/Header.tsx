import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            🏃
          </span>
          Corridas POA
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/" className="hover:text-brand-600">
            Corridas
          </Link>
          <Link href="/calendario" className="hover:text-brand-600">
            Calendário
          </Link>
          <Link href="/planos" className="hover:text-brand-600">
            Anuncie sua corrida
          </Link>
        </nav>

        <Link
          href="/cadastrar"
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Cadastrar corrida
        </Link>
      </div>
    </header>
  );
}
