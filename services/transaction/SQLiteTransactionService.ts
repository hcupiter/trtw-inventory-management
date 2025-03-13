import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { ITransactionService } from "./ITransactionService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export class SQLiteTransactionService implements ITransactionService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(transaction: TransactionDTO): Promise<number | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "INSERT INTO TransactionData (date, totalPrice, transactionTypeId) VALUES (?, ?, ?) "
      );
      const result = statement.run(
        transaction.date.toISOString(),
        transaction.totalPrice,
        transaction.transactionTypeId
      );
      return Promise.resolve(result.lastInsertRowid as number | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getById(id: number): Promise<TransactionDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM TransactionData WHERE id = ?"
      );
      const transaction = statement.get(id);
      return Promise.resolve(transaction as TransactionDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<TransactionDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(`
      SELECT * FROM TransactionData 
      ORDER BY date ${sort} 
      LIMIT ? OFFSET ?
    `);

      const transactions = statement.all(limit, offset);

      return Promise.resolve(transactions as TransactionDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAllRange(
    from: Date,
    to: Date,
    limit: number,
    offset: number,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<TransactionDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionData WHERE date BETWEEN ? AND ? ORDER BY date ${sort} LIMIT ? OFFSET ?`
      );

      const transactions = statement.all(
        from.toISOString(),
        to.toISOString(),
        limit,
        offset
      );

      return Promise.resolve(
        transactions as TransactionDTO[] | TransactionDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  update(transaction: TransactionDTO): Promise<number | null> {
    try {
      const statement = this.sqliteDb.prepare(
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
      const statement = this.sqliteDb.prepare(
        "DELETE FROM TransactionData WHERE id = ?"
      );
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
