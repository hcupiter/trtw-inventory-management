import { ItemDTO } from "../dto/ItemDTO";

export interface ItemEntity {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: string;
}

export const mapItemToDTO = (dto: ItemDTO): ItemEntity => {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    stockQty: dto.stockQty,
    vendorId: dto.vendorId,
  };
};
