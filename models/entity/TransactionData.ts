import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { InsertTransactionDTO } from "../dto/InsertTransactionDTO";
import { TransactionItem } from "./TransactionItem";
import { TransactionType } from "./TransactionType";

export interface TransactionData {
  id?: number;
  date: Date;
  transactionType: TransactionType;
  totalPrice: number;
  transactionItems: TransactionItem[];
}

export const mapToInsertTransactionDTO = (
  transactionData: TransactionData
): InsertTransactionDTO => {
  try {
    for (const item of transactionData.transactionItems) {
      if (!item.id)
        throw new Error(
          `Gagal memasukkan barang karena barang ${item.name} tidak memiliki id`
        );
    }

    return {
      transaction: {
        id: transactionData.id,
        date: formatDateToYYYYMMDD(transactionData.date),
        transactionTypeId: transactionData.transactionType.id,
      },
      items: transactionData.transactionItems.map((item) => ({
        id: item.id!,
        itemId: item.id!,
        name: item.name,
        qty: item.qty,
        sellPrice: item.sellPrice,
        vendorId: item.vendor.id,
        transactionId: transactionData.id,
      })),
    };
  } catch (error) {
    throw error;
  }
};
