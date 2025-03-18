import { ItemDTO } from "@/models/dto/ItemDTO";
import { itemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit: number = Number(searchParams.get("limit")) || 1000;
    const offset: number = Number(searchParams.get("offset")) || 0;

    const items = await itemService.getAll(limit, offset);
    return NextResponse.json({ items }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const item: ItemDTO = await req.json();

    const validateItem = await itemService.getByID(item.id);
    if (validateItem != null) {
      return NextResponse.json(
        {
          error: `Items with id: ${item.id} already registered`,
        },
        { status: 500 }
      );
    }

    const result = await itemService.save(item);
    if (result) {
      return NextResponse.json(
        { message: "Items saved successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to save item!",
        },
        { status: 500 }
      );
    }
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
