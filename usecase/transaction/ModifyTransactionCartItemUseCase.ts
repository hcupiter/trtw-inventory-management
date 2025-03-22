import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";

export const addTransactionCartItemUseCase = (
  cart: TransactionItemCardEntity[],
  selectedItem: number
): TransactionItemCardEntity[] => {
  return cart.map((item) => {
    if (item.item.id === selectedItem) {
      // Ensure we don't exceed stock quantity
      const newQuantity = Math.min(item.qty + 1, item.item.stockQty);
      return {
        ...item,
        qty: newQuantity, // Update quantity
      };
    }
    return item;
  });
};

export const removeTransactionCartItemUseCase = (
  cart: TransactionItemCardEntity[],
  selectedItem: number
): TransactionItemCardEntity[] => {
  return cart
    .map((item) => {
      if (item.item.id === selectedItem) {
        const newQuantity = Math.max(item.qty - 1, 0);
        if (newQuantity <= 0) return null;
        return {
          ...item,
          qty: newQuantity, // Update quantity
        };
      }
      return item;
    })
    .filter((item) => item !== null); // Remove items with qty === 0;
};
