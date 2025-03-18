import { itemService, vendorService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "no id params" }, { status: 404 });
    }

    const vendor = await vendorService.getById(id);
    if (!vendor) {
      return NextResponse.json(
        {
          error: `Vendor ${id} is not found`,
        },
        {
          status: 404,
        }
      );
    }

    const items = await itemService.getByVendorID(id);
    return NextResponse.json({ vendor, items }, { status: 200 });
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
