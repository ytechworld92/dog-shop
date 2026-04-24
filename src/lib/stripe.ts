import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const currencyByLang: Record<string, string> = {
  ja: "jpy",
  en: "usd",
  ko: "krw",
  es: "usd",
};

const rateByLang: Record<string, number> = {
  ja: 1,
  en: 0.01,
  ko: 10,
  es: 0.01,
};

export function stripeUnit(yenPrice: number, lang: string): number {
  const rate = rateByLang[lang] ?? 1;
  const converted = yenPrice * rate;
  const currency = currencyByLang[lang] ?? "jpy";
  // JPY and KRW are zero-decimal in Stripe, USD is in cents
  if (currency === "jpy" || currency === "krw") {
    return Math.round(converted);
  }
  return Math.round(converted * 100);
}

export function stripeCurrency(lang: string): string {
  return currencyByLang[lang] ?? "jpy";
}
