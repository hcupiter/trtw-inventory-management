import {
  mapTransactionItemToEntity,
  TransactionItemDTO,
} from "@/models/dto/TransactionItemDTO";
import { TransactionItem } from "@/models/entity/TransactionItem";

export const fetchTransactionItemsByTransactionIdUseCase = async (
  transactionId: number,
  audit?: boolean
): Promise<TransactionItem[]> => {
  try {
    const auditConfig = audit === true ? "true" : false;
    const response = await fetch(
      `/api/transaction/item/get/transactionId?id=${transactionId}&audit=${auditConfig}`
    );
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to fetch transaction items data");

    const mappedEntity: TransactionItem[] = await Promise.all(
      data.transactionItems.map((element: TransactionItemDTO) =>
        mapTransactionItemToEntity(element)
      )
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
