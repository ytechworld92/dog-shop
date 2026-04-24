const overrides: Record<string, Record<string, string>> = {
  "Tシャツ": { en: "T-Shirt", ko: "티셔츠", es: "Camiseta" },
  "パーカー": { en: "Hoodie", ko: "후드", es: "Sudadera" },
  "レインコート": { en: "Raincoat", ko: "레인코트", es: "Impermeable" },
  "ワンピース": { en: "Dress", ko: "원피스", es: "Vestido" },
  "コスプレ": { en: "Costume", ko: "코스프레", es: "Disfraz" },
  "防寒着": { en: "Winter Coat", ko: "방한복", es: "Abrigo" },
  "おでかけグッズ": {
    en: "Travel Goods",
    ko: "외출용품",
    es: "Accesorios de Paseo",
  },
  "アクセサリー": { en: "Accessories", ko: "액세서리", es: "Accesorios" },
  "ベッド・クッション": {
    en: "Bed & Cushion",
    ko: "침대·쿠션",
    es: "Cama y Cojín",
  },
  "おもちゃ": { en: "Toys", ko: "장난감", es: "Juguetes" },
  "首輪・リード": {
    en: "Collars & Leashes",
    ko: "목줄·리드",
    es: "Collares y Correas",
  },
  "食器・フードボウル": {
    en: "Bowls & Feeders",
    ko: "식기·푸드볼",
    es: "Comederos",
  },
};

export function localizeCategory(category: string, lang: string): string {
  if (lang === "ja") return category;
  return overrides[category]?.[lang] ?? category;
}
