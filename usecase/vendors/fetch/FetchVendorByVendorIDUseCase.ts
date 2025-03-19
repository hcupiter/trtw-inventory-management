import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const fetchVendorByVendorIdUseCase = async (
  vendorId: string
): Promise<VendorEntity> => {
  // Fetch Vendor
  const vendorResponse = await fetch(`/api/vendor/get/vendorId?id=${vendorId}`);
  const vendorData = await vendorResponse.json();

  if (!vendorResponse.ok) {
    Promise.reject(vendorData.error || "Failed to fetch vendor data");
  }

  const mappedVendor: VendorEntity = mapVendorToEntity(vendorData.vendor);
  return Promise.resolve(mappedVendor);
};
