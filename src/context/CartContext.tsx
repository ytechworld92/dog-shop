"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  image_urls: string[];
  category: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  favorites: string[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedFavs = localStorage.getItem("favorites");
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addToCart(product: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFavorite,
        isFavorite,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
