/** Rótulos das categorias de projeto (o banco guarda em inglês). */
const CATEGORY_PT: Record<string, string> = {
  Film: "Filme",
  Brand: "Marca",
  Documentary: "Documentário",
  Editorial: "Editorial",
  Fashion: "Moda",
  Social: "Social",
};

export function categoryLabel(category: string, lang: "pt" | "en"): string {
  return lang === "en" ? category : CATEGORY_PT[category] ?? category;
}
