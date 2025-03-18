import { itemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (query) {
      const items = await itemService.getByNameOrId(query);
      if (items.length > 0) {
        return NextResponse.json({ items }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error: `Item ${query} is not found`,
          },
          {
            status: 404,
          }
        );
      }
    } else {
      return NextResponse.json({ error: "no query params" }, { status: 404 });
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
