import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function getCookieOptions(isProduction: boolean, siteUrl: string) {
  const cookieDomain = isProduction && siteUrl ? new URL(siteUrl).hostname : undefined;
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 4,
    path: "/",
    ...(cookieDomain && { domain: cookieDomain }),
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured. Set ADMIN_PASSWORD in environment variables." },
        { status: 500 }
      );
    }

    if (body.action === "logout") {
      cookieStore.delete("admin_session");
      return NextResponse.json({ success: true });
    }

    const { password } = body;

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    cookieStore.set("admin_session", "true", getCookieOptions(isProduction, siteUrl));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return NextResponse.json({ authenticated: !!session });
}
