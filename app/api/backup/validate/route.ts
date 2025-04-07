import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.BACKUP_DB_PASSWORD;
    if (!adminPassword) throw new Error("Password to set db is not found");

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          message: "Password untuk memasang database tidak sesuai",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Success" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: errorWriter(error, "Something on the server went wrong"),
      },
      {
        status: 500,
      }
    );
  }
}
