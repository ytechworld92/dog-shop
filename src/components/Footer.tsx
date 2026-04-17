import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="mt-auto border-t border-amber-100 bg-amber-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-amber-800">
              🐾 {dict.site.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {dict.footer.description1}
              <br />
              {dict.footer.description2}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{dict.footer.menu}</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                <Link
                  href={`/${lang}/products`}
                  className="hover:text-amber-700"
                >
                  {dict.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="hover:text-amber-700"
                >
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">
              {dict.footer.shopInfo}
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>{dict.footer.shipping}</li>
              <li>{dict.footer.freeShipping}</li>
              <li>{dict.footer.tel}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-amber-200 pt-4 text-center text-xs text-gray-500">
          &copy; 2026 {dict.site.name}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
