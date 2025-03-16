import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface ItransactionItemService {
  save(transactionItem: TransactionItemDTO): Promise<boolean>;
  getAll(
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionItemDTO[]>;
  getByItemID(id: string): Promise<TransactionItemDTO | null>;
  getByTransactionID(
    id: number,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionItemDTO[]>;
  getByVendorID(
    id: string,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionItemDTO[]>;
  updateByItemID(transactionItem: TransactionItemDTO): Promise<boolean>;
  deleteByItemID(id: string): Promise<boolean>;
}
