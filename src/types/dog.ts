export type Size = "XS" | "S" | "M" | "L" | "XL";

export type Category =
  | "Tシャツ"
  | "パーカー"
  | "レインコート"
  | "ワンピース"
  | "コスプレ"
  | "防寒着";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  images: string[];
  sizes: Size[];
  colors: string[];
  targetBreeds: string[];
  featured: boolean;
  inStock: boolean;
};

export type ProductFilterParams = {
  category?: string;
  maxPrice?: number;
  size?: Size;
};
