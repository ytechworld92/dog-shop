"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { categories } from "@/data/dogs";

const sizes = ["XS", "S", "M", "L", "XL"];

type Props = {
  texts: {
    allCategories: string;
    size: string;
    priceRange: string;
  };
};

export function ProductFilter({ texts }: Props) {
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
        <option value="2000">~¥2,000</option>
        <option value="3000">~¥3,000</option>
        <option value="4000">~¥4,000</option>
        <option value="5000">~¥5,000</option>
      </select>
    </div>
  );
}
