import { VendorEntity } from "../entity/VendorEntity";

export interface VendorDTO {
  id: string;
  name: string;
  address?: string;
  phone?: string;
}

export const mapVendorToEntity = (dto: VendorDTO): VendorEntity => {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    phone: dto.phone,
  };
};
