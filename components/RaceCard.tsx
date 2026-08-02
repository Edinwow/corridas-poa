import Link from "next/link";
import Image from "next/image";
import { Corrida } from "@/lib/types";
import { formatarData, diasAteEvento } from "@/lib/utils";

export default function RaceCard({ corrida }: { corrida: Corrida }) {
  const dias = diasAteEvento(corrida.date);
  const isDestaque = corrida.plan === "destaque";
  const isPremium = corrida.plan === "premium";

  return (
    <Link
      href={`/corridas/${corrida.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl2 border bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover ${
        isPremium
          ? "border-ember-500/40 ring-1 ring-ember-500/20"
          : isDestaque
          ? "border-brand-500/40"
          : "border-slate-200"
      }`}
    >
      <div className="relative h-40 w-full bg-slate-100">
        {corrida.image_url ? (
          <Image
            src={corrida.image_url}
            alt={corrida.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            🏃
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {isPremium && <span className="badge-premium">Premium</span>}
          {isDestaque && <span className="badge-destaque">Destaque</span>}
        </div>
        {dias >= 0 && dias <= 14 && (
          <div className="absolute right-3 top-3 rounded-full bg-ink-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            {dias === 0 ? "É hoje!" : `Faltam ${dias} dias`}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>{formatarData(corrida.date)}</span>
          <span>{corrida.city_zone}</span>
        </div>
        <h3 className="font-display text-base font-bold leading-snug text-ink-900 group-hover:text-brand-600">
          {corrida.name}
        </h3>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {corrida.race_type}
          </span>
          {corrida.distances.slice(0, 3).map((d) => (
            <span
              key={d}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
