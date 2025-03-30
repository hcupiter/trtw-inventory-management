import { vendorService } from "@/utils/appModule";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorIdParam = searchParams.get("vendorId");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (!fromParam || !toParam || !vendorIdParam) {
      return NextResponse.json({ error: "params 'from', 'to', and 'vendorId' are required" }, { status: 400 });
    }

    // Convert to ensure only `YYYY-MM-DD` format is used
    const from = formatDateToYYYYMMDD(new Date(fromParam));
    const to = formatDateToYYYYMMDD(new Date(toParam));

    const result = await vendorService.getVendorTransactionReport(Number(vendorIdParam), from, to);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: errorWriter(error, "Something on the server went wrong") }, { status: 500 });
  }
}
