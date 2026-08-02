import { PLANOS } from "@/lib/types";
import PlanCard from "@/components/PlanCard";
import Link from "next/link";

export default function PlanosPage() {
  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-900">
          Dê mais visibilidade à sua corrida
        </h1>
        <p className="mt-3 text-slate-600">
          Cadastro sempre gratuito. Se quiser aparecer na frente de quem está organizando
          uma corrida na mesma data e região, escolha um plano pago — ativado
          automaticamente após o pagamento.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
        {PLANOS.map((plano) => (
          <PlanCard key={plano.id} plano={plano} />
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-sm text-slate-500">
          Já tem uma corrida cadastrada? Acesse a página do seu evento e clique em
          &quot;Comprar Destaque&quot; ou &quot;Comprar Premium&quot;. Ainda não cadastrou?
        </p>
        <Link
          href="/cadastrar"
          className="mt-4 inline-block rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Cadastrar corrida gratuitamente
        </Link>
      </div>
    </div>
  );
}
