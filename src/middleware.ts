import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-session";

const COUNTRY_MAP: Record<string, { currency: string; timezone: string; locale: string }> = {
  US: { currency: "USD", timezone: "America/New_York", locale: "en-US" },
  GB: { currency: "GBP", timezone: "Europe/London", locale: "en-GB" },
  CA: { currency: "CAD", timezone: "America/Toronto", locale: "en-CA" },
  AU: { currency: "AUD", timezone: "Australia/Sydney", locale: "en-AU" },
  NZ: { currency: "NZD", timezone: "Pacific/Auckland", locale: "en-NZ" },
  IE: { currency: "EUR", timezone: "Europe/Dublin", locale: "en-IE" },
  DE: { currency: "EUR", timezone: "Europe/Berlin", locale: "de-DE" },
  FR: { currency: "EUR", timezone: "Europe/Paris", locale: "fr-FR" },
  AE: { currency: "AED", timezone: "Asia/Dubai", locale: "en-AE" },
  SA: { currency: "SAR", timezone: "Asia/Riyadh", locale: "en-SA" },
  MY: { currency: "MYR", timezone: "Asia/Kuala_Lumpur", locale: "en-MY" },
  SG: { currency: "SGD", timezone: "Asia/Singapore", locale: "en-SG" },
  ZA: { currency: "ZAR", timezone: "Africa/Johannesburg", locale: "en-ZA" },
};

const PROTECTED_API_PREFIXES = ["/api/enrollments"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country") ?? request.cookies.get("country")?.value ?? "US";
  const geo = COUNTRY_MAP[country] ?? COUNTRY_MAP.US;
  const user = await getSessionFromRequest(request);
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  response.cookies.set("country", country, { path: "/" });
  response.cookies.set("currency", geo.currency, { path: "/" });
  response.cookies.set("timezone", request.cookies.get("timezone")?.value ?? geo.timezone, { path: "/" });
  response.cookies.set("locale", geo.locale, { path: "/" });

  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/portal") && user?.role !== "parent") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/teacher") && user?.role !== "teacher" && user?.role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (method === "POST") {
      return response;
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (method === "GET" && user.role !== "admin" && user.role !== "parent") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (method !== "GET" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
