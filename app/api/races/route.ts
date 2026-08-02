import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const ZONAS = [
  "Centro Histórico",
  "Zona Norte",
  "Zona Sul",
  "Zona Leste",
  "Orla do Guaíba",
  "Região Metropolitana",
];
const TIPOS = ["Rua", "Trilha", "Noturna", "Infantil", "Virtual"];

/**
 * Cadastro público de corridas — 100% automático, sem revisão manual.
 * Validações simples aqui fazem o papel de "moderação":
 * - campos obrigatórios presentes
 * - data não pode ser no passado
 * - honeypot (campo escondido) precisa estar vazio → senão é bot
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.website_confirmacao) {
    // Bot preencheu o campo escondido — finge sucesso pra não dar dica ao bot.
    return NextResponse.json({ slug: "ok" }, { status: 200 });
  }

  const obrigatorios = [
    "name",
    "description",
    "organizer_name",
    "organizer_email",
    "date",
    "city_zone",
    "location",
    "race_type",
  ];
  for (const campo of obrigatorios) {
    if (!body[campo] || String(body[campo]).trim() === "") {
      return NextResponse.json(
        { error: `Campo obrigatório faltando: ${campo}` },
        { status: 400 }
      );
    }
  }

  if (!ZONAS.includes(body.city_zone)) {
    return NextResponse.json({ error: "Região inválida." }, { status: 400 });
  }
  if (!TIPOS.includes(body.race_type)) {
    return NextResponse.json({ error: "Tipo de corrida inválido." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.organizer_email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const hoje = new Date().toISOString().slice(0, 10);
  if (body.date < hoje) {
    return NextResponse.json(
      { error: "A data da corrida não pode estar no passado." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.distances) || body.distances.length === 0) {
    return NextResponse.json(
      { error: "Informe ao menos uma distância." },
      { status: 400 }
    );
  }

  const slugBase = slugify(body.name, body.date);
  const admin = supabaseAdmin();

  const { data, error } = await admin
    .from("races")
    .insert({
      slug: slugBase,
      name: body.name,
      description: body.description,
      organizer_name: body.organizer_name,
      organizer_email: body.organizer_email,
      date: body.date,
      time: body.time || null,
      city_zone: body.city_zone,
      location: body.location,
      distances: body.distances,
      race_type: body.race_type,
      price_from: body.price_from ?? null,
      registration_url: body.registration_url || null,
      website: body.website || null,
      instagram: body.instagram || null,
      plan: "free",
      status: "published", // publicação automática, sem revisão manual
    })
    .select("slug")
    .single();

  if (error) {
    // slug duplicado (mesmo nome + mesma data cadastrados 2x)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Já existe uma corrida com esse nome nessa data." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erro ao salvar corrida." }, { status: 500 });
  }

  return NextResponse.json({ slug: data.slug }, { status: 201 });
}
