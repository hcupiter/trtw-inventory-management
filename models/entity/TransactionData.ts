import { TransactionItem } from "./TransactionItem";

export interface TransactionData {
  id: number;
  date: Date;
  totalPrice: number;
  transaction: TransactionItem[];
}
