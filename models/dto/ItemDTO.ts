import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { ItemEntity } from "../entity/ItemEntity";
import { errorWriter } from "@/utils/errorWriter";

export interface ItemDTO {
  id?: number;
  itemId: string;
  name: string;
  price: number;
  stockQty: number;
  vendorId: number;
}

export const mapItemToEntity = async (dto: ItemDTO): Promise<ItemEntity> => {
  try {
    const vendor = await fetchVendorByIdUseCase(dto.vendorId);
    return {
      id: dto.id,
      itemId: dto.itemId,
      name: dto.name,
      price: dto.price,
      stockQty: dto.stockQty,
      vendor: vendor,
    };
  } catch (error) {
    return Promise.reject(
      errorWriter(error, `Gagal mapping vendor untuk item ${dto.itemId}`)
    );
  }
};
