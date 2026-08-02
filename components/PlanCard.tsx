import { Plano } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";

export default function PlanCard({ plano }: { plano: Plano }) {
  const destaque = plano.destaque;
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl3 p-7 ${
        destaque
          ? "bg-ink-900 text-white shadow-cardHover"
          : "border border-ink-900/[0.08] bg-white shadow-card"
      }`}
    >
      {destaque && (
        <>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-2xl" />
        </>
      )}
      {destaque && (
        <span className="mb-4 w-fit rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Mais escolhido
        </span>
      )}
      <h3 className={`font-display text-xl font-extrabold ${destaque ? "text-white" : "text-ink-900"}`}>
        {plano.nome}
      </h3>
      <p className={`mt-1.5 text-sm font-medium ${destaque ? "text-white/60" : "text-ink-900/50"}`}>
        {plano.descricao}
      </p>
      <p className={`mt-5 font-display text-4xl font-extrabold tracking-tightest ${destaque ? "text-white" : "text-ink-900"}`}>
        {plano.preco === 0 ? "Grátis" : formatarPreco(plano.preco)}
        {plano.preco > 0 && (
          <span className={`text-sm font-bold ${destaque ? "text-white/40" : "text-ink-900/35"}`}> /evento</span>
        )}
      </p>
      <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm font-medium">
        {plano.beneficios.map((b) => (
          <li key={b} className={`flex items-start gap-2.5 ${destaque ? "text-white/80" : "text-ink-900/70"}`}>
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                destaque ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600"
              }`}
            >
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
