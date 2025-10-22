import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle admin and director routes first
  if (pathname.match(/^\/[a-z]{2}\/(admin|director)/)) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const locale = pathname.split("/")[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|pt)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
