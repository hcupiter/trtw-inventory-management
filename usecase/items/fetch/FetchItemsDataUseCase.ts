import { mapItemToEntity } from "@/models/dto/ItemDTO";
import { ItemEntity } from "@/models/entity/ItemEntity";

export const fetchAllItemsDataUseCase = async (): Promise<ItemEntity[]> => {
  try {
    const itemsResponse = await fetch(`/api/item`);
    const itemsData = await itemsResponse.json();

    if (!itemsResponse.ok)
      throw new Error(itemsData.error || "Gagal mengambil data item");

    const mappedItems: ItemEntity[] = await Promise.all(
      itemsData.items.map(mapItemToEntity)
    );
    return Promise.resolve(mappedItems);
  } catch (error) {
    return Promise.reject(error);
  }
};
