import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="mt-auto border-t border-beige bg-gradient-to-b from-beige/30 to-background">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              <span className="text-accent">✿</span> {dict.site.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {dict.footer.description1}
              <br />
              {dict.footer.description2}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              {dict.footer.menu}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>
                <Link
                  href={`/${lang}/products`}
                  className="transition-colors hover:text-accent"
                >
                  {dict.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="transition-colors hover:text-accent"
                >
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              {dict.footer.shopInfo}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>{dict.footer.shipping}</li>
              <li>{dict.footer.speedShipping}</li>
              <li>{dict.footer.freeShipping}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-beige pt-6 text-center text-xs text-text-muted">
          &copy; 2026 {dict.site.name}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
