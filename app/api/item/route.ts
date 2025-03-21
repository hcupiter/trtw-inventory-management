import { ItemDTO, ItemSchema } from "@/models/dto/ItemDTO";
import { itemService } from "@/utils/appModule";
import { checkAPISchemaError } from "@/utils/checkSchemaError";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";
import { z } from "zod";

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
    const body = await req.json();
    const item = ItemSchema.parse(body);

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
    checkAPISchemaError(error);
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
    const body = await req.json();
    const item = ItemSchema.parse(body);

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
    checkAPISchemaError(error);
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Tidak ada id barang untuk dihapus",
        },
        { status: 400 }
      );
    }

    const result = await itemService.delete(id);
    if (result) {
      return NextResponse.json(
        { message: "Barang berhasil dihapus" },
        { status: 200 }
      );
    } else {
      throw new Error("Barang gagal dihapus");
    }
  } catch (error) {
    console.log(error);
    checkAPISchemaError(error);
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
