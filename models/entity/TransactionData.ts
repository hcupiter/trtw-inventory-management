import { TransactionItem } from "./TransactionItem";
import { TransactionType } from "./TransactionType";

export interface TransactionData {
  id: number;
  date: Date;
  transactionType: TransactionType;
  totalPrice: number;
  transaction: TransactionItem[];
}
