import { mapTransactionDataToEntity } from "@/models/dto/TransactionDTO";
import { TransactionData } from "@/models/entity/TransactionData";

export const fetchTransactionByItemIdUseCase = async (
  itemId: number
): Promise<TransactionData[]> => {
  try {
    const response = await fetch(`/api/transaction/get/itemId?id=${itemId}`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error ||
          `Gagal mengambil transaksi berdasarkan id barang: ${itemId}`
      );

    const mappedEntity = await Promise.all(
      data.transactions.map(mapTransactionDataToEntity)
    );

    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
