import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { criarPreferenciaPagamento } from "@/lib/mercadopago";
import { PLANOS, PlanoTipo } from "@/lib/types";

/**
 * Inicia o checkout de um plano pago (Destaque ou Premium) para uma corrida.
 * Cria a preferência no Mercado Pago e devolve a URL de pagamento.
 * A confirmação e ativação do plano acontecem sozinhas via webhook
 * (app/api/webhooks/mercadopago/route.ts) quando o pagamento é aprovado.
 */
export async function POST(req: NextRequest) {
  const { raceId, plan } = (await req.json()) as { raceId: string; plan: PlanoTipo };

  if (!raceId || !["destaque", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: corrida, error } = await admin
    .from("races")
    .select("id, name")
    .eq("id", raceId)
    .maybeSingle();

  if (error || !corrida) {
    return NextResponse.json({ error: "Corrida não encontrada." }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const planoInfo = PLANOS.find((p) => p.id === plan)!;

  let preference;
  try {
    preference = await criarPreferenciaPagamento({
      raceId,
      raceName: corrida.name,
      plano: plan,
      siteUrl,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Pagamentos ainda não configurados. Veja o guia de configuração (Mercado Pago)." },
      { status: 500 }
    );
  }

  await admin.from("payments").insert({
    race_id: raceId,
    plan,
    amount: planoInfo.preco,
    mp_preference_id: preference.id,
    status: "pending",
  });

  return NextResponse.json({ checkoutUrl: preference.init_point });
}
