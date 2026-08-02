import { notFound } from "next/navigation";
import Image from "next/image";
import { buscarCorridaPorSlug } from "@/lib/queries";
import { formatarData, formatarPreco } from "@/lib/utils";
import { TAG_COLORS, PLAN_LABELS } from "@/lib/theme";
import AdSlot from "@/components/AdSlot";
import BuyPlanButtons from "@/components/BuyPlanButtons";

export const revalidate = 60;

export default async function CorridaPage({
  params,
}: {
  params: { slug: string };
}) {
  const corrida = await buscarCorridaPorSlug(params.slug).catch(() => null);
  if (!corrida) notFound();
  const tag = TAG_COLORS[corrida.race_type];

  return (
    <div className="container-app grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
      <article>
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl2 bg-slate-100">
          {corrida.image_url ? (
            <Image src={corrida.image_url} alt={corrida.name} fill className="object-cover" />
          ) : (
            <div className={`flex h-full items-center justify-center text-6xl ${tag.soft}`}>🏃</div>
          )}
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {corrida.plan === "premium" && <span className="badge-premium">{PLAN_LABELS.premium}</span>}
          {corrida.plan === "destaque" && <span className="badge-destaque">{PLAN_LABELS.destaque}</span>}
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tag.soft} ${tag.text}`}>
            {corrida.race_type}
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tightest text-ink-900">
          {corrida.name}
        </h1>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink-900/55">
          {corrida.description}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-5 rounded-xl2 border border-ink-900/[0.06] bg-white p-6 sm:grid-cols-4">
          <Info label="Data" valor={formatarData(corrida.date)} />
          <Info label="Horário" valor={corrida.time ? corrida.time.slice(0, 5) : "A definir"} />
          <Info label="Tipo" valor={corrida.race_type} />
          <Info label="Local" valor={corrida.location} />
          <Info label="Distâncias" valor={corrida.distances.join(", ")} />
          <Info
            label="Inscrição a partir de"
            valor={corrida.price_from ? formatarPreco(corrida.price_from) : "Grátis / a definir"}
          />
          <Info label="Organizador" valor={corrida.organizer_name} />
        </div>

        {corrida.registration_url && (
          <a
            href={corrida.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent mt-7 inline-flex"
          >
            Inscreva-se nesta corrida ↗
          </a>
        )}

        <div className="mt-10">
          <AdSlot formato="leaderboard" />
        </div>
      </article>

      <aside className="flex flex-col gap-6">
        <AdSlot formato="retangulo" />
        <div className="rounded-xl2 bg-ink-900/[0.025] p-4">
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide2 text-ink-900/40">
            É o organizador?
          </h3>
          <BuyPlanButtons raceId={corrida.id} />
        </div>
      </aside>
    </div>
  );
}

function Info({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="stat-label">{label}</p>
      <p className="mt-1 text-[15px] font-bold text-ink-900">{valor}</p>
    </div>
  );
}
