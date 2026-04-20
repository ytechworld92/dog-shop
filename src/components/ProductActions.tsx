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
    <div className="mt-8 space-y-5">
      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground">
            サイズを選択
            {sizeError && (
              <span className="ml-2 text-xs text-red-400">
                ※ サイズを選んでください
              </span>
            )}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                  selectedSize === size
                    ? "border-accent bg-accent-light text-accent"
                    : "border-beige text-text-muted hover:border-accent/50"
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
        className="w-full rounded-full bg-gradient-to-r from-accent to-accent-gold px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        {addedToCart ? "✓ カートに追加しました" : "カートに入れる"}
      </button>
      <button
        onClick={() => toggleFavorite(product.id)}
        className={`w-full rounded-full border px-6 py-3.5 text-sm font-semibold transition-all ${
          fav
            ? "border-pink bg-pink-light text-pink"
            : "border-beige text-text-muted hover:border-pink hover:bg-pink-light"
        }`}
      >
        {fav ? "♥ お気に入り済み" : "♡ お気に入りに追加"}
      </button>
    </div>
  );
}
