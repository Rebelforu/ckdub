import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.ckdub.com";
// Old/duplicate hosts that must permanently redirect to the canonical domain
const REDIRECT_HOSTS = new Set(["ckdub.vercel.app", "ckdub.com"]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
