import Link from "next/link";
import type { Product } from "@/lib/products";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

const categoryEmoji: Record<string, string> = {
  "Tシャツ": "👕",
  "パーカー": "🧥",
  "レインコート": "🌧️",
  "ワンピース": "👗",
  "コスプレ": "🎭",
  "防寒着": "🧣",
};

type Props = {
  product: Product;
  lang: Locale;
  dict: Dictionary;
};

export function ProductCard({ product, lang, dict }: Props) {
  return (
    <Link
      href={`/${lang}/products/${product.id}`}
      className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-square bg-amber-50 flex items-center justify-center overflow-hidden">
        {product.image_urls?.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl">{categoryEmoji[product.category] ?? "👕"}</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-amber-700">
            {product.name}
          </h3>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            {product.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {dict.products.sizeLabel}: {product.sizes.join(" / ")}
        </p>
        <p className="mt-2 text-lg font-bold text-amber-700">
          &yen;{product.price.toLocaleString()}
          <span className="text-xs font-normal text-gray-400">
            {dict.products.taxIncluded}
          </span>
        </p>
      </div>
    </Link>
  );
}
