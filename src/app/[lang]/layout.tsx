import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { CartProvider } from "@/context/CartContext";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "./dictionaries";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <CartProvider>
      <GoogleTranslate lang={lang} />
      <Header lang={lang as Locale} dict={dict} />
      {children}
      <Footer lang={lang as Locale} dict={dict} />
    </CartProvider>
  );
}
