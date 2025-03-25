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
  itemId: string
): ItemTransactionReport | undefined => {
  try {
    const item = entity.transactionItems.find(
      (element) => element.itemId === itemId
    );

    if (!item) throw new Error("Barang tidak ditemukan dalam transaksi");
    if (!entity.id) throw new Error("Transaksi tidak memiliki id!");

    return {
      transactionId: entity.id,
      transactionType: entity.transactionType.type,
      date: entity.date,
      qty: item.qty,
      price: item.sellPrice,
      totalPrice: item.totalPrice,
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
