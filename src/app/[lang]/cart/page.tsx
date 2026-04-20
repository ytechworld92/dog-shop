import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { CartPage } from "@/components/CartPage";

export const metadata = { title: "カート | Cart" };

export default async function Cart({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return <CartPage lang={lang} dict={dict} />;
}
