import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductById } from "@/data/dogs";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    products.map((product) => ({ lang, id: product.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  return {
    title: `${product.name}（${product.category}）`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const product = getProductById(id);
  if (!product) notFound();

  const dict = await getDictionary(lang as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "JPY",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href={`/${lang}/products`}
          className="text-sm text-amber-700 hover:text-amber-800"
        >
          {dict.products.backToList}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-amber-50 flex items-center justify-center text-8xl">
            {product.category === "Tシャツ"
              ? "👕"
              : product.category === "パーカー"
                ? "🧥"
                : product.category === "レインコート"
                  ? "🌧️"
                  : product.category === "ワンピース"
                    ? "👗"
                    : product.category === "コスプレ"
                      ? "🎭"
                      : "🧣"}
          </div>

          <div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              {product.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-amber-700">
              &yen;{product.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-400">
                {dict.products.taxIncluded}
              </span>
            </p>

            <div className="mt-6 space-y-3">
              <InfoRow
                label={dict.products.sizeLabel}
                value={product.sizes.join(" / ")}
              />
              <InfoRow
                label={dict.products.color}
                value={product.colors.join("、")}
              />
              <InfoRow
                label={dict.products.targetBreeds}
                value={product.targetBreeds.join("、")}
              />
              <InfoRow
                label={dict.products.stock}
                value={
                  product.inStock
                    ? dict.products.inStock
                    : dict.products.outOfStock
                }
              />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            <Link
              href={`/${lang}/contact?product=${product.name}`}
              className="mt-8 block rounded-lg bg-amber-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              {dict.products.inquire}
            </Link>

            <p className="mt-3 text-center text-xs text-gray-400">
              {dict.products.freeShipping}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center border-b border-amber-50 pb-2">
      <span className="w-24 text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
