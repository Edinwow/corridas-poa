import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { PLANOS, PlanoTipo } from "./types";

function getClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não configurado nas variáveis de ambiente."
    );
  }
  return new MercadoPagoConfig({ accessToken: token });
}

/**
 * Cria uma "preferência" de pagamento no Mercado Pago para um evento + plano.
 * O comprador é redirecionado para o checkout do Mercado Pago (Pix, boleto ou cartão).
 * Depois de pago, o Mercado Pago chama automaticamente nosso webhook
 * (/api/webhooks/mercadopago) para confirmar e ativar o plano — sem intervenção manual.
 */
export async function criarPreferenciaPagamento(params: {
  raceId: string;
  raceName: string;
  plano: PlanoTipo;
  siteUrl: string;
}) {
  const plano = PLANOS.find((p) => p.id === params.plano);
  if (!plano || plano.preco <= 0) {
    throw new Error("Plano inválido para pagamento.");
  }

  const client = getClient();
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: `${params.raceId}-${params.plano}`,
          title: `Plano ${plano.nome} — ${params.raceName}`,
          quantity: 1,
          unit_price: plano.preco,
          currency_id: "BRL",
        },
      ],
      metadata: {
        race_id: params.raceId,
        plan: params.plano,
      },
      back_urls: {
        success: `${params.siteUrl}/corridas/obrigado?status=aprovado`,
        pending: `${params.siteUrl}/corridas/obrigado?status=pendente`,
        failure: `${params.siteUrl}/corridas/obrigado?status=falha`,
      },
      auto_return: "approved",
      notification_url: `${params.siteUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "CORRIDASPOA",
    },
  });

  return result;
}

/** Busca os detalhes de um pagamento aprovado, usado dentro do webhook. */
export async function buscarPagamento(paymentId: string) {
  const client = getClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
