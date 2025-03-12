import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";

export interface ItransactionItemService {
  save(transactionItem: TransactionItemDTO): Promise<string>;
  getByItemID(id: string): Promise<TransactionItemDTO | null>;
  getByTransactionID(id: number): Promise<TransactionItemDTO[]>;
  getByVendorID(id: string): Promise<TransactionItemDTO[]>;
  updateByItemID(transactionItem: TransactionItemDTO): Promise<string | null>;
  deleteByItemID(id: string): Promise<boolean>;
}
