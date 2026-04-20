"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    image_urls: string[];
    category: string;
  };
};

export function ProductActions({ product }: Props) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const fav = isFavorite(product.id);

  function handleAddToCart() {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="mt-8 space-y-3">
      <button
        onClick={handleAddToCart}
        className="w-full rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
      >
        {addedToCart ? "✓ カートに追加しました" : "カートに入れる"}
      </button>
      <button
        onClick={() => toggleFavorite(product.id)}
        className={`w-full rounded-lg border px-6 py-3 text-sm font-semibold transition-colors ${
          fav
            ? "border-pink-300 bg-pink-50 text-pink-600"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        {fav ? "♥ お気に入り済み" : "♡ お気に入りに追加"}
      </button>
    </div>
  );
}
