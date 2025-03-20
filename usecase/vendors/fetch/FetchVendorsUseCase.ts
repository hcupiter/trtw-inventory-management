import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const fetchVendorUseCase = async (): Promise<VendorEntity[]> => {
  try {
    const response = await fetch(`/api/vendor`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch vendors");
    }
    const mappedVendors: VendorEntity[] = await Promise.all(
      data.vendors.map(mapVendorToEntity)
    );
    return Promise.resolve(mappedVendors);
  } catch (error) {
    return Promise.reject(error);
  }
};
