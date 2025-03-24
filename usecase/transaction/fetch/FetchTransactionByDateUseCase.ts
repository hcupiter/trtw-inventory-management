import { mapTransactionDataToEntity } from "@/models/dto/TransactionDTO";
import { TransactionData } from "@/models/entity/TransactionData";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

export const fetchTransactionByDate = async (
  from: Date,
  to: Date
): Promise<TransactionData[]> => {
  try {
    const fromDate = formatDateToYYYYMMDD(from);
    const toDate = formatDateToYYYYMMDD(to);

    const response = await fetch(
      `/api/transaction/get/range?from=${fromDate}&to=${toDate}`
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error ||
          `Gagal mengambil data transaksi dari ${from.toDateString()} hingga ${to.toDateString()}`
      );

    const mappedEntity: TransactionData[] = await Promise.all(
      data.transactions.map(mapTransactionDataToEntity)
    );

    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
