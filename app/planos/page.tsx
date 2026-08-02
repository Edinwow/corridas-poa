import { PLANOS } from "@/lib/types";
import PlanCard from "@/components/PlanCard";
import Link from "next/link";

export default function PlanosPage() {
  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide2 text-brand-600">
          Planos para organizadores
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tightest text-ink-900">
          Dê mais visibilidade à sua corrida
        </h1>
        <p className="mt-4 text-[15px] font-medium text-ink-900/45">
          Cadastro sempre gratuito. Se quiser aparecer na frente de quem está organizando
          uma corrida na mesma data e região, escolha um plano pago — ativado
          automaticamente após o pagamento.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {PLANOS.map((plano) => (
          <PlanCard key={plano.id} plano={plano} />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-sm font-medium text-ink-900/45">
          Já tem uma corrida cadastrada? Acesse a página do seu evento e clique em
          &quot;Comprar Destaque&quot; ou &quot;Comprar Premium&quot;. Ainda não cadastrou?
        </p>
        <Link href="/cadastrar" className="btn-primary mt-5 inline-flex">
          Cadastrar corrida gratuitamente
        </Link>
      </div>
    </div>
  );
}
