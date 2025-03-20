import { TransactionItem } from "../entity/TransactionItem";
import { z } from "zod";

export const TransactionItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string(),
  vendorId: z.string(),
  name: z.string(),
  qty: z.number(),
  sellPrice: z.number(),
  transactionId: z.number(),
});

export interface TransactionItemDTO {
  id?: string;
  itemId: string;
  vendorId: string;
  name: string;
  qty: number;
  sellPrice: number;
  transactionId: number;
}

export const mapTransactionItemToEntity = (
  dto: TransactionItemDTO
): TransactionItem => {
  return {
    id: dto.id,
    itemId: dto.itemId,
    vendorId: dto.vendorId,
    name: dto.name,
    qty: dto.qty,
    sellPrice: dto.sellPrice,
    totalPrice: dto.qty * dto.sellPrice,
  };
};
