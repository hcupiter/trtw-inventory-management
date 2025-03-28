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
  const isDashboard = req.nextUrl.pathname === "/dashboard";
  const isDashboardSubpage = req.nextUrl.pathname.startsWith("/dashboard/");

  // Handle Unauthorized Users (Not Logged In)
  if (!sessionToken && !isAuthPage) {
    console.log("[Middleware] Redirecting unauthenticated user to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Handle Logged-In Users
  if (sessionToken) {
    // Redirect / and /login to dashboard
    if (isAuthPage || isHomePage) {
      console.log("[Middleware] Redirecting to /dashboard/transactions");
      return NextResponse.redirect(new URL("/dashboard/transactions", req.url));
    }

    // Redirect /dashboard to default subpage
    if (isDashboard) {
      console.log(
        "[Middleware] Redirecting /dashboard to /dashboard/transactions"
      );
      return NextResponse.redirect(new URL("/dashboard/transactions", req.url));
    }

    // 🚀 Handle Not Found Routes
    const validRoutes = [
      "/dashboard/transactions",
      "/dashboard/items",
      "/dashboard/vendors",
      "/dashboard/others",
    ];
    if (
      isDashboardSubpage &&
      !validRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    ) {
      console.log(
        "[Middleware] Redirecting unknown dashboard route to /dashboard/transactions"
      );
      return NextResponse.redirect(new URL("/dashboard/transactions", req.url));
    }
  }

  console.log("[Middleware] Allowing request");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"], // ✅ Protects `/dashboard` and all subroutes
};
