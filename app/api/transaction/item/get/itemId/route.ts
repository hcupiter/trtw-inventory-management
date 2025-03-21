import { transactionItemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId: number = Number(searchParams.get("id"));

    if (!itemId)
      return NextResponse.json(
        { error: "Parameter itemId tidak ada" },
        { status: 404 }
      );

    const transactionItems = await transactionItemService.getByItemID(itemId);
    return NextResponse.json({ transactionItems }, { status: 200 });
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
