import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const fetchVendorByVendorIdUseCase = async (
  vendorId: string
): Promise<VendorEntity> => {
  try {
    // Fetch Vendor
    const vendorResponse = await fetch(
      `/api/vendor/get/vendorId?id=${vendorId}`
    );
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
