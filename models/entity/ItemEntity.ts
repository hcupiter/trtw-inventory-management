import { ItemDTO } from "../dto/ItemDTO";
import { VendorEntity } from "./VendorEntity";

export interface ItemEntity {
  id?: number;
  itemId: string;
  name: string;
  price: number;
  stockQty: number;
  vendor: VendorEntity;
}

export const mapItemToDTO = (entity: ItemEntity): ItemDTO => {
  return {
    id: entity.id,
    itemId: entity.itemId,
    name: entity.name,
    price: entity.price,
    stockQty: entity.stockQty,
    vendorId: entity.vendor.id,
  };
};
