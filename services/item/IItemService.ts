import { ItemDTO } from "@/models/dto/ItemDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface IITemService {
  save(item: ItemDTO): Promise<boolean>;
  getByID(id: string): Promise<ItemDTO | null>;
  getByName(
    name: string,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<ItemDTO[]>;
  getAll(
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<ItemDTO[]>;
  getByVendorID(
    id: string,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<ItemDTO[]>;
  update(item: ItemDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
