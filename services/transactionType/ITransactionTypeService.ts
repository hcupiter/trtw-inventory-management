import { TransactionTypeDTO } from "@/models/dto/TransactionTypeDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface ITransactionTypeService {
  save(type: TransactionTypeDTO): Promise<boolean>;
  getAll(
    limit?: number,
    offset?: number,
    sort?: QuerySortOrder
  ): Promise<TransactionTypeDTO[]>;

  getById(id: number): Promise<TransactionTypeDTO | null>;
}
