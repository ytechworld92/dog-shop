"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { formatPrice } from "@/lib/currency";
import { localizeCategory } from "@/lib/categories";
import { useCart } from "@/context/CartContext";

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
  isNew?: boolean;
};

export function ProductCard({ product, lang, dict, isNew }: Props) {
  const { toggleFavorite, isFavorite } = useCart();
  const fav = isFavorite(product.id);

  return (
    <div className="group relative">
      {/* Favorite button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Favorite"
      >
        {fav ? (
          <span className="text-pink">♥</span>
        ) : (
          <span className="text-text-muted">♡</span>
        )}
      </button>

      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {isNew && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
            New
          </span>
        )}
        {product.featured && !isNew && (
          <span className="rounded-full bg-accent-gold px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            人気
          </span>
        )}
      </div>

      <Link
        href={`/${lang}/products/${product.id}`}
        className="block overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden bg-beige">
          {product.image_urls?.length > 0 ? (
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl opacity-40">
                {categoryEmoji[product.category] ?? "👕"}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <span className="notranslate text-[11px] font-medium uppercase tracking-widest text-text-muted">
            {localizeCategory(product.category, lang)}
          </span>
          <h3 className="mt-1.5 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-3 text-lg font-bold tracking-tight text-accent notranslate">
            {formatPrice(product.price, lang)}
            <span className="ml-1 text-xs font-normal text-text-muted">
              {dict.products.taxIncluded}
            </span>
          </p>
          <p className="mt-1.5 text-[11px] text-text-muted">
            {product.sizes.join(" / ")}
          </p>
        </div>
      </Link>
    </div>
  );
}
