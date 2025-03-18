import { itemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const items = await itemService.getByID(Number(id));
      if (items) {
        return NextResponse.json({ items }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error: `Item with id ${id} is not found`,
          },
          {
            status: 404,
          }
        );
      }
    } else {
      return NextResponse.json({ error: "no id params" }, { status: 404 });
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
