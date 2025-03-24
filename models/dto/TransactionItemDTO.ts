import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { TransactionItem } from "../entity/TransactionItem";
import { z } from "zod";
import { fetchItemByIdUseCase } from "@/usecase/items/fetch/FetchItemByIdUseCase";

export const TransactionItemSchema = z.object({
  id: z.number().optional(),
  itemId: z.number(),
  vendorId: z.number(),
  name: z.string(),
  qty: z.number(),
  sellPrice: z.number(),
  transactionId: z.number().optional(),
});

export interface TransactionItemDTO {
  id?: number;
  itemId: number;
  vendorId: number;
  name: string;
  qty: number;
  sellPrice: number;
  transactionId?: number;
}

export const mapTransactionItemToEntity = async (
  dto: TransactionItemDTO
): Promise<TransactionItem> => {
  try {
    const vendor = await fetchVendorByIdUseCase(dto.vendorId);
    const item = await fetchItemByIdUseCase(dto.itemId);
    return Promise.resolve({
      id: dto.id,
      itemId: item.itemId,
      vendor: vendor,
      name: dto.name,
      qty: dto.qty,
      sellPrice: dto.sellPrice,
      totalPrice: dto.qty * dto.sellPrice,
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
