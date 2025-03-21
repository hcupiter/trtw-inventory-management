import { ItemEntity, mapItemToDTO } from "@/models/entity/ItemEntity";

export const updateItemUseCase = async (
  entity: ItemEntity
): Promise<string> => {
  try {
    const dto = mapItemToDTO(entity);

    const response = await fetch("/api/item", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Gagal update barang. Mohon coba kembali..."
      );
    }
    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
