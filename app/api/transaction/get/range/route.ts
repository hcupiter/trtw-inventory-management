import { transactionService } from "@/utils/appModule";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (!fromParam || !toParam) {
      return NextResponse.json(
        { error: "params 'from' and 'to' range are required" },
        { status: 400 }
      );
    }

    // Convert to ensure only `YYYY-MM-DD` format is used
    const from = formatDateToYYYYMMDD(new Date(fromParam));
    const to = formatDateToYYYYMMDD(new Date(toParam));

    const transactions = await transactionService.getAllRange(from, to);
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: errorWriter(error, "Something on the server went wrong") },
      { status: 500 }
    );
  }
}
