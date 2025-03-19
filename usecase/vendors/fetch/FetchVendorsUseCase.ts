import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const fetchVendorUseCase = async (): Promise<VendorEntity[]> => {
  const response = await fetch(`/api/vendor`);
  const data = await response.json();

  if (!response.ok) {
    Promise.reject(data.error || "Failed to fetch vendors");
  }
  const mappedVendors: VendorEntity[] = data.vendors.map(mapVendorToEntity);
  return Promise.resolve(mappedVendors);
};
