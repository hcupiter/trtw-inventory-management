import { ItemEntity } from "@/models/entity/ItemEntity";
import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";

export const filterItemNotInCartUseCase = (
  items: ItemEntity[],
  carts: TransactionItemCardEntity[]
): ItemEntity[] => {
  const filteredItemsNotInCart = items.filter(
    (item) => !carts.some((cartItem) => cartItem.item.id === item.id)
  );
  return filteredItemsNotInCart;
};
