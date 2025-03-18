import { VendorDTO } from "@/models/dto/VendorDTO";

export interface VendorEntity {
  id: number;
  vendorId: string;
  name: string;
  address?: string;
  phone?: string;
}

export const mapVendorToDTO = (entity: VendorEntity): VendorDTO => {
  return {
    id: entity.id,
    vendorId: entity.vendorId,
    name: entity.name,
    address: entity.address,
    phone: entity.phone,
  };
};
