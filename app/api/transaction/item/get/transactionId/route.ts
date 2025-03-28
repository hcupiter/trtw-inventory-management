import { transactionItemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const audit = searchParams.get("audit");

    if (!id) {
      return NextResponse.json({ error: "no id params" }, { status: 404 });
    }

    const isAudit: boolean = audit?.toLowerCase() === "true";
    const transactionItems = await transactionItemService.getByTransactionID(
      id,
      isAudit
    );
    return NextResponse.json({ transactionItems }, { status: 200 });
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
