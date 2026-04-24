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

function setGoogtransCookie(target: string) {
  const value = target === "ja" ? "" : `/ja/${target}`;
  const domain = window.location.hostname;
  // Set for current host
  document.cookie = `googtrans=${value};path=/`;
  // Set for parent domain (e.g., .vercel.app) so subdomains share
  const parts = domain.split(".");
  if (parts.length > 1) {
    const parentDomain = `.${parts.slice(-2).join(".")}`;
    document.cookie = `googtrans=${value};path=/;domain=${parentDomain}`;
  }
}

function getGoogtransCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function GoogleTranslate({ lang }: { lang: string }) {
  useEffect(() => {
    const desired = lang === "ja" ? "" : `/ja/${lang}`;
    const current = getGoogtransCookie();

    if (current !== desired) {
      setGoogtransCookie(lang);
      // Reload so Google Translate reads the new cookie from the start
      window.location.reload();
      return;
    }

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
  }, [lang]);

  return <div id="google_translate_element" className="hidden" />;
}
