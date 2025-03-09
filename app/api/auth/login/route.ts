import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await authService.login(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
