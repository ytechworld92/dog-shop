const overrides: Record<string, Record<string, string>> = {
  "Tシャツ": { en: "T-Shirt", ko: "티셔츠", es: "Camiseta" },
  "パーカー": { en: "Hoodie", ko: "후드", es: "Sudadera" },
  "レインコート": { en: "Raincoat", ko: "레인코트", es: "Impermeable" },
  "ワンピース": { en: "Dress", ko: "원피스", es: "Vestido" },
  "コスプレ": { en: "Costume", ko: "코스프레", es: "Disfraz" },
  "防寒着": { en: "Winter Coat", ko: "방한복", es: "Abrigo" },
};

export function localizeCategory(category: string, lang: string): string {
  if (lang === "ja") return category;
  return overrides[category]?.[lang] ?? category;
}
