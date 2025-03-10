import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await authService.login(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Generate a session token (this can be a JWT or a session ID)
  const sessionToken = await authService.createSessionToken(user);
  const cookie = await cookies();

  // Set the cookie securely
  cookie.set({
    name: "session",
    value: sessionToken,
    httpOnly: true, // Prevents JavaScript access (more secure)
    secure: process.env.NODE_ENV === "production", // Secure in production
    path: "/", // Available on all routes
    maxAge: 60 * 60 * 24 * 7, // 1 week expiration
    sameSite: "lax", // Helps prevent CSRF attacks
  });

  return NextResponse.json({ user });
}
