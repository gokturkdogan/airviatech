"use client";

import { animate } from "animejs";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Labels = {
  title: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  topics: string[];
  message: string;
  consent: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  required: string;
};

const field =
  "peer w-full rounded-2xl border border-white/10 bg-ink-950/60 px-4 pb-2.5 pt-6 text-white outline-none transition-colors placeholder:text-transparent focus:border-sky/60 focus:bg-ink-950";
const label =
  "pointer-events-none absolute left-4 top-4 origin-left text-fog/60 transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-soft peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs";

export function ContactForm({ labels, locale }: { labels: Labels; locale: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");
  const [topic, setTopic] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setState("invalid");
      animate(form, { x: [0, -8, 8, -5, 5, 0], duration: 450, ease: "inOut(2)" });
      return;
    }
    setState("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, topic, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setTopic(null);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
      <h2 className="font-display text-2xl font-semibold text-white">{labels.title}</h2>

      <fieldset>
        <legend className="mb-3 text-sm text-fog/70">{labels.topic}</legend>
        <div className="flex flex-wrap gap-2">
          {labels.topics.map((t) => (
            <button
              type="button"
              key={t}
              aria-pressed={topic === t}
              onClick={() => setTopic((cur) => (cur === t ? null : t))}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                topic === t ? "border-sky bg-sky/15 text-white" : "border-white/10 text-fog/80 hover:border-white/25"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-name" name="name" required autoComplete="name" placeholder=" " className={field} />
          <label htmlFor="cf-name" className={label}>
            {labels.name} *
          </label>
        </div>
        <div className="relative">
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder=" " className={field} />
          <label htmlFor="cf-email" className={label}>
            {labels.email} *
          </label>
        </div>
        <div className="relative">
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder=" " className={field} />
          <label htmlFor="cf-phone" className={label}>
            {labels.phone}
          </label>
        </div>
        <div className="relative">
          <input id="cf-company" name="company" autoComplete="organization" placeholder=" " className={field} />
          <label htmlFor="cf-company" className={label}>
            {labels.company}
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea id="cf-message" name="message" required rows={5} placeholder=" " className={`${field} resize-none`} />
        <label htmlFor="cf-message" className={label}>
          {labels.message} *
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-fog/70">
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 accent-coral" />
        {labels.consent}
      </label>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <Button type="submit" disabled={state === "sending"} icon={state === "done" ? "check" : "arrowRight"}>
          {state === "sending" ? labels.sending : labels.submit}
        </Button>
        <p aria-live="polite" className={`flex items-center gap-2 text-sm ${state === "done" ? "text-emerald-300" : "text-coral-soft"}`}>
          {state === "done" && <Icon name="check" className="size-4" />}
          {state === "done" ? labels.success : state === "error" ? labels.error : state === "invalid" ? labels.required : ""}
        </p>
      </div>
    </form>
  );
}
