import Link from "next/link";
import { Fragment } from "react";
import { buscarCorridas, buscarDestaques, FiltrosCorrida } from "@/lib/queries";
import RaceCard from "@/components/RaceCard";
import FilterBar from "@/components/FilterBar";
import AdSlot from "@/components/AdSlot";

export const revalidate = 60; // atualiza a cada 60s (novos cadastros aparecem sem precisar novo deploy)

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filtros: FiltrosCorrida = {
    q: searchParams.q,
    zone: searchParams.zone,
    type: searchParams.type,
    distance: searchParams.distance,
    period: searchParams.period,
  };

  let corridas: Awaited<ReturnType<typeof buscarCorridas>> = [];
  let destaques: Awaited<ReturnType<typeof buscarDestaques>> = [];
  let erroConexao = false;

  try {
    [corridas, destaques] = await Promise.all([
      buscarCorridas(filtros),
      buscarDestaques(),
    ]);
  } catch {
    erroConexao = true;
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-app relative py-20 text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide2 text-brand-400">
            Porto Alegre · Todas as corridas em um só lugar
          </span>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tightest text-white sm:text-6xl">
            Sua próxima corrida <span className="text-brand-400">começa aqui</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-white/50">
            Filtre por região, distância e data. Veja tudo no calendário. Encontre sua
            próxima corrida em segundos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/calendario" className="btn-accent">
              Ver calendário
            </Link>
            <Link
              href="/cadastrar"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-900 transition hover:bg-white/90 active:scale-[0.98]"
            >
              Cadastrar minha corrida
            </Link>
          </div>
        </div>
      </section>

      <div className="container-app py-6">
        <AdSlot formato="leaderboard" />
      </div>

      {erroConexao && (
        <div className="container-app">
          <div className="rounded-xl2 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            O site ainda não está conectado a um banco de dados. Configure as variáveis
            <code className="mx-1 rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>
            e
            <code className="mx-1 rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            para ver as corridas reais aqui (veja o guia de configuração).
          </div>
        </div>
      )}

      {!erroConexao && destaques.length > 0 && (
        <section className="container-app py-8">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
              ★
            </span>
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink-900">
              Corridas em destaque
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((c) => (
              <RaceCard key={c.id} corrida={c} />
            ))}
          </div>
        </section>
      )}

      <section className="container-app py-8">
        <h2 className="mb-5 font-display text-lg font-extrabold tracking-tight text-ink-900">
          Todas as corridas
        </h2>
        <div className="mb-6">
          <FilterBar />
        </div>

        {!erroConexao && corridas.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-ink-900/35">
            Nenhuma corrida encontrada com esses filtros.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corridas.map((c, i) => (
            <Fragment key={c.id}>
              <RaceCard corrida={c} />
              {(i + 1) % 6 === 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <AdSlot formato="leaderboard" label="Publicidade" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
