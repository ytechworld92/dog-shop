"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
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
  image_urls: string[];
  display_order: number;
};

const CATEGORIES = [
  "Tシャツ",
  "パーカー",
  "レインコート",
  "ワンピース",
  "コスプレ",
  "防寒着",
  "おでかけグッズ",
  "アクセサリー",
  "ベッド・クッション",
  "おもちゃ",
  "首輪・リード",
  "食器・フードボウル",
];

const emptyForm = {
  name: "",
  category: "Tシャツ",
  priceText: "",
  description: "",
  sizes: [] as string[],
  colors: [] as string[],
  target_breeds: [] as string[],
  featured: false,
  in_stock: true,
  image_urls: [] as string[],
};

type FormState = typeof emptyForm;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      setProducts(await res.json());
    }
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setError("");
    } else {
      setError("パスワードが違います");
    }
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      priceText: String(product.price),
      description: product.description,
      sizes: product.sizes,
      colors: product.colors,
      target_breeds: product.target_breeds,
      featured: product.featured,
      in_stock: product.in_stock,
      image_urls: product.image_urls ?? [],
    });
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function cancelForm() {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.priceText) || 0,
      description: form.description,
      sizes: form.sizes,
      colors: form.colors,
      target_breeds: form.target_breeds,
      featured: form.featured,
      in_stock: form.in_stock,
      image_urls: form.image_urls,
    };

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    cancelForm();
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const current = products[index];
    const neighbor = products[targetIndex];

    // Swap display_order values
    await Promise.all([
      fetch(`/api/admin/products/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: neighbor.display_order }),
      }),
      fetch(`/api/admin/products/${neighbor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: current.display_order }),
      }),
    ]);

    fetchProducts();
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
          <p className="mt-1 text-sm text-gray-500">
            パスワードを入力してください
          </p>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
            placeholder="パスワード"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            ログイン
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🐾 商品管理</h1>
          <button
            onClick={startNew}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            + 新規追加
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              {editing ? "商品を編集" : "新規商品"}
            </h2>
            <ProductForm
              form={form}
              setForm={setForm}
              onSubmit={handleSave}
              saving={saving}
              onCancel={cancelForm}
            />
          </div>
        )}

        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="rounded border border-gray-200 px-1.5 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="上へ"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === products.length - 1}
                    className="rounded border border-gray-200 px-1.5 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="下へ"
                  >
                    ▼
                  </button>
                </div>
                {product.image_urls?.length > 0 ? (
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-2xl">
                    👕
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {product.name}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        おすすめ
                      </span>
                    )}
                    {!product.in_stock && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                        品切れ
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    ¥{product.price.toLocaleString()} / サイズ:{" "}
                    {product.sizes.join(", ")} / 画像: {product.image_urls?.length ?? 0}枚
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ProductForm({
  form,
  setForm,
  onSubmit,
  saving,
  onCancel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  onCancel: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { contentType: file.type });

      if (!error) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      } else {
        alert(`アップロード失敗: ${error.message}`);
      }
    }

    setForm({ ...form, image_urls: [...form.image_urls, ...newUrls] });
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setForm({
      ...form,
      image_urls: form.image_urls.filter((_, i) => i !== index),
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            商品名
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            カテゴリ
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            価格（円）
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={form.priceText}
            onChange={(e) => {
              // Convert full-width digits to half-width, then strip non-digits
              const halfWidth = e.target.value.replace(/[０-９]/g, (c) =>
                String.fromCharCode(c.charCodeAt(0) - 0xfee0),
              );
              setForm({
                ...form,
                priceText: halfWidth.replace(/[^0-9]/g, ""),
              });
            }}
            placeholder="2480"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            サイズ（カンマ区切り）
          </label>
          <input
            type="text"
            value={form.sizes.join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                sizes: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="XS,S,M,L"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            カラー（カンマ区切り）
          </label>
          <input
            type="text"
            value={form.colors.join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                colors: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="レッド,ブルー"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            対象犬種（カンマ区切り）
          </label>
          <input
            type="text"
            value={form.target_breeds.join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                target_breeds: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="トイプードル,チワワ"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Multiple images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          商品画像（複数可）
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.image_urls.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`画像 ${i + 1}`}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
              >
                x
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-400 hover:text-amber-600">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? "..." : "+"}
          </label>
        </div>
        {uploading && (
          <p className="mt-1 text-xs text-amber-600">アップロード中...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          説明文
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-gray-300"
          />
          おすすめに表示
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.in_stock}
            onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
            className="rounded border-gray-300"
          />
          在庫あり
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
