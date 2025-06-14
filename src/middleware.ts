import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1]; // Get locale from URL

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`)
  );

  if (isProtectedRoute) {
    // Get the auth token from cookies
    const authToken = request.cookies.get("auth_token");

    // If no token is present, redirect to login
    if (!authToken) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      // Add the current URL as a redirect parameter
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    // Match all routes that start with /[locale]/admin
    "/:locale/admin/:path*",
  ],
};
