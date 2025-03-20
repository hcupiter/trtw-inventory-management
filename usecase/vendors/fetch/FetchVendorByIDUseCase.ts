import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { errorWriter } from "@/utils/errorWriter";

export const fetchVendorByIdUseCase = async (
  id: number
): Promise<VendorEntity> => {
  try {
    // Fetch Vendor
    const vendorResponse = await fetch(`/api/vendor/get/id?id=${id}`);
    const vendorData = await vendorResponse.json();

    if (!vendorResponse.ok) {
      throw new Error(vendorData.error || "Failed to fetch vendor data");
    }

    const mappedVendor: VendorEntity = mapVendorToEntity(vendorData.vendor);
    return Promise.resolve(mappedVendor);
  } catch (error) {
    return Promise.reject(error);
  }
};
