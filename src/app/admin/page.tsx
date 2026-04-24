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
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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

  async function reorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    if (toIndex < 0 || toIndex >= products.length) return;

    const reordered = [...products];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Optimistic UI update
    setProducts(reordered);

    // Sequentially update display_order to avoid race conditions
    const total = reordered.length;
    for (let i = 0; i < reordered.length; i++) {
      await fetch(`/api/admin/products/${reordered[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: total - i }),
      });
    }

    fetchProducts();
  }

  function moveItem(index: number, direction: "up" | "down") {
    reorder(index, direction === "up" ? index - 1 : index + 1);
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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">🐾 商品管理</h1>
            <a
              href="/admin/orders"
              className="text-[13px] text-gray-600 hover:text-amber-700"
            >
              🧾 注文一覧
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PreviewLinks />
            <button
              onClick={startNew}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              + 新規追加
            </button>
          </div>
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
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) reorder(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-opacity ${
                dragIndex === index ? "opacity-40" : ""
              }`}
            >
              <div
                className="cursor-grab text-gray-300 active:cursor-grabbing"
                title="ドラッグして並び替え"
              >
                ⋮⋮
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="rounded border border-gray-200 px-1 text-[10px] text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                  aria-label="上へ"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === products.length - 1}
                  className="rounded border border-gray-200 px-1 text-[10px] text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                  aria-label="下へ"
                >
                  ▼
                </button>
              </div>
              {product.image_urls?.length > 0 ? (
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-50 text-xl">
                  👕
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13px] font-medium text-gray-900">
                    {product.name}
                  </span>
                  <span className="shrink-0 whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="shrink-0 whitespace-nowrap rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                      人気
                    </span>
                  )}
                  {!product.in_stock && (
                    <span className="shrink-0 whitespace-nowrap rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                      品切れ
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  <span className="font-mono">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <span className="mx-1.5 text-gray-300">·</span>
                  {product.sizes.join("/")}
                  <span className="mx-1.5 text-gray-300">·</span>
                  画像 {product.image_urls?.length ?? 0}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <a
                  href={`/ja/products/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-gray-200 px-2 py-1 text-[12px] text-gray-600 hover:bg-gray-50"
                  title="表示"
                >
                  ↗
                </a>
                <button
                  onClick={() => startEdit(product)}
                  className="rounded border border-gray-200 px-2.5 py-1 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded border border-red-200 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50"
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

function PreviewLinks() {
  const pages = [
    { label: "トップ", path: "/ja" },
    { label: "商品一覧", path: "/ja/products" },
    { label: "カート", path: "/ja/cart" },
    { label: "お問い合わせ", path: "/ja/contact" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
      <span className="px-2 text-xs font-medium text-gray-500">
        プレビュー:
      </span>
      {pages.map((p) => (
        <a
          key={p.path}
          href={p.path}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded px-2 py-1 text-xs text-gray-700 hover:bg-white hover:text-amber-700"
        >
          {p.label} ↗
        </a>
      ))}
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
