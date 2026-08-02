# Corridas POA

Catálogo de corridas de rua de Porto Alegre. Next.js + Supabase + Mercado Pago, feito para rodar de graça na Vercel.

**Antes de mexer em código:** leia o documento "Guia de Publicação — Corridas POA" que acompanha este projeto. Ele explica passo a passo, sem jargão técnico, como colocar isso tudo no ar.

## Resumo técnico

- `app/` — páginas (Next.js App Router)
- `components/` — componentes de UI reutilizáveis
- `lib/` — conexão com Supabase, Mercado Pago, tipos e funções auxiliares
- `supabase/schema.sql` — script para criar as tabelas no Supabase (rodar uma vez)
- `.env.local.example` — modelo das variáveis de ambiente necessárias

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # depois preencha com suas chaves
npm run dev
```

Abra http://localhost:3000
