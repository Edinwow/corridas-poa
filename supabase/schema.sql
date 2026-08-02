-- ============================================================
-- Corridas POA — schema do banco de dados (Supabase / Postgres)
--
-- COMO USAR:
-- 1. Crie um projeto gratuito em https://supabase.com
-- 2. Vá em "SQL Editor" (menu lateral) > "New query"
-- 3. Cole TODO este arquivo e clique em "Run"
-- Isso cria as tabelas, as regras de segurança (RLS) e alguns
-- eventos de EXEMPLO para você ver o site funcionando.
-- Depois é só apagar os exemplos pela própria tabela em
-- Supabase > Table Editor > races.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Tabela principal: corridas cadastradas
-- ------------------------------------------------------------
create table if not exists races (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  organizer_name text not null,
  organizer_email text not null,
  date date not null,
  time time,
  city_zone text not null check (
    city_zone in (
      'Centro Histórico',
      'Zona Norte',
      'Zona Sul',
      'Zona Leste',
      'Orla do Guaíba',
      'Região Metropolitana'
    )
  ),
  location text not null,
  distances text[] not null default '{}',
  race_type text not null check (
    race_type in ('Rua', 'Trilha', 'Noturna', 'Infantil', 'Virtual')
  ),
  price_from numeric,
  registration_url text,
  image_url text,
  plan text not null default 'free' check (plan in ('free', 'destaque', 'premium')),
  plan_active_until date,
  highlight_weight integer not null default 0,
  status text not null default 'published' check (status in ('published', 'pending', 'rejected')),
  website text,
  instagram text
);

create index if not exists idx_races_date on races (date);
create index if not exists idx_races_zone on races (city_zone);
create index if not exists idx_races_plan on races (plan);
create index if not exists idx_races_status on races (status);

-- ------------------------------------------------------------
-- Tabela de pagamentos (histórico de compras de planos pagos)
-- ------------------------------------------------------------
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  race_id uuid not null references races (id) on delete cascade,
  plan text not null check (plan in ('destaque', 'premium')),
  amount numeric not null,
  mp_preference_id text,
  mp_payment_id text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists idx_payments_race on payments (race_id);
create index if not exists idx_payments_mp_payment_id on payments (mp_payment_id);

-- ------------------------------------------------------------
-- Segurança (Row Level Security)
--
-- Regra: qualquer pessoa (visitante do site) pode LER apenas
-- corridas com status = 'published'. Nenhuma escrita é permitida
-- diretamente do navegador — todo INSERT/UPDATE acontece pelas
-- rotas de API do site (app/api/...), usando a chave "service role"
-- que só existe no servidor (nunca é exposta ao navegador).
-- Isso é o que torna o cadastro público seguro mesmo sendo automático.
-- ------------------------------------------------------------
alter table races enable row level security;
alter table payments enable row level security;

drop policy if exists "Leitura pública de corridas publicadas" on races;
create policy "Leitura pública de corridas publicadas"
  on races for select
  using (status = 'published');

-- Nenhuma policy de insert/update/delete é criada para o público:
-- por padrão, com RLS ativo, isso já bloqueia qualquer escrita
-- vinda do navegador. Só a service role key (usada nas API routes)
-- consegue escrever.

-- ------------------------------------------------------------
-- Dados de EXEMPLO — apague ou edite pelo Table Editor do Supabase
-- (datas fictícias no 2º semestre de 2026, ajuste para as datas reais)
-- ------------------------------------------------------------
insert into races (
  slug, name, description, organizer_name, organizer_email, date, time,
  city_zone, location, distances, race_type, price_from, registration_url,
  image_url, plan, plan_active_until, highlight_weight, status, website, instagram
) values
(
  'meia-maratona-de-porto-alegre-2026-09-20',
  'Meia Maratona de Porto Alegre',
  'Uma das provas mais tradicionais da cidade, com largada na Orla do Guaíba e percurso passando por pontos turísticos do Centro Histórico.',
  'Exemplo Sports', 'contato@exemplo.com', '2026-09-20', '07:00',
  'Orla do Guaíba', 'Parque Marinha do Brasil', array['5km','10km','21km'], 'Rua', 150,
  'https://exemplo.com/inscricao', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
  'premium', '2026-09-20', 100, 'published', 'https://exemplo.com', '@meiamaratonapoa'
),
(
  'circuito-das-estacoes-etapa-primavera-2026-10-04',
  'Circuito das Estações — Etapa Primavera',
  'Corrida sazonal que percorre a orla, com opções para toda a família, incluindo prova infantil.',
  'Estações Eventos', 'contato@estacoes.com', '2026-10-04', '08:00',
  'Zona Sul', 'Ipanema, Porto Alegre', array['5km','10km'], 'Rua', 90,
  'https://exemplo.com/circuito-estacoes', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200',
  'destaque', '2026-10-04', 50, 'published', 'https://exemplo.com', '@circuitodasestacoes'
),
(
  'corrida-noturna-redencao-2026-08-22',
  'Corrida Noturna do Parque da Redenção',
  'Prova noturna com trajeto iluminado dentro do Parque Farroupilha (Redenção), ideal para iniciantes.',
  'Night Run POA', 'contato@nightrun.com', '2026-08-22', '19:30',
  'Centro Histórico', 'Parque Farroupilha (Redenção)', array['5km'], 'Noturna', 60,
  'https://exemplo.com/noturna-redencao', null,
  'free', null, 0, 'published', null, '@nightrunpoa'
),
(
  'trilha-do-morro-santana-2026-11-08',
  'Trilha do Morro Santana',
  'Corrida de trilha com desnível técnico, passando pela maior área verde urbana de Porto Alegre.',
  'Trail Sul Clube', 'contato@trailsul.com', '2026-11-08', '08:30',
  'Zona Leste', 'Morro Santana', array['12km','21km'], 'Trilha', 120,
  'https://exemplo.com/trilha-morro-santana', null,
  'free', null, 0, 'published', 'https://exemplo.com', null
),
(
  'corrida-da-mulher-poa-2026-09-27',
  'Corrida e Caminhada da Mulher POA',
  'Evento em celebração ao público feminino, com corrida de 5km e caminhada de 3km.',
  'Vida Ativa Eventos', 'contato@vidaativa.com', '2026-09-27', '08:00',
  'Zona Norte', 'Parque Humaitá', array['3km','5km'], 'Rua', 70,
  'https://exemplo.com/corrida-mulher', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200',
  'destaque', '2026-09-27', 40, 'published', 'https://exemplo.com', '@corridadamulherpoa'
),
(
  'corrida-virtual-conecta-poa-2026-08-30',
  'Corrida Virtual Conecta POA',
  'Corrida virtual: percorra a distância escolhida onde estiver e registre pelo aplicativo parceiro.',
  'Conecta Run', 'contato@conectarun.com', '2026-08-30', null,
  'Região Metropolitana', 'Onde você estiver', array['5km','10km'], 'Virtual', 39,
  'https://exemplo.com/virtual-conecta', null,
  'free', null, 0, 'published', 'https://exemplo.com', null
)
on conflict (slug) do nothing;
