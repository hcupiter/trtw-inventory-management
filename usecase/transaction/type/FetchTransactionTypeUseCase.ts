import { mapTransactionTypeToEntity } from "@/models/dto/TransactionTypeDTO";
import { TransactionType } from "@/models/entity/TransactionType";

export const fetchTransactionTypeUseCase = async (): Promise<
  TransactionType[]
> => {
  try {
    // Fetch All
    const response = await fetch(`/api/transaction/type`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengambil tipe transaksi");
    }
    const mappedEntity: TransactionType[] = await Promise.all(
      data.transactionTypes.map(mapTransactionTypeToEntity)
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
