import { ItemEntity } from "@/models/entity/ItemEntity";

export const FilterItemUseCase = (
  query: string,
  items: ItemEntity[]
): ItemEntity[] => {
  const searchLower = query.toLowerCase();
  const filtered = items.filter((item) => {
    const itemName = item.name.toLowerCase();
    const itemId = String(item.id).toLowerCase(); // Ensure id is a string

    return itemName.includes(searchLower) || itemId.includes(searchLower);
  });

  return filtered;
};
