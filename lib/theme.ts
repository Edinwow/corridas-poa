import { TipoCorrida } from "./types";

/**
 * Paleta por tipo de corrida — inspirada em apps de corrida modernos
 * (cada categoria tem uma cor de identificação, usada na barra lateral
 * do card, nas bolinhas do calendário e nas etiquetas de filtro).
 */
export const TAG_COLORS: Record<
  TipoCorrida,
  { bar: string; dot: string; soft: string; text: string }
> = {
  Rua: {
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    soft: "bg-blue-50",
    text: "text-blue-600",
  },
  Trilha: {
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50",
    text: "text-emerald-600",
  },
  Noturna: {
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    soft: "bg-violet-50",
    text: "text-violet-600",
  },
  Infantil: {
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    soft: "bg-amber-50",
    text: "text-amber-600",
  },
  Virtual: {
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    soft: "bg-teal-50",
    text: "text-teal-600",
  },
};

/** Gradientes vivos por tipo de corrida — usados no card grande de destaque. */
export const TAG_GRADIENTS: Record<TipoCorrida, string> = {
  Rua: "from-blue-600 via-blue-600 to-indigo-700",
  Trilha: "from-emerald-600 via-emerald-600 to-teal-700",
  Noturna: "from-violet-600 via-purple-600 to-fuchsia-700",
  Infantil: "from-amber-500 via-orange-500 to-rose-600",
  Virtual: "from-teal-500 via-cyan-500 to-sky-600",
};
