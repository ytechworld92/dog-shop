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
    sizes: string[];
  };
};

export function ProductActions({ product }: Props) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const fav = isFavorite(product.id);

  function handleAddToCart() {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    addToCart({
      ...product,
      id: selectedSize ? `${product.id}_${selectedSize}` : product.id,
      name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700">
            サイズを選択
            {sizeError && (
              <span className="ml-2 text-red-500">※ サイズを選んでください</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 text-gray-600 hover:border-amber-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

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
