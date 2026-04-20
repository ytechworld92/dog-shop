import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { formatPrice } from "@/lib/currency";
import { localizeCategory } from "@/lib/categories";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
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

  const product = await getProductById(id);
  if (!product) notFound();

  const dict = await getDictionary(lang as Locale);

  const categoryEmoji: Record<string, string> = {
    "Tシャツ": "👕",
    "パーカー": "🧥",
    "レインコート": "🌧️",
    "ワンピース": "👗",
    "コスプレ": "🎭",
    "防寒着": "🧣",
  };

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
      availability: product.in_stock
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
          <ProductGallery
            images={product.image_urls?.length > 0 ? product.image_urls : product.image_url ? [product.image_url] : []}
            fallbackEmoji={categoryEmoji[product.category] ?? "👕"}
            name={product.name}
          />

          <div>
            <span className="notranslate rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              {localizeCategory(product.category, lang)}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-amber-700 notranslate">
              {formatPrice(product.price, lang)}
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
                value={product.target_breeds.join("、")}
              />
              <InfoRow
                label={dict.products.stock}
                value={
                  product.in_stock
                    ? dict.products.inStock
                    : dict.products.outOfStock
                }
              />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                image_urls: product.image_urls,
                category: product.category,
                sizes: product.sizes,
              }}
            />

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
