import { VendorEntity } from "../entity/VendorEntity";

export interface VendorDTO {
  id?: number;
  vendorId: string;
  name: string;
  address?: string;
  phone?: string;
}

export const mapVendorToEntity = (dto: VendorDTO): VendorEntity => {
  return {
    id: dto.id || -1,
    vendorId: dto.vendorId,
    name: dto.name,
    address: dto.address,
    phone: dto.phone,
  };
};
