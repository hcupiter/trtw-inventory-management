import { transactionItemService, transactionService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id)
      return NextResponse.json(
        { error: `id params required` },
        { status: 404 }
      );

    const transactions = await transactionService.getAllByItemId(Number(id));
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
