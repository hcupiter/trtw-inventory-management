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
        error: errorWriter(
          error,
          "Sesuatu dalam server sedang tidak befungsi..."
        ),
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
    const validateItem = await itemService.getByItemId(item.itemId);
    if (validateItem) {
      return NextResponse.json(
        {
          error: `Barang dengan id: ${item.itemId} sudah terdaftar`,
        },
        { status: 500 }
      );
    }

    const result = await itemService.save(item);
    if (result) {
      return NextResponse.json(
        { message: "Barang berhasil disimpan" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Barang gagal disimpan!",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: errorWriter(
          error,
          "Sesuatu dalam server sedang tidak befungsi..."
        ),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const item: ItemDTO = await req.json();

    const result = await itemService.update(item);
    if (result) {
      return NextResponse.json(
        { message: "Barang berhasil diubah" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Gagal menyimpan barang",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: errorWriter(
          error,
          "Sesuatu dalam server sedang tidak befungsi..."
        ),
      },
      { status: 500 }
    );
  }
}
