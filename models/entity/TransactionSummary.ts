import { TransactionType } from "./TransactionType";

export interface TransactionSummary {
  id: number;
  date: Date;
  transactionType: TransactionType;
  totalPrice: number;
}
