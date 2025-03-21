import { TransactionDTO } from "../dto/TransactionDTO";
import { TransactionData } from "./TransactionData";

export interface ItemTransactionReport {
  transactionId: number;
  transactionType: string;
  date: Date;
  qty: number;
  price: number;
  totalPrice: number;
}

export const mapTransactionToItemTransactionReport = (
  entity: TransactionData,
  itemId: number
): ItemTransactionReport | null => {
  const item = entity.transaction.find((element) => element.id === itemId);

  if (!item) return null;

  return {
    transactionId: entity.id,
    transactionType: entity.transactionType.type,
    date: entity.date,
    qty: item.qty,
    price: item.sellPrice,
    totalPrice: item.totalPrice,
  };
};
