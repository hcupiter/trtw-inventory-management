import { mapTransactionDataToEntity } from "@/models/dto/TransactionDTO";
import {
  ItemTransactionReport,
  mapTransactionToItemTransactionReport,
} from "@/models/entity/ItemTransactionReport";
import { TransactionData } from "@/models/entity/TransactionData";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

export const fetchItemTransactionReportUseCase = async (
  id: number,
  itemId: string,
  from: Date,
  to: Date
): Promise<ItemTransactionReport[]> => {
  try {
    const fromDate = formatDateToYYYYMMDD(from);
    const toDate = formatDateToYYYYMMDD(to);

    const transactionsResponse = await fetch(
      `/api/transaction/get/itemId?id=${id}&from=${fromDate}&to=${toDate}`
    );
    const transactionsData = await transactionsResponse.json();
    if (!transactionsResponse.ok)
      throw new Error(
        transactionsData.error ||
          `Gagal mengambil data transaksi berdasarkan item id ${id}`
      );

    const mappedTransactionsEntity: TransactionData[] = await Promise.all(
      transactionsData.transactions.map(mapTransactionDataToEntity)
    );

    const report: ItemTransactionReport[] = mappedTransactionsEntity
      .map((element) => mapTransactionToItemTransactionReport(element, itemId))
      .filter((report) => report !== undefined); // Remove null values

    return Promise.resolve(report);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
