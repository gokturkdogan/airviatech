import { NextResponse } from "next/server";

/**
 * Contact form endpoint. There is no database yet: submissions are validated
 * and logged on the server. Plug an email/CRM provider in `deliver()` later.
 */
type Payload = { name?: string; email?: string; phone?: string; company?: string; topic?: string | null; message?: string; locale?: string };

const isEmail = (v: unknown) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clip = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function deliver(entry: Record<string, string>) {
  console.info("[contact] new submission", entry);
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const entry = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    phone: clip(body.phone, 40),
    company: clip(body.company, 160),
    topic: clip(body.topic ?? "", 80),
    message: clip(body.message, 5000),
    locale: clip(body.locale, 5),
  };
  if (!entry.name || !isEmail(entry.email) || !entry.message) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }
  await deliver(entry);
  return NextResponse.json({ ok: true });
}
