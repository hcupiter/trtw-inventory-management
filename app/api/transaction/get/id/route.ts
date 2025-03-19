import { transactionService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: `id params required` },
        { status: 404 }
      );

    const transaction = await transactionService.getById(Number(id));
    if (transaction) {
      return NextResponse.json({ transaction }, { status: 200 });
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
