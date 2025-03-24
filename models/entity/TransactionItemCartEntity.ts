import { ItemEntity } from "./ItemEntity";
import { TransactionItem } from "./TransactionItem";

export interface TransactionItemCardEntity {
  item: ItemEntity;
  qty: number;
}

export const mapToTransactionItem = (
  entity: TransactionItemCardEntity
): TransactionItem => {
  return {
    id: entity.item.id,
    itemId: entity.item.itemId,
    name: entity.item.name,
    qty: entity.qty,
    sellPrice: entity.item.price,
    totalPrice: entity.item.price * entity.qty,
    vendor: entity.item.vendor,
  };
};
