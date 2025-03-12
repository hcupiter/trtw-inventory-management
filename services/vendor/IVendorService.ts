import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface IVendorService {
  save(vendor: VendorDTO): Promise<string | null>;
  getById(id: string): Promise<VendorDTO | null>;
  getByName(
    name: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]>;
  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]>;
  update(vendor: VendorDTO): Promise<string | null>;
  delete(id: string): Promise<boolean>;
}
