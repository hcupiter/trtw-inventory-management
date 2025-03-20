import { VendorEntity } from "../entity/VendorEntity";
import { z } from "zod";

export const VendorSchema = z.object({
  id: z.number().optional(),
  vendorId: z.string().min(1, "VendorID is required"),
  name: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

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
