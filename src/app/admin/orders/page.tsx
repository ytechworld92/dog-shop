"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import Link from "next/link";

type Order = {
  id: string;
  created: number;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  items: {
    description: string | null;
    quantity: number | null;
    amount: number | null;
  }[];
  payment_status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    } else if (res.status === 401) {
      setError("認証が切れています。管理画面から再ログインしてください。");
    } else {
      const data = await res.json();
      setError(data.error ?? "取得失敗");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function formatAmount(amount: number, currency: string) {
    const zeroDec = ["jpy", "krw"];
    const value = zeroDec.includes(currency.toLowerCase())
      ? amount
      : amount / 100;
    return `${currency.toUpperCase()} ${value.toLocaleString()}`;
  }

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🧾 注文一覧</h1>
          <Link
            href="/admin"
            className="text-[13px] text-gray-600 hover:text-amber-700"
          >
            ← 商品管理に戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders === null && !error && (
          <p className="text-center text-sm text-gray-500">読み込み中...</p>
        )}

        {orders?.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-4xl">🧾</p>
            <p className="mt-3 text-sm text-gray-600">
              まだ注文がありません
            </p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">日時</th>
                  <th className="px-4 py-3 font-medium">顧客</th>
                  <th className="px-4 py-3 font-medium">金額</th>
                  <th className="px-4 py-3 font-medium">状態</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setExpanded(expanded === order.id ? null : order.id)
                      }
                    >
                      <td className="px-4 py-3 font-mono text-gray-700">
                        {formatDate(order.created)}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {order.customer_name ?? "-"}
                        <br />
                        <span className="text-xs text-gray-500">
                          {order.customer_email ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        {formatAmount(order.amount_total, order.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                          支払済
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        {expanded === order.id ? "▲" : "▼"}
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                商品
                              </h3>
                              <ul className="mt-2 space-y-1 text-[13px]">
                                {order.items.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {item.description} × {item.quantity}
                                    </span>
                                    <span className="font-mono text-gray-600">
                                      {formatAmount(
                                        item.amount ?? 0,
                                        order.currency,
                                      )}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                配送先
                              </h3>
                              {order.shipping_address ? (
                                <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
                                  〒{order.shipping_address.postal_code ?? "-"}
                                  <br />
                                  {order.shipping_address.state}{" "}
                                  {order.shipping_address.city}
                                  <br />
                                  {order.shipping_address.line1}
                                  {order.shipping_address.line2 && (
                                    <>
                                      <br />
                                      {order.shipping_address.line2}
                                    </>
                                  )}
                                  <br />
                                  <span className="text-gray-500">
                                    {order.shipping_address.country}
                                  </span>
                                </p>
                              ) : (
                                <p className="mt-2 text-[13px] text-gray-500">
                                  未入力
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <a
                              href={`https://dashboard.stripe.com/test/payments/${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-blue-600 hover:underline"
                            >
                              Stripe ダッシュボードで開く ↗
                            </a>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
