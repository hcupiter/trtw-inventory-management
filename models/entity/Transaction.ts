import { TransactionItem } from "./TransactionItem";

export interface Transaction {
  id: number;
  date: Date;
  totalPrice: number;
  transaction: TransactionItem[];
}
