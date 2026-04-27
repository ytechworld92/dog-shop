type Review = {
  rating: number;
  title: string;
  body: string;
  customer: string;
  dogBreed: string;
};

const reviews: Review[] = [
  {
    rating: 5,
    title: "安心してドライブできるように！",
    body: "固定がしっかりしていて、うちの子もリラックスしてくれました。買って本当に良かったです！",
    customer: "チョコちゃん",
    dogBreed: "トイプードル",
  },
  {
    rating: 5,
    title: "ふかふかで気持ちよさそう♪",
    body: "お出かけの時はいつもウトウトしていて、汚れても洗えるので清潔に使えて嬉しいです！",
    customer: "ルルちゃん",
    dogBreed: "マルチーズ",
  },
  {
    rating: 5,
    title: "デザインがとにかく可愛い♡",
    body: "シンプルでおしゃれなので車内のインテリアにも合います！お友達にも褒められました！",
    customer: "ももちゃん",
    dogBreed: "ミックス",
  },
];

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold-light">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 0 0-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z" />
    </svg>
  );
}

export function HomeReviews() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
            Customer Reviews
          </p>
          <h2 className="mt-2 text-2xl font-medium text-foreground">
            お客様の声
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <article
              key={i}
              className="rounded-2xl border border-rose-soft/40 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} />
                  ))}
                </div>
                <span className="text-xs font-medium text-text-muted">
                  {review.rating}.0
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {review.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                {review.body}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-rose-soft/30 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-light text-base">
                  🐕
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {review.customer}
                  </p>
                  <p className="text-[10px] text-text-soft">
                    （{review.dogBreed}）
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
