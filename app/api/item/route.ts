import { ItemDTO } from "@/models/dto/ItemDTO";
import { itemService } from "@/utils/appModule";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const id = searchParams.get("id");

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
    } else if (id) {
      const items = await itemService.getByID(id);
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
    }

    const items = await itemService.getAll(50, 0);
    return NextResponse.json({ items }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const item: ItemDTO = await req.json();

    const result = await itemService.save(item);
    if (result) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Failed to save item!",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong on the server!",
      },
      { status: 500 }
    );
  }
}
