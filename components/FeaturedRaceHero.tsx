"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Corrida } from "@/lib/types";
import { formatarData } from "@/lib/utils";
import { TAG_GRADIENTS } from "@/lib/theme";

function calcularContagem(dataISO: string, hora: string | null) {
  // hora pode vir como "08:00" ou "08:00:00" (tipo TIME do Postgres) — normaliza pra HH:MM.
  const horaCurta = (hora ?? "07:00").slice(0, 5);
  const alvo = new Date(`${dataISO}T${horaCurta}:00`);
  const diff = Math.max(0, alvo.getTime() - Date.now());
  return {
    dias: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff % 86_400_000) / 3_600_000),
    min: Math.floor((diff % 3_600_000) / 60_000),
    seg: Math.floor((diff % 60_000) / 1_000),
    acabou: diff <= 0,
  };
}

export default function FeaturedRaceHero({ corrida }: { corrida: Corrida }) {
  const [contagem, setContagem] = useState(() => calcularContagem(corrida.date, corrida.time));

  useEffect(() => {
    const id = setInterval(() => setContagem(calcularContagem(corrida.date, corrida.time)), 1000);
    return () => clearInterval(id);
  }, [corrida.date, corrida.time]);

  const isPremium = corrida.plan === "premium";
  const gradiente = TAG_GRADIENTS[corrida.race_type];

  const blocos = [
    { valor: contagem.dias, label: "dias" },
    { valor: contagem.horas, label: "hrs" },
    { valor: contagem.min, label: "min" },
    { valor: contagem.seg, label: "seg" },
  ];

  return (
    <Link
      href={`/corridas/${corrida.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl3 shadow-cardHover transition hover:-translate-y-0.5 sm:flex-row"
    >
      <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
        {corrida.image_url ? (
          <Image
            src={corrida.image_url}
            alt={corrida.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br text-6xl ${gradiente}`}>
            🏃
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent sm:bg-gradient-to-r" />
        <span className={`absolute left-4 top-4 ${isPremium ? "badge-premium" : "badge-destaque"}`}>
          {isPremium ? "★ Premium" : "★ Destaque"}
        </span>
      </div>

      <div className={`flex flex-1 flex-col justify-center gap-4 bg-gradient-to-br p-6 text-white sm:p-9 ${gradiente}`}>
        <span className="text-[11px] font-bold uppercase tracking-wide2 text-white/70">
          Corrida em destaque
        </span>
        <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-[32px]">
          {corrida.name}
        </h2>
        <p className="text-[13px] font-bold text-white/80 sm:text-sm">
          {formatarData(corrida.date)}
          {corrida.time ? ` · ${corrida.time.slice(0, 5)}` : ""} · {corrida.city_zone}
        </p>

        {contagem.acabou ? (
          <p className="text-sm font-bold text-white/90">A corrida já começou — boa sorte a quem está correndo! 🏁</p>
        ) : (
          <div className="flex gap-2 sm:gap-3">
            {blocos.map((b) => (
              <div
                key={b.label}
                className="flex w-[60px] flex-col items-center rounded-2xl bg-white/15 py-2.5 backdrop-blur-sm sm:w-16"
              >
                <span className="font-display text-xl font-extrabold tabular-nums sm:text-2xl">
                  {String(b.valor).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">{b.label}</span>
              </div>
            ))}
          </div>
        )}

        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink-900 transition group-hover:bg-white/90">
          Ver detalhes da corrida →
        </span>
      </div>
    </Link>
  );
}
