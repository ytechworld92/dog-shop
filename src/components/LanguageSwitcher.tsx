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
    <select
      value={lang}
      onChange={handleChange}
      aria-label="Language"
      className="rounded-full border border-beige bg-white px-3 py-1.5 text-xs text-text-muted focus:border-accent focus:outline-none"
    >
      {(Object.keys(localeLabels) as Locale[]).map((locale) => (
        <option key={locale} value={locale}>
          {localeLabels[locale]}
        </option>
      ))}
    </select>
  );
}
