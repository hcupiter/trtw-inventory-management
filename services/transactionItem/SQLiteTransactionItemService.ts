import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { ItransactionItemService } from "./ITransactionItemService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export class SQLiteTransactionItemService implements ItransactionItemService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(transactionItem: TransactionItemDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        "INSERT INTO TransactionItem (id, vendorID, qty, sellPrice, totalPrice, transactionID) VALUES (?, ?, ?, ?, ?, ?) "
      );

      const result = statement.run(
        transactionItem.id,
        transactionItem.vendorId,
        transactionItem.qty,
        transactionItem.sellPrice,
        transactionItem.totalPrice,
        transactionItem.transactionId
      );

      return Promise.resolve(result.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem ORDER BY id ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(limit, offset);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByItemID(id: string): Promise<TransactionItemDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM TransactionItem WHERE id = ?"
      );

      const transactionItem = statement.get(id);
      return Promise.resolve(transactionItem as TransactionItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByTransactionID(
    id: number,
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem WHERE transactionID = ? ORDER BY id ${sort} LIMIT ? OFFSET ?`
      );

      const results = statement.all(id, limit, offset);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByVendorID(
    id: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem WHERE vendorID = ? ORDER BY id ${sort} LIMIT ? OFFSET ?`
      );

      const results = statement.all(id, limit, offset);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  updateByItemID(transactionItem: TransactionItemDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        "UPDATE TransactionItem SET vendorID = ?, qty = ?, sellPrice = ?, totalPrice = ?, transactionID = ? WHERE id = ?"
      );
      const results = statement.run(
        transactionItem.vendorId,
        transactionItem.qty,
        transactionItem.sellPrice,
        transactionItem.totalPrice,
        transactionItem.transactionId,
        transactionItem.id
      );

      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  deleteByItemID(id: string): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        "DELETE FROM TransactionItem WHERE id = ?"
      );
      const result = statement.run(id);
      return Promise.resolve(result.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
