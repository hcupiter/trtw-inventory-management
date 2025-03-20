import { mapTransactionTypeToEntity } from "@/models/dto/TransactionTypeDTO";
import { TransactionType } from "@/models/entity/TransactionType";

export const FetchTransactionTypeByIdUseCase = async (id: number) => {
  try {
    // Fetch By Id
    const response = await fetch(`/api/transaction/type?id=${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengambil tipe transaksi");
    }
    const mappedEntity: TransactionType = data.transactionTypes.map(
      mapTransactionTypeToEntity
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
