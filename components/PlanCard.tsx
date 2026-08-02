import { Plano } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";

export default function PlanCard({ plano }: { plano: Plano }) {
  return (
    <div
      className={`flex flex-col rounded-xl2 border bg-white p-6 shadow-card ${
        plano.destaque ? "border-brand-500 ring-2 ring-brand-500/20" : "border-slate-200"
      }`}
    >
      {plano.destaque && (
        <span className="mb-3 w-fit rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
          Mais escolhido
        </span>
      )}
      <h3 className="font-display text-xl font-extrabold text-ink-900">{plano.nome}</h3>
      <p className="mt-1 text-sm text-slate-500">{plano.descricao}</p>
      <p className="mt-4 font-display text-3xl font-extrabold text-ink-900">
        {plano.preco === 0 ? "Grátis" : formatarPreco(plano.preco)}
        {plano.preco > 0 && (
          <span className="text-sm font-medium text-slate-400"> / evento</span>
        )}
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-slate-600">
        {plano.beneficios.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-500">✓</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
