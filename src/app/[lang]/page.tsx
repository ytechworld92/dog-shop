import Link from "next/link";
import { notFound } from "next/navigation";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/DogCard";
import { HomeTrustRow } from "@/components/HomeTrustRow";
import { HomeFeatures } from "@/components/HomeFeatures";
import { HomeReviews } from "@/components/HomeReviews";
import { HomeFAQ } from "@/components/HomeFAQ";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-light via-beige to-rose-light/50 px-4 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-rose-soft blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-beige-warm blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-soft bg-white/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-rose-deep backdrop-blur-sm">
            ✨ Dog Fashion Boutique
          </span>
          <h1 className="mt-6 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {dict.hero.title1}
            <span className="text-rose-deep">{dict.hero.highlight}</span>
            {dict.hero.title2}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-muted">
            {dict.hero.description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/products`}
              className="rounded-full bg-gradient-to-r from-rose to-rose-deep px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {dict.hero.cta} →
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="rounded-full border border-rose-soft bg-white px-8 py-3.5 text-sm font-semibold text-rose-deep transition-all hover:bg-rose-light"
            >
              {dict.hero.contact}
            </Link>
          </div>
        </div>
      </section>

      <HomeTrustRow />

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
            Pick Up
          </p>
          <h2 className="mt-2 text-2xl font-medium text-foreground">
            {dict.featured.title}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {dict.featured.subtitle}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang as Locale}
              dict={dict}
              isNew={i === 0}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center gap-2 rounded-full border border-rose-soft px-8 py-3 text-sm font-medium text-rose-deep transition-all hover:bg-rose-light"
          >
            {dict.featured.viewAll}
          </Link>
        </div>
      </section>

      <HomeFeatures />
      <HomeReviews />
      <HomeFAQ />
    </main>
  );
}
