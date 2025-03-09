import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";

import { cookies } from "next/headers"; // Import Next.js cookie handling

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value; // Change "session" to match your actual token name

  if (!sessionToken) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const user = await authService.getCurrentUser(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
