import { transactionItemService } from "@/utils/appModule";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id)
			return NextResponse.json(
				{ error: `id params required` },
				{ status: 404 }
			);

		const result = await transactionItemService.getById(Number(id));
		if (result) {
			return NextResponse.json({ result }, { status: 200 });
		} else {
			return NextResponse.json(
				{
					error: `Item id untuk ${id} tidak ditemukan`,
				},
				{
					status: 404,
				}
			);
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
