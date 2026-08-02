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
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-app py-14 text-center">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-5xl">
            Todas as corridas de rua de Porto Alegre, num só lugar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Filtre por região, distância e data. Veja tudo no calendário. Encontre sua
            próxima corrida em segundos.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/calendario"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold hover:border-brand-500"
            >
              Ver calendário
            </Link>
            <Link
              href="/cadastrar"
              className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
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
        <section className="container-app py-6">
          <h2 className="mb-4 font-display text-xl font-bold text-ink-900">
            ⭐ Corridas em destaque
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((c) => (
              <RaceCard key={c.id} corrida={c} />
            ))}
          </div>
        </section>
      )}

      <section className="container-app py-6">
        <h2 className="mb-4 font-display text-xl font-bold text-ink-900">
          Todas as corridas
        </h2>
        <div className="mb-6">
          <FilterBar />
        </div>

        {!erroConexao && corridas.length === 0 && (
          <p className="py-12 text-center text-slate-400">
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
