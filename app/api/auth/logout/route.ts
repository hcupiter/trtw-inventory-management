import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { errorWriter } from "@/utils/errorWriter";

export async function POST() {
  try {
    const cookie = await cookies();
    cookie.delete("session"); // Remove the session cookie

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error at api/auth/logout: ", error);
    return NextResponse.json(
      {
        error: errorWriter(error),
      },
      { status: 500 }
    );
  }
}
