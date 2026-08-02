import { buscarCorridas } from "@/lib/queries";
import RaceCalendar from "@/components/RaceCalendar";
import AdSlot from "@/components/AdSlot";

export const revalidate = 60;

export default async function CalendarioPage() {
  let corridas: Awaited<ReturnType<typeof buscarCorridas>> = [];
  try {
    corridas = await buscarCorridas();
  } catch {
    corridas = [];
  }

  return (
    <div className="container-app py-10">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink-900">
        Calendário de corridas
      </h1>
      <p className="mb-6 text-slate-600">
        Clique em um dia para ver as corridas disponíveis. Bolinha verde = Destaque,
        laranja = Premium.
      </p>
      <RaceCalendar corridas={corridas} />
      <div className="mt-8">
        <AdSlot formato="leaderboard" />
      </div>
    </div>
  );
}
