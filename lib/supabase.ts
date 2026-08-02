import { createClient } from "@supabase/supabase-js";

// Cliente para uso no navegador / componentes de servidor "de leitura".
// Usa a chave pública (anon) — respeita as políticas de segurança (RLS)
// definidas em supabase/schema.sql (só permite LEITURA de corridas publicadas).
export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Cliente "admin", usado SOMENTE dentro de API routes (nunca no navegador).
// A service role key ignora as políticas de RLS, por isso toda validação
// de dados precisa acontecer no código da API antes de gravar no banco.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin não configurado. Defina SUPABASE_SERVICE_ROLE_KEY no servidor."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
