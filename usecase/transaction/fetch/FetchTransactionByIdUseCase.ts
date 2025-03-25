import { mapTransactionDataToEntity } from "@/models/dto/TransactionDTO";
import { TransactionData } from "@/models/entity/TransactionData";

export const fetchTransactionByIdUseCase = async (
  transactionId?: number
): Promise<TransactionData> => {
  try {
    const response = await fetch(`/api/transaction/get/id?id=${transactionId}`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error || `Gagal mengambil transaksi dengan id ${transactionId}`
      );

    const mappedEntity: TransactionData = await mapTransactionDataToEntity(
      data.transaction
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
