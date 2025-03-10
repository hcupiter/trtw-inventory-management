import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("session")?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  if (!sessionToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
  matcher: ["/dashboard", "/login", "/"], // Protect these pages
};
