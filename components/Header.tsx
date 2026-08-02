import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/[0.06] bg-white/85 backdrop-blur-md">
      <div className="container-app flex h-[68px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-brand-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 5.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5z" fill="currentColor"/>
              <path d="M17.5 21l-2-5.5-3-1.5.5-4-3 1L8 14l-3 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 10l2.5-2.5 3 2 3-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="font-display text-[17px] font-extrabold tracking-tightest text-ink-900">
            Corridas<span className="text-brand-500">POA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink-900/[0.06] bg-ink-900/[0.03] p-1 text-sm font-semibold text-ink-900/60 sm:flex">
          <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink-900 hover:shadow-card">
            Corridas
          </Link>
          <Link href="/calendario" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink-900 hover:shadow-card">
            Calendário
          </Link>
          <Link href="/planos" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink-900 hover:shadow-card">
            Anuncie sua corrida
          </Link>
        </nav>

        <Link href="/cadastrar" className="btn-primary !px-5 !py-2.5 text-[13px]">
          Cadastrar corrida
        </Link>
      </div>
    </header>
  );
}
