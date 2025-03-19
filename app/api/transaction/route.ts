import { transactionService } from "@/utils/appModule";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit: number = Number(searchParams.get("limit")) || 1000;
    const offset: number = Number(searchParams.get("offset")) || 0;

    const transactions = await transactionService.getAll(limit, offset);
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something on the server went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
