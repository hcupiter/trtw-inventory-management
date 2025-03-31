import { ItemTransactionReport } from "@/models/entity/ItemTransactionReport";

// Returns map {price: qty}
export const GetItemTransactionSummary = (
  transactions: ItemTransactionReport[]
): Map<number, number> => {
  const itemTransactionSummary = new Map<number, number>();

  transactions.forEach((transaction) => {
    const currentQty = itemTransactionSummary.get(transaction.price) || 0; // Get existing qty or default to 0
    itemTransactionSummary.set(transaction.price, currentQty + transaction.qty);
  });

  return itemTransactionSummary;
};
