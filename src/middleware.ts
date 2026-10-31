import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.ckdub.com";
// Old/duplicate hosts that must permanently redirect to the canonical domain
const REDIRECT_HOSTS = new Set(["ckdub.vercel.app", "ckdub.com"]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const pathname = req.nextUrl.pathname;

  // 1. Host redirect: enforce www.ckdub.com
  if (REDIRECT_HOSTS.has(host)) {
    const url = new URL(pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 301);
  }

  // 2. Legacy / malformed category redirects (fixes GSC "Discovered - currently not indexed")
  // Redirects /category/Chinese Series, /category/Chinese%20Series -> /category/chinese
  // Redirects /category/Korean Series, /category/Korean%20Series -> /category/korean
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  if (decodedPath.startsWith("/category/")) {
    const cat = decodedPath.replace("/category/", "").trim();
    if (cat === "chinese series" || cat === "chinese-series" || cat === "chineseseries") {
      return NextResponse.redirect(new URL("/category/chinese", req.url), 301);
    }
    if (cat === "korean series" || cat === "korean-series" || cat === "koreanseries") {
      return NextResponse.redirect(new URL("/category/korean", req.url), 301);
    }
    if (cat === "ai series" || cat === "ai-series" || cat === "ai original" || cat === "ai-original") {
      return NextResponse.redirect(new URL("/category/ai_series", req.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
