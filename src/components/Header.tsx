import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartIcon } from "./CartIcon";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Header({ lang, dict }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-beige bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:py-4">
        <Link
          href={`/${lang}`}
          className="shrink-0 text-lg font-bold tracking-tight text-foreground sm:text-xl"
        >
          <span className="text-accent">✿</span> {dict.site.name}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-3 text-xs font-medium sm:gap-5 sm:text-sm">
            <li>
              <Link
                href={`/${lang}/products`}
                className="whitespace-nowrap text-text-muted transition-colors hover:text-accent"
              >
                {dict.nav.products}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/contact`}
                className="whitespace-nowrap text-text-muted transition-colors hover:text-accent"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
          <CartIcon lang={lang} />
          <LanguageSwitcher lang={lang} />
        </div>
      </nav>
    </header>
  );
}
