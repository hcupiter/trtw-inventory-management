import { ItemDTO } from "../dto/ItemDTO";

export interface ItemEntity {
  id?: number;
  itemId: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: number;
}

export const mapItemToDTO = (entity: ItemEntity): ItemDTO => {
  return {
    id: entity.id,
    itemId: entity.itemId,
    name: entity.name,
    price: entity.price,
    stockQty: entity.stockQty,
    vendorId: entity.vendorId,
  };
};
