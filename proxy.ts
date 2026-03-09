import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Proxy runs only for protected routes (see config.matcher).
 * Login and register are excluded from the matcher so users can always access them.
 * Unauthenticated users visiting protected routes are redirected to /login.
 */
const protectedPaths = ["/dashboard", "/admin", "/provider", "/cart", "/checkout", "/orders", "/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = !!getSessionCookie(request);

  if (protectedPaths.some((p) => pathname.startsWith(p)) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/provider/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/orders",
    "/orders/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
