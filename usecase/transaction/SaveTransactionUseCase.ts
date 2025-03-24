import {
  mapToInsertTransactionDTO,
  TransactionData,
} from "@/models/entity/TransactionData";

export const saveTransactionUseCase = async (
  entity: TransactionData
): Promise<string> => {
  try {
    const dto = mapToInsertTransactionDTO(entity);

    const response = await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Gagal menyimpan data transaksi");

    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
