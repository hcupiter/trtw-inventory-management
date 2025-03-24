import { mapTransactionTypeToEntity } from "@/models/dto/TransactionTypeDTO";
import { TransactionType } from "@/models/entity/TransactionType";

export const fetchTransactionTypeByIdUseCase = async (id: number) => {
  try {
    // Fetch By Id
    const response = await fetch(`/api/transaction/type?id=${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengambil tipe transaksi");
    }

    const mappedEntity: TransactionType = mapTransactionTypeToEntity(
      data.transactionTypes
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
