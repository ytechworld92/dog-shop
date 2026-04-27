import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

const paymentLabels = ["VISA", "Mastercard", "JCB", "AMEX", "Apple Pay"];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.09z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="mt-auto bg-gradient-to-b from-rose-light/30 to-beige/40">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              <span className="text-rose-deep">✿</span> {dict.site.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {dict.footer.description1}
              <br />
              {dict.footer.description2}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-soft text-rose-deep transition-colors hover:bg-rose-light"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-soft text-rose-deep transition-colors hover:bg-rose-light"
              >
                <TikTokIcon />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-soft text-rose-deep transition-colors hover:bg-rose-light"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
              {dict.footer.menu}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>
                <Link
                  href={`/${lang}/products`}
                  className="transition-colors hover:text-rose-deep"
                >
                  {dict.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="transition-colors hover:text-rose-deep"
                >
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/cart`}
                  className="transition-colors hover:text-rose-deep"
                >
                  カート
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
              {dict.footer.shopInfo}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>{dict.footer.shipping}</li>
              <li>{dict.footer.speedShipping}</li>
              <li>{dict.footer.freeShipping}</li>
            </ul>
            <div className="mt-5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-soft">
                Payment
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {paymentLabels.map((p) => (
                  <span
                    key={p}
                    className="rounded border border-rose-soft/60 bg-white px-2 py-0.5 text-[10px] font-medium text-text-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-rose-soft/40 pt-6 text-center text-xs text-text-soft">
          &copy; 2026 {dict.site.name}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
