"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZonaPOA, TipoCorrida } from "@/lib/types";

const ZONAS: ZonaPOA[] = [
  "Centro Histórico",
  "Zona Norte",
  "Zona Sul",
  "Zona Leste",
  "Orla do Guaíba",
  "Região Metropolitana",
];
const TIPOS: TipoCorrida[] = ["Rua", "Trilha", "Noturna", "Infantil", "Virtual"];

export default function RaceForm() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      organizer_name: form.get("organizer_name"),
      organizer_email: form.get("organizer_email"),
      date: form.get("date"),
      time: form.get("time") || null,
      city_zone: form.get("city_zone"),
      location: form.get("location"),
      distances: String(form.get("distances") || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      race_type: form.get("race_type"),
      price_from: form.get("price_from") ? Number(form.get("price_from")) : null,
      registration_url: form.get("registration_url") || null,
      website: form.get("website_url") || null,
      instagram: form.get("instagram") || null,
      // campo-armadilha anti-spam: deve continuar vazio (escondido via CSS para humanos)
      website_confirmacao: form.get("website_confirmacao"),
    };

    try {
      const res = await fetch("/api/races", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Não foi possível cadastrar a corrida.");
      }
      router.push(`/corridas/${data.slug}?novo=1`);
    } catch (err: any) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {erro && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</div>
      )}

      {/* honeypot: campo invisível para humanos, bots costumam preencher */}
      <input
        type="text"
        name="website_confirmacao"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <Campo label="Nome da corrida" name="name" required />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          name="description"
          required
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Seu nome / organização" name="organizer_name" required />
        <Campo label="Seu e-mail" name="organizer_email" type="email" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Data da corrida" name="date" type="date" required />
        <Campo label="Horário (opcional)" name="time" type="time" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Região de Porto Alegre</label>
          <select name="city_zone" required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {ZONAS.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tipo de corrida</label>
          <select name="race_type" required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <Campo label="Local de largada (endereço/ponto de referência)" name="location" required />
      <Campo label="Distâncias oferecidas (separe por vírgula, ex: 5km, 10km, 21km)" name="distances" required />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Valor da inscrição, a partir de (R$, opcional)" name="price_from" type="number" />
        <Campo label="Link de inscrição (opcional)" name="registration_url" type="url" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Site (opcional)" name="website_url" type="url" />
        <Campo label="Instagram (opcional, ex: @suacorrida)" name="instagram" />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {enviando ? "Publicando..." : "Publicar corrida gratuitamente"}
      </button>
      <p className="text-xs text-slate-400">
        A publicação é automática e imediata. Depois de cadastrada, você pode voltar aqui a
        qualquer momento e comprar um destaque para sua corrida na página de{" "}
        <a href="/planos" className="underline">planos</a>.
      </p>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
