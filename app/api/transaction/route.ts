import { InsertTransactionSchema } from "@/models/dto/InsertTransactionDTO";
import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import {
  database,
  itemService,
  transactionItemService,
  transactionService,
} from "@/utils/appModule";
import { checkAPISchemaError } from "@/utils/checkSchemaError";
import { errorWriter } from "@/utils/errorWriter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit: number = Number(searchParams.get("limit")) || 1000;
    const offset: number = Number(searchParams.get("offset")) || 0;

    const transactions = await transactionService.getAll(limit, offset);
    return NextResponse.json({ transactions }, { status: 200 });
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

export async function POST(req: Request) {
  const db = database;

  try {
    const body = await req.json();
    const requestSchema = InsertTransactionSchema.parse(body);

    db.beginTransaction();

    const createdTransactionId = await createTransactionUseCase(
      requestSchema.transaction
    );

    const mappedTransactionItems: TransactionItemDTO[] =
      requestSchema.items.map((item) => {
        return {
          ...item,
          transactionId: createdTransactionId,
        };
      });

    await insertTransactionItemUseCase(mappedTransactionItems);
    await substractItemStockUseCase(mappedTransactionItems);

    db.commit();
    return NextResponse.json(
      { message: `Sukses menyimpan data` },
      { status: 200 }
    );
  } catch (error) {
    db.rollback();
    console.log(error);
    checkAPISchemaError(error);
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

const createTransactionUseCase = async (
  transaction: TransactionDTO
): Promise<number> => {
  try {
    const id = await transactionService.save(transaction);
    if (id) return Promise.resolve(id);
    else throw new Error("ID tidak berhasil dibuat");
  } catch (error) {
    return Promise.reject(error);
  }
};

const insertTransactionItemUseCase = async (items: TransactionItemDTO[]) => {
  try {
    const insertTransactionItemsResult = await Promise.all(
      items.map((item) => transactionItemService.save(item)) // No need for `async` or `await` here
    );

    // Check if any insertion failed
    if (insertTransactionItemsResult.some((result) => result === false)) {
      throw new Error("Gagal menyimpan beberapa barang transaksi");
    }
  } catch (error) {
    console.error("Error in insertTransactionItemUseCase:", error);
    throw error;
  }
};

const substractItemStockUseCase = async (items: TransactionItemDTO[]) => {
  try {
    const removeItemStockResult = await Promise.all(
      items.map((item) => itemService.removeItemStock(item.itemId, item.qty))
    );

    console.error("remove item stock result: ", removeItemStockResult);

    if (removeItemStockResult.some((result) => result === false)) {
      throw new Error("Gagal mengubah stok beberapa barang");
    }
  } catch (error) {
    console.error("Error in substractItemStockUseCase: ", error);
    throw error;
  }
};
