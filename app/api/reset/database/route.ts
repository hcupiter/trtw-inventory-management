import { database } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const devPassword = process.env.RESET_DB_PASSWORD;

    if (!devPassword) throw new Error("Password is not defined");

    if (password !== devPassword)
      return NextResponse.json({ error: "Unathorized" }, { status: 400 });

    database.beginTransaction();
    const result = await database.resetDatabase();
    if (!result) throw new Error("Failed to reset the database");
    database.commit();
    return NextResponse.json({
      message: "Database reset successfully",
      status: 200,
    });
  } catch (error) {
    database.rollback();
    console.log(error);
    return NextResponse.json({ error: errorWriter(error) }, { status: 500 });
  }
}
