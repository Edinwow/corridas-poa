import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/[0.06] bg-white/85 backdrop-blur-md">
      <div className="container-app flex h-[68px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-brand-400">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* pista de corrida estilizada, com marcador de largada */}
              <ellipse cx="12" cy="13" rx="9" ry="6" stroke="currentColor" strokeWidth="1.7" />
              <ellipse cx="12" cy="13" rx="4.6" ry="2.8" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="12" cy="3" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <span className="flex items-center gap-1.5 font-display text-[17px] font-extrabold tracking-tight text-ink-900">
            Corridas
            <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[12px] font-extrabold tracking-wide text-white">
              POA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink-900/[0.06] bg-ink-900/[0.03] p-1 text-sm font-semibold text-ink-900/60 sm:flex">
          <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink-900 hover:shadow-card">
            Corridas
          </Link>
          <Link href="/calendario" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink-900 hover:shadow-card">
            Calendário
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/planos"
            className="hidden text-[13px] font-semibold text-ink-900/40 transition hover:text-ink-900 sm:block"
          >
            Anuncie sua corrida
          </Link>
          <Link href="/cadastrar" className="btn-outline !px-4 !py-2 text-[13px]">
            Cadastrar corrida
          </Link>
        </div>
      </div>
    </header>
  );
}
