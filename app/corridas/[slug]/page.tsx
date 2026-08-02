import { notFound } from "next/navigation";
import Image from "next/image";
import { buscarCorridaPorSlug } from "@/lib/queries";
import { formatarData, formatarPreco } from "@/lib/utils";
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

  return (
    <div className="container-app grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
      <article>
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl2 bg-slate-100">
          {corrida.image_url ? (
            <Image src={corrida.image_url} alt={corrida.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🏃</div>
          )}
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          {corrida.plan === "premium" && <span className="badge-premium">Premium</span>}
          {corrida.plan === "destaque" && <span className="badge-destaque">Destaque</span>}
        </div>

        <h1 className="font-display text-3xl font-extrabold text-ink-900">{corrida.name}</h1>
        <p className="mt-2 text-slate-600">{corrida.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl2 border border-slate-200 bg-white p-5 text-sm sm:grid-cols-4">
          <Info label="Data" valor={formatarData(corrida.date)} />
          <Info label="Horário" valor={corrida.time ?? "A definir"} />
          <Info label="Região" valor={corrida.city_zone} />
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
            className="mt-6 inline-block rounded-lg bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            Inscreva-se nesta corrida ↗
          </a>
        )}

        <div className="mt-10">
          <AdSlot formato="leaderboard" />
        </div>
      </article>

      <aside className="flex flex-col gap-6">
        <div className="rounded-xl2 border border-slate-200 bg-white p-5">
          <h3 className="mb-3 font-display text-sm font-bold text-ink-900">
            É o organizador desta corrida?
          </h3>
          <BuyPlanButtons raceId={corrida.id} />
        </div>
        <AdSlot formato="retangulo" />
      </aside>
    </div>
  );
}

function Info({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-semibold text-ink-900">{valor}</p>
    </div>
  );
}
