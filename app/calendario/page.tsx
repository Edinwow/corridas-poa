import { buscarCorridas } from "@/lib/queries";
import RaceCalendar from "@/components/RaceCalendar";
import AdSlot from "@/components/AdSlot";
import { TAG_COLORS } from "@/lib/theme";

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
      <h1 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-ink-900">
        Calendário de corridas
      </h1>
      <p className="mb-4 text-[15px] font-medium text-ink-900/45">
        Clique em um dia para ver as corridas disponíveis.
      </p>
      <div className="mb-6 flex flex-wrap gap-3">
        {Object.entries(TAG_COLORS).map(([tipo, cor]) => (
          <span key={tipo} className="flex items-center gap-1.5 text-[12px] font-bold text-ink-900/55">
            <span className={`h-2 w-2 rounded-full ${cor.dot}`} />
            {tipo}
          </span>
        ))}
      </div>
      <RaceCalendar corridas={corridas} />
      <div className="mt-8">
        <AdSlot formato="leaderboard" />
      </div>
    </div>
  );
}
