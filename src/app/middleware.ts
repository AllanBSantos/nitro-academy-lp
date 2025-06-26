import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Handle internationalization
  const response = await intlMiddleware(request);

  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the path starts with /[locale]/admin
  if (pathname.match(/^\/[a-z]{2}\/admin/)) {
    // Get the auth token from the cookies
    const token = request.cookies.get("auth_token")?.value;

    // If there's no token, redirect to login
    if (!token) {
      const locale = pathname.split("/")[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      // Add the current URL as a redirect parameter for better UX
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
