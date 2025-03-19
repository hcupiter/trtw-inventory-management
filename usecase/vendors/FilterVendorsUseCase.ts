import { VendorDTO } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";

export const filterVendorsUseCase = (
  query: string,
  vendors: VendorEntity[]
): VendorEntity[] => {
  // Convert search query to lowercase for case-insensitive matching
  const searchLower = query.toLowerCase();

  const filtered = vendors.filter((vendor) => {
    const vendorName = vendor.name.toLowerCase();
    const vendorId = String(vendor.id).toLowerCase(); // Ensure id is a string

    return vendorName.includes(searchLower) || vendorId.includes(searchLower);
  });

  return filtered;
};
