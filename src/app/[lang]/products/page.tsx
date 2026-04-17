import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { filterProducts } from "@/data/dogs";
import { ProductCard } from "@/components/DogCard";
import { ProductFilter } from "@/components/DogFilter";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";

export const metadata: Metadata = {
  title: "商品一覧 | Products",
};

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const sp = await searchParams;

  const category = typeof sp.category === "string" ? sp.category : undefined;
  const size = typeof sp.size === "string" ? sp.size : undefined;
  const maxPrice =
    typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;

  const filteredProducts = filterProducts({ category, size, maxPrice });

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {dict.products.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {dict.products.subtitle}
        </p>

        <div className="mt-6">
          <Suspense fallback={null}>
            <ProductFilter
              texts={{
                allCategories: dict.products.allCategories,
                size: dict.products.size,
                priceRange: dict.products.priceRange,
              }}
            />
          </Suspense>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-4xl">👕</p>
            <p className="mt-2 text-gray-600">{dict.products.empty}</p>
            <p className="text-sm text-gray-400">{dict.products.emptyHint}</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang as Locale}
                dict={dict}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
