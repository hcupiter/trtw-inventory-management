import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { ItransactionItemService } from "./ITransactionItemService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

const defaultOffset = 0;
const defaultLimit = 1000;
const defaultSort = QuerySortOrder.ASC;

export class SQLiteTransactionItemService implements ItransactionItemService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(transactionItem: TransactionItemDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        `INSERT INTO 
        TransactionItem (itemId, vendorID, name, qty, sellPrice, transactionID, isDeleted) 
        VALUES (?, ?, ?, ?, ?, ?, 0)`
      );

      const result = statement.run(
        transactionItem.itemId,
        transactionItem.vendorId,
        transactionItem.name,
        transactionItem.qty,
        transactionItem.sellPrice,
        transactionItem.transactionId
      );

      return Promise.resolve(result.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem 
        WHERE isDeleted = 0
        ORDER BY id ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(limit, offset);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByItemID(id: number): Promise<TransactionItemDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM TransactionItem WHERE itemId = ? AND isDeleted = 0"
      );

      const transactionItem = statement.get(id);
      return Promise.resolve(transactionItem as TransactionItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByTransactionID(
    id: number,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem 
        WHERE transactionID = ? AND isDeleted = 0 
        ORDER BY id ${sort} LIMIT ? OFFSET ?`
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
    id: number,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<TransactionItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM TransactionItem
         WHERE vendorID = ? AND isDeleted = 0
         ORDER BY id ${sort} LIMIT ? OFFSET ?`
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
        `UPDATE TransactionItem 
        SET vendorID = ?, qty = ?, sellPrice = ?, transactionID = ? 
        WHERE id = ? AND isDeleted = 0`
      );
      const results = statement.run(
        transactionItem.vendorId,
        transactionItem.qty,
        transactionItem.sellPrice,
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
        `UPDATE TransactionItem 
        SET isDeleted = 1
        WHERE id = ?`
      );
      const result = statement.run(id);
      return Promise.resolve(result.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
