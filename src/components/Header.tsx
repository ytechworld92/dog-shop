import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Header({ lang, dict }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/${lang}`} className="text-xl font-bold text-amber-800">
          🐾 {dict.site.name}
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link
                href={`/${lang}/products`}
                className="text-gray-600 transition-colors hover:text-amber-700"
              >
                {dict.nav.products}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/contact`}
                className="text-gray-600 transition-colors hover:text-amber-700"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
          <LanguageSwitcher lang={lang} />
        </div>
      </nav>
    </header>
  );
}
