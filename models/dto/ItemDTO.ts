import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { ItemEntity } from "../entity/ItemEntity";
import { z } from "zod";

export const ItemSchema = z.object({
  id: z.number().optional(),
  itemId: z.string(),
  name: z.string(),
  price: z.number(),
  stockQty: z.number(),
  vendorId: z.number(),
  isDeleted: z.boolean().optional(),
});

export interface ItemDTO {
  id?: number;
  itemId: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: number;
  isDeleted?: boolean;
}

export const mapItemToEntity = async (dto: ItemDTO): Promise<ItemEntity> => {
  try {
    const vendor = await fetchVendorByIdUseCase(dto.vendorId);
    return Promise.resolve({
      id: dto.id,
      itemId: dto.itemId,
      name: dto.name,
      price: dto.price,
      stockQty: dto.stockQty,
      vendor: vendor,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
