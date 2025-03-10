import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookie = await cookies();
  cookie.delete("session"); // Remove the session cookie

  return NextResponse.json({ message: "Logged out successfully" });
}
