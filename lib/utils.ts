export function slugify(text: string, date?: string) {
  const base = text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = date ? `-${date}` : "";
  return `${base}${suffix}`;
}

export function formatarData(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-");
  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  return `${dia} ${meses[parseInt(mes, 10) - 1]} ${ano}`;
}

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function diasAteEvento(dataISO: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(dataISO + "T00:00:00");
  const diff = Math.round((data.getTime() - hoje.getTime()) / 86400000);
  return diff;
}
