import { transactionService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from && !to)
      return NextResponse.json(
        { error: "params from and to range is required" },
        { status: 404 }
      );

    if (from && to) {
      const transactions = await transactionService.getAllRange(from, to);
      return NextResponse.json({ transactions }, { status: 200 });
    }
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
