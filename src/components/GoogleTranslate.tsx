"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (config: object, id: string) => void } };
  }
}

const langMap: Record<string, string> = {
  ja: "ja",
  en: "en",
  ko: "ko",
  es: "es",
};

export function GoogleTranslate({ lang }: { lang: string }) {
  useEffect(() => {
    // Skip if already loaded
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        {
          pageLanguage: "ja",
          includedLanguages: "ja,en,ko,es",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Auto-trigger translation when lang changes
  useEffect(() => {
    const targetLang = langMap[lang] ?? "ja";

    const trySetLang = () => {
      const select = document.querySelector(
        ".goog-te-combo",
      ) as HTMLSelectElement | null;
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event("change"));
      }
    };

    // Wait for Google Translate to load
    const timer = setTimeout(trySetLang, 1500);
    return () => clearTimeout(timer);
  }, [lang]);

  return <div id="google_translate_element" className="hidden" />;
}
