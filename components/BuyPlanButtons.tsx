"use client";

import { useState } from "react";
import { PlanoTipo } from "@/lib/types";
import { PLAN_LABELS } from "@/lib/theme";

export default function BuyPlanButtons({ raceId }: { raceId: string }) {
  const [carregando, setCarregando] = useState<PlanoTipo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function comprar(plano: PlanoTipo) {
    setErro(null);
    setCarregando(plano);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raceId, plan: plano }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar pagamento.");
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setErro(err.message);
      setCarregando(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {erro && <p className="text-xs font-medium text-red-600">{erro}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => comprar("destaque")}
          disabled={carregando !== null}
          className="rounded-full border border-ink-900/15 px-3.5 py-2 text-[12px] font-bold text-ink-900/60 transition hover:border-ink-900/40 hover:text-ink-900 disabled:opacity-60"
        >
          {carregando === "destaque" ? "Redirecionando..." : `Ativar ${PLAN_LABELS.destaque} — R$ 59`}
        </button>
        <button
          onClick={() => comprar("premium")}
          disabled={carregando !== null}
          className="rounded-full border border-ink-900/15 px-3.5 py-2 text-[12px] font-bold text-ink-900/60 transition hover:border-ink-900/40 hover:text-ink-900 disabled:opacity-60"
        >
          {carregando === "premium" ? "Redirecionando..." : `Ativar ${PLAN_LABELS.premium} — R$ 149`}
        </button>
      </div>
      <p className="text-[11px] font-medium text-ink-900/35">
        Pagamento via Mercado Pago. Ativação automática após aprovação.
      </p>
    </div>
  );
}
