import { transactionService } from "@/utils/appModule";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (!id)
      return NextResponse.json(
        { error: `id params required` },
        { status: 404 }
      );

    // If there's any parameters from and to, return transaction by range
    if (fromParam && toParam) {
      // Convert to ensure only `YYYY-MM-DD` format is used
      const from = formatDateToYYYYMMDD(new Date(fromParam));
      const to = formatDateToYYYYMMDD(new Date(toParam));
      const transactions = await transactionService.getAllByItemId(
        Number(id),
        from,
        to
      );
      return NextResponse.json({ transactions }, { status: 200 });
    }

    const todayDateISOString = new Date().toISOString();
    const transactions = await transactionService.getAllByItemId(
      Number(id),
      todayDateISOString,
      todayDateISOString
    );
    if (transactions) {
      return NextResponse.json({ transactions }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: `Transaction ${id} is not found`,
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.log(error);
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
