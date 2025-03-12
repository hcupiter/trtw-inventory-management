import { TransactionDTO } from "@/models/dto/TransactionDTO";

export interface ITransactionService {
  save(transaction: TransactionDTO): Promise<number | null>;
  getById(id: number): Promise<TransactionDTO | null>;
  getAll(): Promise<TransactionDTO[]>;
  getAllRange(from: Date, to: Date): Promise<TransactionDTO[]>;
  update(transaction: TransactionDTO): Promise<number | null>;
  delete(id: number): Promise<boolean>;
}
