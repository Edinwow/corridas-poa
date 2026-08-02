"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Corrida } from "@/lib/types";
import { TAG_COLORS, PLAN_BAR_GRADIENTS } from "@/lib/theme";

function parseDataLocal(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export default function RaceCalendar({ corridas }: { corridas: Corrida[] }) {
  // Começa no mês da próxima corrida (não necessariamente o mês atual do
  // calendário), pra não parecer "vazio" quando não há eventos hoje.
  const [mesAtual, setMesAtual] = useState<Date>(() => {
    const hojeStr = format(new Date(), "yyyy-MM-dd");
    const ordenadas = [...corridas].sort((a, b) => a.date.localeCompare(b.date));
    const proxima = ordenadas.find((c) => c.date >= hojeStr) ?? ordenadas[0];
    return proxima ? parseDataLocal(proxima.date) : new Date();
  });
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

  const dias = useMemo(() => {
    const inicio = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 });
    const fim = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [mesAtual]);

  const corridasPorDia = useMemo(() => {
    const mapa = new Map<string, Corrida[]>();
    for (const c of corridas) {
      const chave = c.date;
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(c);
    }
    return mapa;
  }, [corridas]);

  const corridasDoDia = diaSelecionado
    ? corridasPorDia.get(format(diaSelecionado, "yyyy-MM-dd")) ?? []
    : [];

  const corridasNoMes = useMemo(
    () => corridas.filter((c) => isSameMonth(parseDataLocal(c.date), mesAtual)).length,
    [corridas, mesAtual]
  );

  const proximaCorrida = useMemo(() => {
    const hojeStr = format(new Date(), "yyyy-MM-dd");
    const ordenadas = [...corridas].sort((a, b) => a.date.localeCompare(b.date));
    return ordenadas.find((c) => c.date >= hojeStr) ?? ordenadas[0] ?? null;
  }, [corridas]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl2 border border-ink-900/[0.06] bg-white p-5 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => setMesAtual((m) => subMonths(m, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-900/10 text-sm font-bold text-ink-900 transition hover:border-ink-900"
          >
            ←
          </button>
          <h2 className="font-display text-lg font-extrabold capitalize tracking-tight text-ink-900">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <button
            onClick={() => setMesAtual((m) => addMonths(m, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-900/10 text-sm font-bold text-ink-900 transition hover:border-ink-900"
          >
            →
          </button>
        </div>

        {corridasNoMes === 0 && proximaCorrida && (
          <button
            onClick={() => setMesAtual(parseDataLocal(proximaCorrida.date))}
            className="mb-4 flex w-full items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 text-left text-[13px] font-bold text-brand-700 transition hover:bg-brand-100"
          >
            <span>Nenhuma corrida em {format(mesAtual, "MMMM", { locale: ptBR })} · próxima é {proximaCorrida.name}</span>
            <span>Ver mês →</span>
          </button>
        )}

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-900/30">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia) => {
            const chave = format(dia, "yyyy-MM-dd");
            const eventos = corridasPorDia.get(chave) ?? [];
            const temEventos = eventos.length > 0;
            const temPago = eventos.some((e) => e.plan !== "free");
            const foraDoMes = !isSameMonth(dia, mesAtual);
            const selecionado = diaSelecionado && isSameDay(dia, diaSelecionado);
            const hoje = isSameDay(dia, new Date());

            return (
              <button
                key={chave}
                onClick={() => setDiaSelecionado(dia)}
                className={`relative flex h-[72px] flex-col items-start justify-between rounded-2xl p-2 text-left text-xs transition ${
                  selecionado
                    ? "bg-brand-500 ring-2 ring-brand-500"
                    : temPago
                    ? "bg-gradient-to-br from-amber-50 to-brand-50/70 ring-1 ring-amber-300/60 hover:ring-amber-400"
                    : temEventos
                    ? "bg-ink-900/[0.035] hover:bg-ink-900/[0.07]"
                    : "hover:bg-ink-900/[0.04]"
                } ${foraDoMes ? "opacity-25" : ""}`}
              >
                {temPago && !selecionado && (
                  <span className="absolute right-1.5 top-1.5 text-[10px] leading-none text-amber-500">★</span>
                )}
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    selecionado
                      ? "bg-white text-brand-600"
                      : hoje
                      ? "bg-ink-900 text-white"
                      : "text-ink-900"
                  }`}
                >
                  {format(dia, "d")}
                </span>
                <div className="flex flex-wrap gap-1">
                  {eventos.slice(0, 4).map((ev) => (
                    <span
                      key={ev.id}
                      className={`h-2 w-2 rounded-full ${
                        selecionado ? "bg-white/80" : TAG_COLORS[ev.race_type].dot
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-ink-900/45">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ink-900/20" /> Corridas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500">★</span> Impulso / Elite
          </span>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-900/[0.06] bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-sm font-extrabold text-ink-900">
          {diaSelecionado
            ? `Corridas em ${format(diaSelecionado, "dd/MM/yyyy")}`
            : "Selecione um dia no calendário"}
        </h3>
        {corridasDoDia.length === 0 && diaSelecionado && (
          <p className="text-sm font-medium text-ink-900/35">Nenhuma corrida nesse dia.</p>
        )}
        <div className="flex flex-col gap-2">
          {corridasDoDia.map((c) => {
            const gradiente = PLAN_BAR_GRADIENTS[c.plan];
            return (
              <Link
                key={c.id}
                href={`/corridas/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-ink-900/[0.06] p-3 text-sm transition hover:border-ink-900/20 hover:bg-ink-900/[0.02]"
              >
                {gradiente && (
                  <span className={`h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b ${gradiente}`} />
                )}
                <div>
                  <p className="font-bold text-ink-900">{c.name}</p>
                  <p className="stat-label mt-0.5">{c.distances.join(", ")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
