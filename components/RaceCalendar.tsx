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
import { TAG_COLORS } from "@/lib/theme";

export default function RaceCalendar({ corridas }: { corridas: Corrida[] }) {
  const [mesAtual, setMesAtual] = useState(new Date());
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
            const foraDoMes = !isSameMonth(dia, mesAtual);
            const selecionado = diaSelecionado && isSameDay(dia, diaSelecionado);
            const hoje = isSameDay(dia, new Date());

            return (
              <button
                key={chave}
                onClick={() => setDiaSelecionado(dia)}
                className={`flex h-[72px] flex-col items-start rounded-2xl p-2 text-left text-xs transition ${
                  selecionado
                    ? "bg-ink-900"
                    : "hover:bg-ink-900/[0.04]"
                } ${foraDoMes ? "opacity-25" : ""}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    selecionado
                      ? "bg-brand-500 text-white"
                      : hoje
                      ? "bg-ink-900 text-white"
                      : "text-ink-900"
                  }`}
                >
                  {format(dia, "d")}
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {eventos.slice(0, 4).map((ev) => (
                    <span
                      key={ev.id}
                      className={`h-1.5 w-1.5 rounded-full ${TAG_COLORS[ev.race_type].dot}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
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
            const tag = TAG_COLORS[c.race_type];
            return (
              <Link
                key={c.id}
                href={`/corridas/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-ink-900/[0.06] p-3 text-sm transition hover:border-ink-900/20 hover:bg-ink-900/[0.02]"
              >
                <span className={`h-8 w-1.5 shrink-0 rounded-full ${tag.bar}`} />
                <div>
                  <p className="font-bold text-ink-900">{c.name}</p>
                  <p className="stat-label mt-0.5">
                    {c.city_zone} · {c.distances.join(", ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
