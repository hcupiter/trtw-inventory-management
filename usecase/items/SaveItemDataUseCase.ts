import { ItemEntity, mapItemToDTO } from "@/models/entity/ItemEntity";
import { errorWriter } from "@/utils/errorWriter";

export const saveItemDataUseCase = async (
  entity: ItemEntity
): Promise<string> => {
  try {
    const dto = mapItemToDTO(entity);
    const response = await fetch("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal menyimpan");
    }

    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
