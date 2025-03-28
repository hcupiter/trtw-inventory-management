import { TransactionItem } from "./TransactionItem";
import { TransactionType } from "./TransactionType";

export interface TransactionAudit {
  id?: number;
  date: Date;
  transactionType: TransactionType;
  totalPrice: number;
  transactionItems: TransactionItem[];
  isDeleted: boolean;
}
