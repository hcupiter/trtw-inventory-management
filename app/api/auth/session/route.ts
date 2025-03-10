import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";
import { cookies } from "next/headers"; // Use Next.js headers API

export async function GET() {
  const cookie = await cookies();
  const sessionToken = cookie.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const user = await authService.getCurrentUser(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
