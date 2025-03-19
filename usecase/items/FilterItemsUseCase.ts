import { ItemEntity } from "@/models/entity/ItemEntity";

export const filterItemUseCase = (
  query: string,
  items: ItemEntity[]
): ItemEntity[] => {
  const searchLower = query.toLowerCase();
  const filtered = items.filter((item) => {
    const itemName = item.name.toLowerCase();
    const itemId = String(item.itemId).toLowerCase(); // Ensure id is a string
    const vendorId = item.vendor.vendorId.toLowerCase();

    return (
      itemName.includes(searchLower) ||
      itemId.includes(searchLower) ||
      vendorId.includes(searchLower)
    );
  });

  return filtered;
};
