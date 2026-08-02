"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { ZonaPOA, TipoCorrida } from "@/lib/types";

const ZONAS: ZonaPOA[] = [
  "Centro Histórico",
  "Zona Norte",
  "Zona Sul",
  "Zona Leste",
  "Orla do Guaíba",
  "Região Metropolitana",
];

const TIPOS: TipoCorrida[] = ["Rua", "Trilha", "Noturna", "Infantil", "Virtual"];

const DISTANCIAS = ["5km", "10km", "15km", "21km", "42km"];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [busca, setBusca] = useState(searchParams.get("q") ?? "");

  function atualizar(nome: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor && valor !== "todos") {
      params.set(nome, valor);
    } else {
      params.delete(nome);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    atualizar("q", busca);
  }

  const selectCls =
    "rounded-full border-2 border-ink-900/10 bg-white px-4 py-2.5 text-[13px] font-bold text-ink-900/70 outline-none transition focus:border-ink-900 cursor-pointer";

  return (
    <div className="rounded-xl2 border border-ink-900/[0.06] bg-white p-5 shadow-card">
      <form onSubmit={buscar} className="mb-4 flex gap-2">
        <div className="relative w-full">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/30"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar corrida por nome..."
            className="input-pill !pl-11"
          />
        </div>
        <button type="submit" className="btn-primary !px-6 !py-3 shrink-0 text-[13px]">
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2.5">
        <select
          defaultValue={searchParams.get("zone") ?? "todos"}
          onChange={(e) => atualizar("zone", e.target.value)}
          className={selectCls}
        >
          <option value="todos">Todas as regiões</option>
          {ZONAS.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("type") ?? "todos"}
          onChange={(e) => atualizar("type", e.target.value)}
          className={selectCls}
        >
          <option value="todos">Todos os tipos</option>
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("distance") ?? "todos"}
          onChange={(e) => atualizar("distance", e.target.value)}
          className={selectCls}
        >
          <option value="todos">Todas as distâncias</option>
          {DISTANCIAS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("period") ?? "todos"}
          onChange={(e) => atualizar("period", e.target.value)}
          className={selectCls}
        >
          <option value="todos">Qualquer data</option>
          <option value="30">Próximos 30 dias</option>
          <option value="90">Próximos 3 meses</option>
          <option value="180">Próximos 6 meses</option>
        </select>
      </div>
    </div>
  );
}
