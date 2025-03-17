import { transactionService } from "@/utils/appModule";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (id) {
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
    } else if (from && to) {
      const transaction = await transactionService.getAllRange(from, to);
    }
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
