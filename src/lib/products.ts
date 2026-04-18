import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes: string[];
  colors: string[];
  target_breeds: string[];
  featured: boolean;
  in_stock: boolean;
  image_url: string | null;
};

export async function getProducts(params?: {
  category?: string;
  size?: string;
  maxPrice?: number;
}): Promise<Product[]> {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (params?.category) {
    query = query.eq("category", params.category);
  }
  if (params?.maxPrice) {
    query = query.lte("price", params.maxPrice);
  }

  const { data } = await query;
  let results = (data ?? []) as Product[];

  if (params?.size) {
    results = results.filter((p) => p.sizes.includes(params.size!));
  }

  return results;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return data as Product | null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  return (data ?? []) as Product[];
}

export async function getCategories(): Promise<string[]> {
  const { data } = await supabase.from("products").select("category");
  const cats = [...new Set((data ?? []).map((d: { category: string }) => d.category))];
  return cats;
}
