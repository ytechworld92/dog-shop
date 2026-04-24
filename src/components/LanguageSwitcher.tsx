"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/app/[lang]/dictionaries";

const localeLabels: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
  es: "Español",
};

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="notranslate flex items-center gap-1.5 rounded-full border border-beige bg-white pl-3 pr-1 text-xs text-text-muted">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
      <select
        value={lang}
        onChange={handleChange}
        aria-label="Language"
        translate="no"
        className="notranslate cursor-pointer appearance-none bg-transparent py-1.5 pr-2 text-xs focus:outline-none"
      >
        {(Object.keys(localeLabels) as Locale[]).map((locale) => (
          <option key={locale} value={locale} translate="no">
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
