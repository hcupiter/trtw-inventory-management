import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";

export const validateCartUseCase = (
  cart: TransactionItemCardEntity[]
): string => {
  if (cart.length <= 0)
    return "Mohon masukkan barang yang terjual selama transaksi";
  return "";
};
