"use client";

import { useState } from "react";
import { PlanoTipo } from "@/lib/types";

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
    <div className="flex flex-col gap-2.5">
      {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
      <button
        onClick={() => comprar("destaque")}
        disabled={carregando !== null}
        className="btn-accent w-full disabled:opacity-60"
      >
        {carregando === "destaque" ? "Redirecionando..." : "Comprar Destaque — R$ 59"}
      </button>
      <button
        onClick={() => comprar("premium")}
        disabled={carregando !== null}
        className="btn-primary w-full disabled:opacity-60"
      >
        {carregando === "premium" ? "Redirecionando..." : "Comprar Premium — R$ 149"}
      </button>
      <p className="text-xs font-medium text-ink-900/35">
        Pagamento seguro via Mercado Pago (Pix, boleto ou cartão). O destaque é ativado
        automaticamente assim que o pagamento for aprovado.
      </p>
    </div>
  );
}
