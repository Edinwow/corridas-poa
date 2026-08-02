import Link from "next/link";

const MENSAGENS: Record<string, { titulo: string; texto: string }> = {
  aprovado: {
    titulo: "Pagamento aprovado! 🎉",
    texto:
      "Seu destaque foi ativado automaticamente e já está valendo no site. Pode levar até 1 minuto para aparecer.",
  },
  pendente: {
    titulo: "Pagamento em processamento",
    texto:
      "Assim que o pagamento (ex: boleto ou Pix) for confirmado pelo Mercado Pago, o destaque é ativado automaticamente — sem precisar fazer nada.",
  },
  falha: {
    titulo: "Não foi possível concluir o pagamento",
    texto: "Você pode tentar novamente na página da sua corrida.",
  },
};

export default function ObrigadoPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const info = MENSAGENS[searchParams.status ?? "pendente"] ?? MENSAGENS.pendente;

  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-ink-900">{info.titulo}</h1>
      <p className="mt-3 max-w-md text-slate-600">{info.texto}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Voltar para o site
      </Link>
    </div>
  );
}
