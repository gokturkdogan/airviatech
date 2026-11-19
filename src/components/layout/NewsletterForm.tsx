"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

type Labels = { placeholder: string; button: string; sending: string; success: string; error: string };

export function NewsletterForm({ labels, locale }: { labels: Labels; locale: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email")?.toString() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-5 transition-colors focus-within:border-sky/50">
        <label htmlFor="newsletter-email" className="sr-only">
          {labels.placeholder}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={labels.placeholder}
          onChange={() => state === "error" && setState("idle")}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-mist/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 font-display text-sm font-semibold text-ink-950 transition-colors hover:bg-snow disabled:opacity-60"
        >
          {state === "sending" ? labels.sending : labels.button}
          <Icon name="arrowRight" className="size-4" />
        </button>
      </div>
      <p aria-live="polite" className={`mt-3 min-h-5 pl-5 text-xs ${state === "error" ? "text-coral-soft" : "text-sky-soft"}`}>
        {state === "done" ? labels.success : state === "error" ? labels.error : ""}
      </p>
    </form>
  );
}
