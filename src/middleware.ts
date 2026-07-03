import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

import {
  defaultLocale,
  isValidLocale,
  localeLabels,
  type Locale,
} from "@/i18n/config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const APP_ROUTES = ["/dashboard", "/login", "/api"];

function isAppRoute(pathname: string) {
  return APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAppRoute(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const isDashboard = pathname.startsWith("/dashboard");
    const isLogin = pathname === "/login";

    if (isDashboard && !token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (isLogin && token) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  const locale = getLocaleFromPathname(pathname);

  response.headers.set("x-html-lang", localeLabels[locale].htmlLang);

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(pt|it)/:path*",
    "/dashboard/:path*",
    "/login",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
