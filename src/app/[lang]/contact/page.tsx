import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";

export const metadata: Metadata = {
  title: "お問い合わせ | Contact",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {dict.contact.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{dict.contact.subtitle}</p>

        <div className="mt-8">
          <ContactForm texts={dict.contact} />
        </div>

      </section>
    </main>
  );
}
