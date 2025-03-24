import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";

export const calculateTotalCartPriceUseCase = (
  cart: TransactionItemCardEntity[]
) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.item.price * item.qty,
    0
  );

  return totalPrice;
};
