import { mapVendorToDTO, VendorEntity } from "@/models/entity/VendorEntity";
import { errorWriter } from "@/utils/errorWriter";

export const updateVendorUseCase = async (
  entity: VendorEntity
): Promise<string> => {
  try {
    const dto = mapVendorToDTO(entity);

    const response = await fetch("/api/vendor", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update vendor");
    }
    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
