import RaceForm from "@/components/RaceForm";

export default function CadastrarPage() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-ink-900">
        Cadastre sua corrida gratuitamente
      </h1>
      <p className="mb-8 text-[15px] font-medium text-ink-900/45">
        Preencha os dados abaixo. A publicação é automática — sua corrida aparece no site
        assim que você enviar o formulário, sem espera de aprovação manual.
      </p>
      <RaceForm />
    </div>
  );
}
