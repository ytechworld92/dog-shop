"use client";

import { useState } from "react";

const faqs = [
  {
    q: "サイズの選び方がわかりません。",
    a: "商品ページに各サイズの実寸サイズと推奨体重を記載しています。胴回り・首回り・背丈を測ってお選びください。サイズ相談はお問い合わせフォームからお気軽にどうぞ。",
  },
  {
    q: "洗濯はどのようにすればいいですか？",
    a: "ほとんどの商品が洗濯機で丸洗い可能です。デリケートな素材は手洗いを推奨しています。各商品ページの洗濯表示をご確認ください。",
  },
  {
    q: "返品・交換はできますか？",
    a: "商品到着後14日以内であれば、未使用・未洗濯のものに限り返品・交換が可能です。サイズ違いや初期不良の場合はお気軽にご連絡ください。",
  },
  {
    q: "安全性は大丈夫ですか？",
    a: "肌に優しいコットンやオーガニック素材を使用し、ペットが噛んでも安全な縫製を心がけています。第三者機関による品質検査も実施しています。",
  },
  {
    q: "海外への発送はしていますか？",
    a: "アメリカ、韓国、スペイン、その他主要国への発送に対応しています。送料は地域によって異なります。",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-rose-light/30 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-medium text-foreground">
            よくあるご質問
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-rose-soft/40 bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-rose-light/30"
              >
                <span className="text-sm font-medium text-foreground">
                  {faq.q}
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-light text-rose-deep">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="border-t border-rose-soft/30 bg-rose-light/20 px-5 py-4">
                  <p className="text-xs leading-relaxed text-text-muted">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
