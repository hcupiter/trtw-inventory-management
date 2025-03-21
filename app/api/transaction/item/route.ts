import { transactionItemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit: number = Number(searchParams.get("limit")) || 1000;
    const offset: number = Number(searchParams.get("offset")) || 0;

    // If user write transaction item id and transaction id, returns transacionItem
    const itemId: number = Number(searchParams.get("itemId"));
    const transactionId: number = Number(searchParams.get("transactionId"));

    if (itemId && transactionId) {
      const transactionItem =
        await transactionItemService.getByTransactionIdAndItemId(
          transactionId,
          itemId
        );
      if (transactionItem)
        return NextResponse.json({ transactionItem }, { status: 200 });
      else
        return NextResponse.json(
          {
            error: `Barang untuk id transaksi ${transactionId} dan id barang ${itemId} tidak ditemukan`,
          },
          { status: 404 }
        );
    }

    if (itemId || transactionId)
      return NextResponse.json(
        {
          error: `Parameter tidak lengkap (itemId dan transactionId)`,
        },
        { status: 404 }
      );

    // Fetch All
    const transactionItems = await transactionItemService.getAll(limit, offset);
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
