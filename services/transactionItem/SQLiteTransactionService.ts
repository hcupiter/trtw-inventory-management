import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { ItransactionItemService } from "./ITransactionItemService";
import db from "@/database/db";

export class SQLiteTransactionItemService implements ItransactionItemService {
  save(transactionItem: TransactionItemDTO): Promise<string> {
    try {
      const statement = db.prepare(
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

      return Promise.resolve(result.lastInsertRowid as string);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByItemID(id: string): Promise<TransactionItemDTO | null> {
    try {
      const statement = db.prepare(
        "SELECT * FROM TransactionItem WHERE id = ?"
      );

      const transactionItem = statement.get(id);
      return Promise.resolve(transactionItem as TransactionItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByTransactionID(id: number): Promise<TransactionItemDTO[]> {
    try {
      const statement = db.prepare(
        "SELECT * FROM TransactionItem WHERE transactionID = ?"
      );

      const results = statement.all(id);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByVendorID(id: string): Promise<TransactionItemDTO[]> {
    try {
      const statement = db.prepare(
        "SELECT * FROM TransactionItem WHERE vendorID = ?"
      );

      const results = statement.all(id);
      return Promise.resolve(
        results as TransactionItemDTO[] | TransactionItemDTO[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  updateByItemID(transactionItem: TransactionItemDTO): Promise<string | null> {
    try {
      const statement = db.prepare(
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

      return Promise.resolve(results.changes > 0 ? transactionItem.id : null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  deleteByItemID(id: string): Promise<boolean> {
    try {
      const statement = db.prepare("DELETE FROM TransactionItem WHERE id = ?");
      const result = statement.run(id);
      return Promise.resolve(result.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
