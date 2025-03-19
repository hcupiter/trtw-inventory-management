import { ItemEntity } from "@/models/entity/ItemEntity";

export const filterItemUseCase = (
  query: string,
  items: ItemEntity[]
): ItemEntity[] => {
  const searchLower = query.toLowerCase();
  const filtered = items.filter((item) => {
    const itemName = item.name.toLowerCase();
    const itemId = String(item.itemId).toLowerCase(); // Ensure id is a string

    return itemName.includes(searchLower) || itemId.includes(searchLower);
  });

  return filtered;
};
