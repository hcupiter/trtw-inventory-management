import { fetchTransactionItemsByTransactionIdUseCase } from "@/usecase/transaction/items/FetchTransactionItemsByTransactionIdUseCase";
import { TransactionData } from "./TransactionData";
import { TransactionType } from "./TransactionType";

export interface TransactionSummary {
  id: number;
  date: Date;
  transactionType: TransactionType;
  totalPrice: number;
}

export const mapTransactionSummaryToTransaction = async (
  summary: TransactionSummary
): Promise<TransactionData> => {
  try {
    const transactionItems = await fetchTransactionItemsByTransactionIdUseCase(
      summary.id
    );

    return Promise.resolve({
      id: summary.id,
      date: summary.date,
      totalPrice: summary.totalPrice,
      transactionType: summary.transactionType,
      transactionItems: transactionItems,
    });
  } catch (error) {
    throw error;
  }
};
