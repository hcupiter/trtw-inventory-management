import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const fetchVendorByIdUseCase = async (
  id: number
): Promise<VendorEntity> => {
  // Fetch Vendor
  const vendorResponse = await fetch(`/api/vendor/get/id?id=${id}`);
  const vendorData = await vendorResponse.json();

  if (!vendorResponse.ok) {
    Promise.reject(vendorData.error || "Failed to fetch vendor data");
  }

  const mappedVendor: VendorEntity = mapVendorToEntity(vendorData.vendor);
  return Promise.resolve(mappedVendor);
};
