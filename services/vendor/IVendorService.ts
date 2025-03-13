import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface IVendorService {
  save(vendor: VendorDTO): Promise<boolean>;
  getById(id: string): Promise<VendorDTO | null>;
  getByNameOrId(
    query: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]>;
  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]>;
  update(vendor: VendorDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
