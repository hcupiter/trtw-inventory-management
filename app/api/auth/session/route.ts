import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie")?.split("=")[1]; // Get cookie value
  if (!cookie) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const user = await authService.getCurrentUser(cookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
