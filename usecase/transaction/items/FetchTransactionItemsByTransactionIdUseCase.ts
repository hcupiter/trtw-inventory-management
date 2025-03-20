import { mapTransactionItemToEntity } from "@/models/dto/TransactionItemDTO";
import { TransactionItem } from "@/models/entity/TransactionItem";

export const fetchTransactionItemsByTransactionIdUseCase = async (
  transactionId: number
): Promise<TransactionItem[]> => {
  try {
    const response = await fetch(
      `/api/transaction/item/get/transactionId?id=${transactionId}`
    );
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to fetch transaction items data");

    const mappedEntity: TransactionItem[] = await Promise.all(
      data.transactionItems.map(mapTransactionItemToEntity)
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
