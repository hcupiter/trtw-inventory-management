import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { ITransactionService } from "./ITransactionService";
import db from "@/database/db";

export class SQLiteTransactionService implements ITransactionService {
  save(transaction: TransactionDTO): Promise<number | null> {
    try {
      const statement = db.prepare(
        "INSERT INTO TransactionData (date, totalPrice, transactionTypeId) VALUES (?, ?, ?) "
      );
      const result = statement.run(
        transaction.date,
        transaction.totalPrice,
        transaction.transactionTypeId
      );
      return Promise.resolve(result.lastInsertRowid as number);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getById(id: number): Promise<TransactionDTO | null> {
    try {
      const statement = db.prepare(
        "SELECT * FROM TransactionData WHERE id = ?"
      );
      const transaction = statement.get(id);
      return Promise.resolve(transaction as TransactionDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getAll(): Promise<TransactionDTO[]> {
    try {
      const statement = db.prepare("SELECT * FROM TransactionData LIMIT 10");
      const transaction = statement.all();
      return Promise.resolve(
        transaction as TransactionDTO[] | TransactionDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getAllRange(from: Date, to: Date): Promise<TransactionDTO[]> {
    try {
      const statement = db.prepare(
        "SELECT * FROM TransactionData WHERE date BETWEEN ? AND ?"
      );

      const transactions = statement.all(from.toISOString(), to.toISOString());

      return Promise.resolve(
        transactions as TransactionDTO[] | TransactionDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
  update(transaction: TransactionDTO): Promise<number | null> {
    try {
      const statement = db.prepare(
        "UPDATE TransactionData SET date = ?, totalPrice = ?, transactionTypeId = ? WHERE id = ?"
      );
      const results = statement.run(
        transaction.date,
        transaction.totalPrice,
        transaction.transactionTypeId,
        transaction.id
      );
      return Promise.resolve(results.changes > 0 ? transaction.id : null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  delete(id: number): Promise<boolean> {
    try {
      const statement = db.prepare("DELETE FROM TransactionData WHERE id = ?");
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
