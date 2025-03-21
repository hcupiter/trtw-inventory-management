import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface ITransactionService {
  save(transaction: TransactionDTO): Promise<number | null>;
  getById(id: number): Promise<TransactionDTO | null>;
  getAll(
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionDTO[]>;
  getAllRange(
    from: string,
    to: string,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionDTO[]>;
  getAllByItemId(
    itemId: number,
    from: string,
    to: string,
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionDTO[]>;
  update(transaction: TransactionDTO): Promise<number | null>;
  delete(id: number): Promise<boolean>;
}
