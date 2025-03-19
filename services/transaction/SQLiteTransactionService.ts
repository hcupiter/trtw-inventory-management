import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { ITransactionService } from "./ITransactionService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

const defaultOffset = 0;
const defaultLimit = 50;

export class SQLiteTransactionService implements ITransactionService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(transaction: TransactionDTO): Promise<number | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "INSERT INTO TransactionData (date, transactionTypeId, isDeleted) VALUES (?, ?, 0) "
      );
      const result = statement.run(
        transaction.date,
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
        "SELECT * FROM TransactionData WHERE id = ? AND isDeleted = 0"
      );
      const transaction = statement.get(id);
      return Promise.resolve(transaction as TransactionDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<TransactionDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(`
      SELECT * FROM TransactionData WHERE isDeleted = 0
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
    from: string,
    to: string,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<TransactionDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionData 
        WHERE date BETWEEN ? AND ? AND isDeleted = 0
        ORDER BY date ${sort} LIMIT ? OFFSET ?`
      );

      const transactions = statement.all(from, to, limit, offset);

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
        `UPDATE TransactionData 
        SET date = ?, transactionTypeId = ? 
        WHERE id = ? AND isDeleted = 0`
      );
      const results = statement.run(
        transaction.date,
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
        `UPDATE TransactionData
        SET isDeleted = 1 
        WHERE id = ?`
      );
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
