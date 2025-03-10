import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("session")?.value;

  console.log("[Middleware] Request Path:", req.nextUrl.pathname);
  console.log(
    "[Middleware] Session Token:",
    sessionToken ? "Exists" : "Not Found"
  );

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isHomePage = req.nextUrl.pathname === "/";

  if (!sessionToken && !isAuthPage) {
    console.log("[Middleware] Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionToken) {
    if (isAuthPage || isHomePage) {
      console.log("[Middleware] Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  console.log("[Middleware] Allowing request");
  return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"], // ✅ Protects "/dashboard" AND all subroutes
};
