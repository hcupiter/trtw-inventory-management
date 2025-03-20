import { transactionTypeService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      const transactionTypes = await transactionTypeService.getAll();
      return NextResponse.json({ transactionTypes }, { status: 200 });
    }

    const transactionTypes = await transactionTypeService.getById(id);
    return NextResponse.json({ transactionTypes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: errorWriter(error, "Something went wrong on the server!"),
      },
      { status: 500 }
    );
  }
}
