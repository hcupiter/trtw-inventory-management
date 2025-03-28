import { z } from "zod";
import { TransactionData } from "../entity/TransactionData";
import { fetchTransactionItemsByTransactionIdUseCase } from "@/usecase/transaction/items/FetchTransactionItemsByTransactionIdUseCase";
import { TransactionType } from "../entity/TransactionType";
import { fetchTransactionTypeByIdUseCase } from "@/usecase/transaction/type/FetchTransactionTypeByIdUseCase";
import { TransactionItem } from "../entity/TransactionItem";
import { fetchTransactionPriceByTransactionId } from "@/usecase/transaction/fetch/FetchTransactionPriceByTransactionIdUseCase";
import { TransactionSummary } from "../entity/TransactionSummary";
import { TransactionAudit } from "../entity/TransactionAudit";

export const TransactionSchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  transactionTypeId: z.number(),
  isDeleted: z.boolean().optional(),
});

export interface TransactionDTO {
  id?: number;
  date: string;
  transactionTypeId: number;
  isDeleted?: boolean;
}

export const mapTransactionDataToSummary = async (
  dto: TransactionDTO
): Promise<TransactionSummary> => {
  try {
    if (!dto.id) throw new Error("Tidak ada id transaksi");
    const totalPrice = await fetchTransactionPriceByTransactionId(dto.id);
    const transactionType: TransactionType =
      await fetchTransactionTypeByIdUseCase(dto.transactionTypeId);
    return Promise.resolve({
      id: dto.id,
      date: new Date(dto.date),
      totalPrice: totalPrice,
      transactionType: transactionType,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const mapTransactionDataToEntity = async (
  dto: TransactionDTO
): Promise<TransactionData> => {
  try {
    if (!dto.id) throw new Error("Tidak ada id transaksi");
    const transactionItems: TransactionItem[] =
      await fetchTransactionItemsByTransactionIdUseCase(dto.id);

    const totalPrice = transactionItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const transactionType: TransactionType =
      await fetchTransactionTypeByIdUseCase(dto.transactionTypeId);

    return Promise.resolve({
      id: dto.id,
      date: new Date(dto.date),
      transactionType: transactionType,
      totalPrice: totalPrice,
      transactionItems: transactionItems,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const mapTransactionDataToAuditEntity = async (
  dto: TransactionDTO,
  audit?: boolean
): Promise<TransactionAudit> => {
  try {
    if (!dto.id) throw new Error("Tidak ada id transaksi");
    const transactionItems: TransactionItem[] =
      await fetchTransactionItemsByTransactionIdUseCase(dto.id, audit);

    const totalPrice = transactionItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const transactionType: TransactionType =
      await fetchTransactionTypeByIdUseCase(dto.transactionTypeId);

    return Promise.resolve({
      id: dto.id,
      date: new Date(dto.date),
      transactionType: transactionType,
      totalPrice: totalPrice,
      transactionItems: transactionItems,
      isDeleted: dto.isDeleted ?? false,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
