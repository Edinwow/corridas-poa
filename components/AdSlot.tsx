/**
 * Espaço reservado para anúncios (ex.: Google AdSense).
 *
 * Como ativar de verdade:
 * 1. Crie uma conta gratuita em https://adsense.google.com
 * 2. Depois de aprovado, o Google te dá um <script> e um bloco <ins class="adsbygoogle">.
 * 3. Substitua o conteúdo de dentro da div "ad-slot-inner" abaixo pelo bloco do AdSense,
 *    e adicione o script do AdSense em app/layout.tsx (dentro de <head>).
 *
 * Formatos sugeridos (não invasivos, tamanhos padrão do mercado):
 * - "leaderboard": 728x90 (desktop) — abaixo do cabeçalho e no rodapé
 * - "retangulo": 300x250 — barra lateral e entre resultados
 * - "mobile": 320x50 — versão mobile do leaderboard
 */
type Formato = "leaderboard" | "retangulo" | "mobile";

const DIMENSOES: Record<Formato, string> = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  retangulo: "h-[250px] w-[300px]",
  mobile: "h-[50px] w-[320px]",
};

export default function AdSlot({
  formato = "leaderboard",
  label = "Publicidade",
}: {
  formato?: Formato;
  label?: string;
}) {
  return (
    <div className="flex w-full justify-center py-2">
      <div
        className={`ad-slot-inner ${DIMENSOES[formato]} flex items-center justify-center rounded-2xl border-2 border-dashed border-ink-900/10 bg-ink-900/[0.02] text-[11px] font-bold uppercase tracking-wide2 text-ink-900/25`}
        data-ad-slot={formato}
      >
        {label}
      </div>
    </div>
  );
}
