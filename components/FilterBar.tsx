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

  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
      <form onSubmit={buscar} className="mb-3 flex gap-2">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar corrida por nome..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          defaultValue={searchParams.get("zone") ?? "todos"}
          onChange={(e) => atualizar("zone", e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
