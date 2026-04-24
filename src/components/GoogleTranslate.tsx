"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (config: object, id: string) => void;
      };
    };
  }
}

export function GoogleTranslate({ lang }: { lang: string }) {
  useEffect(() => {
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

  useEffect(() => {
    const targetLang = lang;
    let cancelled = false;

    const applyLang = (select: HTMLSelectElement) => {
      if (select.value === targetLang) return;
      select.value = targetLang;
      select.dispatchEvent(new Event("change"));
    };

    const tryImmediate = () => {
      const select = document.querySelector(
        ".goog-te-combo",
      ) as HTMLSelectElement | null;
      if (select) {
        applyLang(select);
        return true;
      }
      return false;
    };

    if (tryImmediate()) return;

    // Watch for the Google Translate select element to appear
    const observer = new MutationObserver(() => {
      if (cancelled) return;
      const select = document.querySelector(
        ".goog-te-combo",
      ) as HTMLSelectElement | null;
      if (select) {
        applyLang(select);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [lang]);

  return <div id="google_translate_element" className="hidden" />;
}
