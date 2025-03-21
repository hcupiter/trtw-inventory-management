import {
  mapTransactionDataToEntity,
  TransactionDTO,
  TransactionSchema,
} from "@/models/dto/TransactionDTO";
import { TransactionData } from "@/models/entity/TransactionData";

export const fetchTransactionByDate = async (
  from: Date,
  to: Date
): Promise<TransactionData[]> => {
  try {
    const response = await fetch(
      `/api/transaction/get/range?from=${from.toISOString()}&to=${
        to.toISOString
      }`
    );
    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error ||
          `Gagal mengambil data transaksi dari ${from.toDateString} hingga ${to.toDateString}`
      );

    const mappedEntity: TransactionData[] = await Promise.all(
      data.transactions.map(mapTransactionDataToEntity)
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
