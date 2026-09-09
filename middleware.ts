import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/admin", "/api/admin", "/api/site-config", "/api/content", "/api/manual-products", "/api/uploads"];

function isProtected(pathname: string) { return protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`)); }

export function middleware(request: NextRequest) {
  if (!isProtected(request.nextUrl.pathname)) return NextResponse.next();
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  }
  const authorization = request.headers.get("authorization") || "";
  const expected = `Basic ${btoa(`admin:${password}`)}`;
  if (authorization === expected) return NextResponse.next();
  return new NextResponse("Admin authentication required.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="DESKAVYN Admin"' } });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/site-config/:path*", "/api/content/:path*", "/api/manual-products/:path*", "/api/uploads/:path*"] };
