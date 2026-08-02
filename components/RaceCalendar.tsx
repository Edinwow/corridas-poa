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
      <div className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMesAtual((m) => subMonths(m, 1))}
            className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            ← Anterior
          </button>
          <h2 className="font-display text-lg font-bold capitalize">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <button
            onClick={() => setMesAtual((m) => addMonths(m, 1))}
            className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            Próximo →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
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

            return (
              <button
                key={chave}
                onClick={() => setDiaSelecionado(dia)}
                className={`flex h-20 flex-col items-start rounded-lg border p-1.5 text-left text-xs transition ${
                  selecionado
                    ? "border-brand-500 bg-brand-50"
                    : "border-transparent hover:bg-slate-50"
                } ${foraDoMes ? "opacity-30" : ""}`}
              >
                <span className="font-semibold">{format(dia, "d")}</span>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {eventos.slice(0, 3).map((ev) => (
                    <span
                      key={ev.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        ev.plan === "premium"
                          ? "bg-ember-500"
                          : ev.plan === "destaque"
                          ? "bg-brand-500"
                          : "bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold text-slate-700">
          {diaSelecionado
            ? `Corridas em ${format(diaSelecionado, "dd/MM/yyyy")}`
            : "Selecione um dia no calendário"}
        </h3>
        {corridasDoDia.length === 0 && diaSelecionado && (
          <p className="text-sm text-slate-400">Nenhuma corrida nesse dia.</p>
        )}
        <div className="flex flex-col gap-2">
          {corridasDoDia.map((c) => (
            <Link
              key={c.id}
              href={`/corridas/${c.slug}`}
              className="rounded-lg border border-slate-100 p-2.5 text-sm hover:border-brand-300 hover:bg-brand-50"
            >
              <p className="font-semibold text-ink-900">{c.name}</p>
              <p className="text-xs text-slate-500">
                {c.city_zone} · {c.distances.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
