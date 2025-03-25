import { ItemDTO } from "@/models/dto/ItemDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface IITemService {
  save(item: ItemDTO): Promise<boolean>;
  getByID(id: number): Promise<ItemDTO | null>;
  getByItemId(itemId: string): Promise<ItemDTO | null>;
  getByNameOrId(
    query: string,
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
  removeItemStock(id: number, qty: number): Promise<boolean>;
  addItemStock(id: number, qty: number): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
