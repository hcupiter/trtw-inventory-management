import { z } from "zod";
import { TransactionData } from "../entity/TransactionData";
import { fetchTransactionItemsByTransactionIdUseCase } from "@/usecase/transaction/items/FetchTransactionItemsByTransactionIdUseCase";
import { TransactionType } from "../entity/TransactionType";
import { FetchTransactionTypeByIdUseCase } from "@/usecase/transaction/type/FetchTransactionTypeByIdUseCase";
import { TransactionItem } from "../entity/TransactionItem";

export const TransactionSchema = z.object({
  id: z.number(),
  date: z.string(),
  transactionTypeId: z.number(),
});

export interface TransactionDTO {
  id: number;
  date: string;
  transactionTypeId: number;
}

export const mapTransactionDataToEntity = async (
  dto: TransactionDTO
): Promise<TransactionData> => {
  try {
    const transactionItems: TransactionItem[] =
      await fetchTransactionItemsByTransactionIdUseCase(dto.id);

    const totalPrice = transactionItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const transactionType: TransactionType =
      await FetchTransactionTypeByIdUseCase(dto.transactionTypeId);

    return Promise.resolve({
      id: dto.id,
      date: new Date(dto.date),
      transactionType: transactionType,
      totalPrice: totalPrice,
      transaction: transactionItems,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
