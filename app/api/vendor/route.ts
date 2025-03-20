import { VendorDTO, VendorSchema } from "@/models/dto/VendorDTO";
import { vendorService } from "@/utils/appModule";
import { checkAPISchemaError } from "@/utils/checkSchemaError";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit: number = Number(searchParams.get("limit")) || 1000;
    const offset: number = Number(searchParams.get("offset")) || 0;

    const vendors = await vendorService.getAll(limit, offset);
    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: errorWriter(error, "Something went wrong on the server!"),
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
    const vendor = VendorSchema.parse(body);

    const result = await vendorService.save(vendor);
    if (result) {
      return NextResponse.json(
        { message: "Vendor berhasil disimpan" },
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
    checkAPISchemaError(error);
    return NextResponse.json(
      {
        error: errorWriter(error, "Something went wrong on the server!"),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const vendor: VendorDTO = await req.json();
    const result = await vendorService.update(vendor);

    if (result) {
      return NextResponse.json(
        { message: "Vendor Berhasil di update" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to update item!",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PATCH /api/vendors error:", error);
    checkAPISchemaError(error);
    return NextResponse.json(
      {
        error: errorWriter(error, "Something went wrong on the server!"),
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
          error: "Please include id vendor to delete",
        },
        { status: 400 }
      );
    }

    const result = await vendorService.delete(id);
    if (result) {
      return NextResponse.json(
        { message: "Vendor berhasil dihapus" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Vendor ID not found",
        },
        { status: 400 }
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
