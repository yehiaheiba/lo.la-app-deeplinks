import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Escape hatch: let users/viewers force web.
  if (
    req.nextUrl.searchParams.get("web") === "1" ||
    req.nextUrl.searchParams.get("web") === "true"
  ) {
    return NextResponse.next();
  }

  // Don't interfere with Next internals, well-known files, or our landing route.
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/d") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If it's a likely file request (assets), skip.
  if (pathname.includes(".") && !pathname.endsWith(".json")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/d${pathname}`;
  url.search = search; // preserve query params

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
