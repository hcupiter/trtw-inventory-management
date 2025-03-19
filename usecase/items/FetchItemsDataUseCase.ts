import { mapItemToEntity } from "@/models/dto/ItemDTO";
import { ItemEntity } from "@/models/entity/ItemEntity";

export const fetchAllItemsDataUseCase = async () => {
  const itemsResponse = await fetch(`/api/item`);
  const itemsData = await itemsResponse.json();

  if (!itemsResponse.ok)
    throw new Error(itemsData.error || "Gagal mengambil data item");

  const mappedItems: ItemEntity[] = itemsData.items.map(mapItemToEntity);
  return mappedItems;
};
