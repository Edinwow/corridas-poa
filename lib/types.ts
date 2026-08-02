export type PlanoTipo = "free" | "destaque" | "premium";

export type ZonaPOA =
  | "Centro Histórico"
  | "Zona Norte"
  | "Zona Sul"
  | "Zona Leste"
  | "Orla do Guaíba"
  | "Região Metropolitana";

export type TipoCorrida =
  | "Rua"
  | "Trilha"
  | "Noturna"
  | "Infantil"
  | "Virtual";

export interface Corrida {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  description: string;
  organizer_name: string;
  organizer_email: string;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM
  city_zone: ZonaPOA;
  location: string;
  distances: string[];
  race_type: TipoCorrida;
  price_from: number | null;
  registration_url: string | null;
  image_url: string | null;
  plan: PlanoTipo;
  plan_active_until: string | null;
  highlight_weight: number;
  status: "published" | "pending" | "rejected";
  website: string | null;
  instagram: string | null;
}

export interface Plano {
  id: PlanoTipo;
  nome: string;
  preco: number;
  descricao: string;
  beneficios: string[];
  destaque?: boolean;
}

export const PLANOS: Plano[] = [
  {
    id: "free",
    nome: "Gratuito",
    preco: 0,
    descricao: "Para qualquer organizador colocar sua corrida no ar.",
    beneficios: [
      "Página própria do evento",
      "Aparece nos filtros e na busca",
      "Aparece na visualização de calendário",
      "Link para inscrição externa",
      "Publicação automática, sem espera",
    ],
  },
  {
    id: "destaque",
    nome: "Destaque",
    preco: 59,
    descricao: "Para quem quer sair na frente dos concorrentes na mesma data.",
    beneficios: [
      "Tudo do plano Gratuito",
      "Selo \"Destaque\" no card do evento",
      "Aparece na seção \"Destaques\" da home",
      "Prioridade no topo dos resultados de busca e filtros",
      "Card maior, com imagem em destaque",
      "Ativação automática após pagamento (Pix, boleto ou cartão)",
    ],
    destaque: true,
  },
  {
    id: "premium",
    nome: "Premium",
    preco: 149,
    descricao: "Visibilidade máxima até a data da corrida.",
    beneficios: [
      "Tudo do plano Destaque",
      "Banner rotativo na home (topo do site)",
      "Fixado no topo da sua zona/região no calendário",
      "Selo \"Organizador Premium\" no perfil",
      "Imagem de capa em tamanho grande na página do evento",
      "Ativação automática após pagamento (Pix, boleto ou cartão)",
    ],
  },
];
