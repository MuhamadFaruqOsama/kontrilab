import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/student", "/teacher"];
const authCookieNames = ["kontrilab-auth"];

function hasAuthCookie(request: NextRequest) {
  if (authCookieNames.some((name) => request.cookies.has(name))) {
    return true;
  }

  return request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!isProtected || hasAuthCookie(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*"],
};
