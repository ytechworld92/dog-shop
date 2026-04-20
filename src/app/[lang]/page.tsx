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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-light via-beige to-accent-light px-4 py-24 text-center sm:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-pink blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-accent-light blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
            Dog Fashion
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {dict.hero.title1}
            <span className="text-accent">{dict.hero.highlight}</span>
            {dict.hero.title2}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted">
            {dict.hero.description}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href={`/${lang}/products`}
              className="rounded-full bg-gradient-to-r from-accent to-accent-gold px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {dict.hero.cta}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="rounded-full border border-accent/30 bg-white/60 px-8 py-3.5 text-sm font-semibold text-accent backdrop-blur-sm transition-all hover:bg-white"
            >
              {dict.hero.contact}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            Pick Up
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            {dict.featured.title}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {dict.featured.subtitle}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang as Locale}
              dict={dict}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/${lang}/products`}
            className="inline-block rounded-full border border-accent/30 px-8 py-3 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white"
          >
            {dict.featured.viewAll}
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-gradient-to-b from-beige/50 to-background px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Our Promise
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              {dict.whyUs.title}
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-2xl">
                ✂️
              </div>
              <h3 className="mt-5 font-semibold text-foreground">
                {dict.whyUs.reason1Title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {dict.whyUs.reason1Desc}
              </p>
            </div>
            <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-light text-2xl">
                🧵
              </div>
              <h3 className="mt-5 font-semibold text-foreground">
                {dict.whyUs.reason2Title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {dict.whyUs.reason2Desc}
              </p>
            </div>
            <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-beige text-2xl">
                🚚
              </div>
              <h3 className="mt-5 font-semibold text-foreground">
                {dict.whyUs.reason3Title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {dict.whyUs.reason3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
