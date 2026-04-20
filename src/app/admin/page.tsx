"use client";

import { useState, useEffect, useCallback } from "react";

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
  image_url: string | null;
};

const CATEGORIES = [
  "Tシャツ",
  "パーカー",
  "レインコート",
  "ワンピース",
  "コスプレ",
  "防寒着",
];

const emptyProduct = {
  name: "",
  category: "Tシャツ",
  price: 0,
  description: "",
  sizes: [] as string[],
  colors: [] as string[],
  target_breeds: [] as string[],
  featured: false,
  in_stock: true,
  image_url: null as string | null,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
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
      price: product.price,
      description: product.description,
      sizes: product.sizes,
      colors: product.colors,
      target_breeds: product.target_breeds,
      featured: product.featured,
      in_stock: product.in_stock,
      image_url: product.image_url,
    });
  }

  function startNew() {
    setEditing(null);
    setForm(emptyProduct);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setForm(emptyProduct);
    setEditing(null);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;

    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
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
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
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
          <h1 className="text-xl font-bold text-gray-900">
            🐾 商品管理
          </h1>
          <button
            onClick={startNew}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            + 新規追加
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Form */}
        {(editing !== undefined || form.name !== "" || editing === null) &&
          form !== emptyProduct && (
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "商品を編集" : "新規商品"}
              </h2>
              <ProductForm
                form={form}
                setForm={setForm}
                onSubmit={handleSave}
                saving={saving}
                onCancel={() => {
                  setForm(emptyProduct);
                  setEditing(null);
                }}
              />
            </div>
          )}

        {/* Product list */}
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
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
                  {product.sizes.join(", ")}
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
  form: typeof emptyProduct;
  setForm: (f: typeof emptyProduct) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  onCancel: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      setForm({ ...form, image_url: url });
    }
    setUploading(false);
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
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
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
                sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
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
                colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
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
                target_breeds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            placeholder="トイプードル,チワワ"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          商品画像
        </label>
        <div className="mt-1 flex items-center gap-4">
          {form.image_url ? (
            <img
              src={form.image_url}
              alt="preview"
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-amber-50 text-3xl">
              👕
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="text-sm text-gray-600"
            />
            {uploading && (
              <p className="mt-1 text-xs text-amber-600">アップロード中...</p>
            )}
          </div>
        </div>
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
