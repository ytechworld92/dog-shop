"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { categories } from "@/data/dogs";
import { formatPrice } from "@/lib/currency";

const sizes = ["XS", "S", "M", "L", "XL"];
const priceOptions = [2000, 3000, 4000, 5000];

type Props = {
  texts: {
    allCategories: string;
    size: string;
    priceRange: string;
  };
  lang: string;
};

export function ProductFilter({ texts, lang }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-text-muted focus:border-accent focus:outline-none"
        value={searchParams.get("category") ?? ""}
        onChange={(e) => updateFilter("category", e.target.value)}
      >
        <option value="">{texts.allCategories}</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-text-muted focus:border-accent focus:outline-none"
        value={searchParams.get("size") ?? ""}
        onChange={(e) => updateFilter("size", e.target.value)}
      >
        <option value="">{texts.size}</option>
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <select
        className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-text-muted focus:border-accent focus:outline-none"
        value={searchParams.get("maxPrice") ?? ""}
        onChange={(e) => updateFilter("maxPrice", e.target.value)}
      >
        <option value="">{texts.priceRange}</option>
        {priceOptions.map((price) => (
          <option key={price} value={price}>
            ~{formatPrice(price, lang)}
          </option>
        ))}
      </select>
    </div>
  );
}
