import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { ItemEntity } from "../entity/ItemEntity";

export interface ItemDTO {
  id?: number;
  itemId: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: number;
}

export const mapItemToEntity = (dto: ItemDTO): ItemEntity => {
  return {
    id: dto.id,
    itemId: dto.itemId,
    name: dto.name,
    price: dto.price,
    stockQty: dto.stockQty,
    vendorId: dto.vendorId,
  };
};
