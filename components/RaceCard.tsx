import Link from "next/link";
import Image from "next/image";
import { Corrida } from "@/lib/types";
import { formatarData, diasAteEvento } from "@/lib/utils";
import { TAG_COLORS } from "@/lib/theme";

export default function RaceCard({ corrida }: { corrida: Corrida }) {
  const dias = diasAteEvento(corrida.date);
  const isDestaque = corrida.plan === "destaque";
  const isPremium = corrida.plan === "premium";
  const tag = TAG_COLORS[corrida.race_type];

  return (
    <Link
      href={`/corridas/${corrida.slug}`}
      className={`group flex overflow-hidden rounded-xl2 border border-ink-900/[0.06] bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover ${
        isPremium ? "ring-2 ring-amber-400/60" : isDestaque ? "ring-2 ring-brand-400/40" : ""
      }`}
    >
      {/* barra de categoria, como nos apps de treino */}
      <span className={`w-1.5 shrink-0 ${tag.bar}`} />

      <div className="flex flex-1 flex-col">
        <div className="relative h-36 w-full bg-slate-100">
          {corrida.image_url ? (
            <Image src={corrida.image_url} alt={corrida.name} fill className="object-cover" />
          ) : (
            <div className={`flex h-full w-full items-center justify-center text-3xl ${tag.soft}`}>
              🏃
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {isPremium && <span className="badge-premium">Premium</span>}
            {isDestaque && <span className="badge-destaque">Destaque</span>}
          </div>
          {dias >= 0 && dias <= 14 && (
            <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink-900 shadow-card">
              {dias === 0 ? "É hoje" : `${dias}d`}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="stat-label">{formatarData(corrida.date)}</span>
            <span className="stat-label">{corrida.city_zone}</span>
          </div>
          <h3 className="font-display text-[15px] font-extrabold leading-snug tracking-tight text-ink-900">
            {corrida.name}
          </h3>
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tag.soft} ${tag.text}`}>
              {corrida.race_type}
            </span>
            {corrida.distances.slice(0, 3).map((d) => (
              <span
                key={d}
                className="rounded-full bg-ink-900/[0.04] px-2.5 py-1 text-[11px] font-bold text-ink-900/60"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
