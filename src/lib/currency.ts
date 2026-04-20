const rates: Record<string, { rate: number; symbol: string; decimals: number }> = {
  ja: { rate: 1, symbol: "¥", decimals: 0 },
  en: { rate: 0.01, symbol: "$", decimals: 2 },
  ko: { rate: 10, symbol: "₩", decimals: 0 },
  es: { rate: 0.01, symbol: "$", decimals: 2 },
};

export function formatPrice(yenPrice: number, lang: string): string {
  const config = rates[lang] ?? rates.ja;
  const converted = yenPrice * config.rate;

  if (config.decimals === 0) {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${converted.toFixed(config.decimals)}`;
}
