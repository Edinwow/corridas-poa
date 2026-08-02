import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buscarPagamento } from "@/lib/mercadopago";

/**
 * Webhook do Mercado Pago — chamado automaticamente por ELES (não pelo navegador
 * do usuário) sempre que o status de um pagamento muda.
 *
 * Configure a URL pública deste endpoint em:
 * Mercado Pago > Suas integrações > sua aplicação > Webhooks
 * URL: https://SEU-SITE.vercel.app/api/webhooks/mercadopago
 *
 * É esse endpoint que ativa o plano pago automaticamente, sem
 * nenhuma ação manual sua.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // O Mercado Pago manda notificações de vários tipos; só nos importa "payment".
    const paymentId: string | undefined =
      body?.data?.id ?? req.nextUrl.searchParams.get("data.id") ?? undefined;
    const tipo: string | undefined = body?.type ?? req.nextUrl.searchParams.get("type") ?? undefined;

    if (tipo !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const pagamento = await buscarPagamento(paymentId);
    const status = pagamento.status; // "approved" | "pending" | "rejected" | ...
    const raceId = pagamento.metadata?.race_id as string | undefined;
    const plan = pagamento.metadata?.plan as "destaque" | "premium" | undefined;

    if (!raceId || !plan) {
      return NextResponse.json({ received: true });
    }

    const admin = supabaseAdmin();

    await admin
      .from("payments")
      .update({ status: status === "approved" ? "approved" : status, mp_payment_id: paymentId })
      .eq("race_id", raceId)
      .eq("plan", plan)
      .is("mp_payment_id", null);

    if (status === "approved") {
      // Ativa o plano automaticamente. "plan_active_until" = data da corrida
      // (o card some da seção de destaque sozinho depois do evento).
      const { data: corrida } = await admin
        .from("races")
        .select("date, highlight_weight")
        .eq("id", raceId)
        .maybeSingle();

      await admin
        .from("races")
        .update({
          plan,
          plan_active_until: corrida?.date ?? null,
          highlight_weight: plan === "premium" ? 100 : 50,
        })
        .eq("id", raceId);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    // Responder 200 mesmo em erro evita que o Mercado Pago fique reenviando
    // indefinidamente; o erro real fica nos logs da Vercel para você investigar.
    console.error("Erro no webhook do Mercado Pago:", e);
    return NextResponse.json({ received: true });
  }
}

// O Mercado Pago também pode chamar via GET em alguns testes de validação.
export async function GET() {
  return NextResponse.json({ ok: true });
}
