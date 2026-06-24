import { NextRequest, NextResponse } from "next/server";
import { containsAbuse, DISPOSABLE_DOMAINS } from "@/lib/filter";

const FORMSPREE_ID = "mgobjlzl";
const ALLOWED_DOMAIN = "gmail.com";
const RATE_LIMIT_MS = 60_000;

const ipMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const last = ipMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "Too fast. Wait a moment." }, { status: 429 });
  }
  ipMap.set(ip, now);

  const formData = await req.formData();
  const name = (formData.get("name") as string) || "";
  const email = (formData.get("email") as string) || "";
  const message = (formData.get("message") as string) || "";

  if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return NextResponse.json(
      { error: `Only @${ALLOWED_DOMAIN} emails are accepted.`, field: "email" },
      { status: 403 },
    );
  }

  const domain = email.split("@").pop()?.toLowerCase() || "";
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return NextResponse.json(
      { error: "Temporary email addresses are not allowed.", field: "email" },
      { status: 403 },
    );
  }

  const abuseName = containsAbuse(name);
  if (abuseName) {
    return NextResponse.json(
      { error: "Inappropriate language in name.", field: "name" },
      { status: 400 },
    );
  }

  const abuseMsg = containsAbuse(message);
  if (abuseMsg) {
    return NextResponse.json(
      { error: "Inappropriate language in message.", field: "message" },
      { status: 400 },
    );
  }

  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (res.ok) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Failed to send." }, { status: 500 });
}
