import { NextResponse } from "next/server";

/** Newsletter sign-up. Logs only until a mailing-list provider is connected. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; locale?: string };
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }
  console.info("[newsletter] subscribe", { email, locale: body.locale });
  return NextResponse.json({ ok: true });
}
