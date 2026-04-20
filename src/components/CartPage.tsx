"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  lang: string;
  dict: Dictionary;
};

export function CartPage({ lang, dict }: Props) {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="text-5xl">🛒</p>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            カートは空です
          </p>
          <p className="mt-1 text-sm text-gray-500">
            商品を追加してください
          </p>
          <Link
            href={`/${lang}/products`}
            className="mt-6 inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
          >
            {dict.nav.products}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">カート</h1>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <Link href={`/${lang}/products/${item.id}`}>
                {item.image_urls?.length > 0 ? (
                  <img
                    src={item.image_urls[0]}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-amber-50 text-3xl">
                    👕
                  </div>
                )}
              </Link>

              <div className="flex-1">
                <Link
                  href={`/${lang}/products/${item.id}`}
                  className="font-semibold text-gray-900 hover:text-amber-700"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-amber-700 notranslate">
                  {formatPrice(item.price, lang)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-bold text-gray-900 notranslate">
                {formatPrice(item.price * item.quantity, lang)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">合計</span>
            <span className="text-2xl font-bold text-amber-700 notranslate">
              {formatPrice(cartTotal, lang)}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={`/${lang}/contact`}
              className="flex-1 rounded-lg bg-amber-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-amber-700"
            >
              購入手続きへ
            </Link>
            <button
              onClick={clearCart}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
            >
              カートを空にする
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
