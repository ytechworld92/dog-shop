import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata = {
  title: "ご注文ありがとうございます | Order Complete",
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang } = await params;
  const { session_id } = await searchParams;
  if (!hasLocale(lang)) notFound();

  return (
    <main className="flex-1">
      <ClearCartOnMount />
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-6xl">🎉</p>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          ご注文ありがとうございます
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          決済が完了しました。確認メールをお送りしましたのでご確認ください。
        </p>
        {session_id && (
          <p className="mt-4 text-xs text-text-muted">
            注文番号: <span className="font-mono">{session_id.slice(-12)}</span>
          </p>
        )}
        <div className="mt-10 flex justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="rounded-full border border-accent/30 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            トップに戻る
          </Link>
          <Link
            href={`/${lang}/products`}
            className="rounded-full bg-gradient-to-r from-accent to-accent-gold px-6 py-3 text-sm font-semibold text-white shadow-md"
          >
            他の商品を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
