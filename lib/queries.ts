import { supabasePublic } from "./supabase";
import { Corrida } from "./types";

export interface FiltrosCorrida {
  q?: string;
  zone?: string;
  type?: string;
  distance?: string;
  period?: string; // dias a partir de hoje: "30" | "90" | "180"
}

/** Busca corridas publicadas, já ordenadas para priorizar planos pagos e depois por data. */
export async function buscarCorridas(filtros: FiltrosCorrida = {}): Promise<Corrida[]> {
  const supabase = supabasePublic();
  let query = supabase
    .from("races")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: true });

  if (filtros.q) {
    query = query.ilike("name", `%${filtros.q}%`);
  }
  if (filtros.zone) {
    query = query.eq("city_zone", filtros.zone);
  }
  if (filtros.type) {
    query = query.eq("race_type", filtros.type);
  }
  if (filtros.distance) {
    query = query.contains("distances", [filtros.distance]);
  }
  if (filtros.period) {
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + parseInt(filtros.period, 10));
    query = query
      .gte("date", hoje.toISOString().slice(0, 10))
      .lte("date", limite.toISOString().slice(0, 10));
  }

  const { data, error } = await query;
  if (error) throw error;

  const lista = (data ?? []) as Corrida[];

  // Prioriza premium > destaque > free, e dentro do mesmo plano, por peso e data.
  const peso = { premium: 2, destaque: 1, free: 0 } as const;
  return lista.sort((a, b) => {
    const diffPlano = peso[b.plan] - peso[a.plan];
    if (diffPlano !== 0) return diffPlano;
    if (b.highlight_weight !== a.highlight_weight) {
      return b.highlight_weight - a.highlight_weight;
    }
    return a.date.localeCompare(b.date);
  });
}

export async function buscarCorridaPorSlug(slug: string): Promise<Corrida | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("races")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data as Corrida | null;
}

export async function buscarCorridaPorId(id: string): Promise<Corrida | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("races")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Corrida | null;
}

export async function buscarDestaques(): Promise<Corrida[]> {
  const todas = await buscarCorridas();
  return todas.filter((c) => c.plan !== "free").slice(0, 6);
}
