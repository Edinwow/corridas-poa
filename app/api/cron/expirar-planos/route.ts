import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Job diário e automático (agendado em vercel.json) que rebaixa para "free"
 * as corridas cujo plano pago já venceu (data do evento já passou).
 * Assim os planos pagos não ficam "grudados" para sempre depois do evento.
 *
 * A Vercel chama esta rota sozinha, todo dia, sem você precisar fazer nada.
 * Protegida por CRON_SECRET para que só a Vercel (ou você) consiga chamá-la.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const hoje = new Date().toISOString().slice(0, 10);

  const { data, error } = await admin
    .from("races")
    .update({ plan: "free", highlight_weight: 0 })
    .lt("plan_active_until", hoje)
    .neq("plan", "free")
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ atualizados: data?.length ?? 0 });
}
