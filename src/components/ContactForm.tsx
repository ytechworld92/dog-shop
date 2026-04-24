"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type Props = {
  texts: {
    name: string;
    email: string;
    phone: string;
    message: string;
    placeholder: string;
    submit: string;
    submitting: string;
    success: string;
    successDetail: string;
    newInquiry: string;
    required: string;
  };
};

export function ContactForm({ texts }: Props) {
  const [state, setState] = useState<FormState>("idle");

  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "送信に失敗しました");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMsg("送信に失敗しました");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">{texts.success}</p>
        <p className="mt-2 text-sm text-green-600">{texts.successDetail}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 text-sm text-green-700 underline"
        >
          {texts.newInquiry}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {texts.name}{" "}
          <span className="text-red-500">{texts.required}</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {texts.email}{" "}
          <span className="text-red-500">{texts.required}</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>



      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          {texts.message}{" "}
          <span className="text-red-500">{texts.required}</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          placeholder={texts.placeholder}
        />
      </div>

      {state === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
      >
        {state === "submitting" ? texts.submitting : texts.submit}
      </button>
    </form>
  );
}
