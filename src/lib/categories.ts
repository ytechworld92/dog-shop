// Google翻訳で誤訳されるカテゴリだけ上書き
const overrides: Record<string, Record<string, string>> = {
  "ワンピース": { en: "Dress", ko: "원피스", es: "Vestido" },
};

export function localizeCategory(category: string, lang: string): string {
  if (lang === "ja") return category;
  return overrides[category]?.[lang] ?? category;
}
