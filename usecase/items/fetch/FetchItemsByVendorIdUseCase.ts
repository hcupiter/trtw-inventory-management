import { mapItemToEntity } from "@/models/dto/ItemDTO";
import { ItemEntity } from "@/models/entity/ItemEntity";

export const fetchItemsByVendorIdUseCase = async (
  vendorId: number
): Promise<ItemEntity[]> => {
  try {
    // Fetch Vendor
    const itemResponse = await fetch(`/api/item/get/vendorId?id=${vendorId}`);
    const itemData = await itemResponse.json();

    if (!itemResponse.ok) {
      throw new Error(itemData.error || "Failed to fetch item data");
    }

    const mappedEntity: ItemEntity[] = await Promise.all(
      itemData.items.map(mapItemToEntity)
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
