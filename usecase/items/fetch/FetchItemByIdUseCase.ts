import { mapItemToEntity } from "@/models/dto/ItemDTO";
import { ItemEntity } from "@/models/entity/ItemEntity";

export const fetchItemByIdUseCase = async (id: number): Promise<ItemEntity> => {
  try {
    const response = await fetch(`/api/item/get/id?id=${id}`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || `Gagal mengambil barang dengan id ${id}`);

    const mappedEntity: ItemEntity = await mapItemToEntity(data.items);
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
