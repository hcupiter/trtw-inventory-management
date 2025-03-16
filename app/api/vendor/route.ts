import { VendorDTO } from "@/models/dto/VendorDTO";
import { vendorService } from "@/utils/appModule";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const id = searchParams.get("id");

    if (query) {
      const vendors = await vendorService.getByNameOrId(query);

      if (vendors.length > 0) {
        return NextResponse.json({ vendors }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error: `Vendor ${query} is not found`,
          },
          {
            status: 404,
          }
        );
      }
    } else if (id) {
      const vendor = await vendorService.getById(id);
      if (vendor) {
        return NextResponse.json({ vendor }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error: `Vendor ${id} is not found`,
          },
          {
            status: 404,
          }
        );
      }
    }

    const vendors = await vendorService.getAll(50, 0);
    return NextResponse.json({ vendors }, { status: 200 });
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
    const vendor: VendorDTO = await req.json();

    const result = await vendorService.save(vendor);
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
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Vendor ID not found",
        },
        { status: 400 }
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
