import Link from "next/link";
import { notFound } from "next/navigation";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/DogCard";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-b from-amber-50 to-white px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {dict.hero.title1}
          <span className="text-amber-600">{dict.hero.highlight}</span>
          {dict.hero.title2}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          {dict.hero.description}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${lang}/products`}
            className="rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            {dict.hero.cta}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="rounded-lg border border-amber-300 bg-white px-6 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50"
          >
            {dict.hero.contact}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">
          {dict.featured.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{dict.featured.subtitle}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang as Locale}
              dict={dict}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${lang}/products`}
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            {dict.featured.viewAll}
          </Link>
        </div>
      </section>

      <section className="bg-amber-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            {dict.whyUs.title}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl">✂️</div>
              <h3 className="mt-3 font-semibold text-gray-800">
                {dict.whyUs.reason1Title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {dict.whyUs.reason1Desc}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl">🧵</div>
              <h3 className="mt-3 font-semibold text-gray-800">
                {dict.whyUs.reason2Title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {dict.whyUs.reason2Desc}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl">🚚</div>
              <h3 className="mt-3 font-semibold text-gray-800">
                {dict.whyUs.reason3Title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {dict.whyUs.reason3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
