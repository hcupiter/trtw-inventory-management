import { ItemEntity } from "../entity/ItemEntity";

export interface ItemDTO {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: string;
}

export const mapItemToEntity = (dto: ItemDTO): ItemEntity => {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    stockQty: dto.stockQty,
    vendorId: dto.vendorId,
  };
};
