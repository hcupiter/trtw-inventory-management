import { ItemDTO } from "@/models/dto/ItemDTO";
import { IITemService } from "./IItemService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

const defaultOffset = 0;
const defaultLimit = 1000;

export class SQLiteItemService implements IITemService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(item: ItemDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        "INSERT INTO Item (itemId, name, price, stockQty, vendorId, isDeleted) VALUES (?, ?, ?, ?, ?, 0)"
      );

      const results = statement.run(
        item.itemId,
        item.name,
        item.price,
        item.stockQty,
        item.vendorId
      );
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByID(id: number): Promise<ItemDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM Item WHERE id = ? AND isDeleted = 0"
      );
      const results = statement.get(id);
      return Promise.resolve(results as ItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByItemId(itemId: string): Promise<ItemDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM Item WHERE itemId = ? AND isDeleted = 0"
      );
      const results = statement.get(itemId);
      return Promise.resolve(results as ItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByNameOrId(
    query: string,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item WHERE (itemId LIKE ? OR name LIKE ?) AND isDeleted = 0 ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const result = statement.all(`%${query}%`, `%${query}%`, limit, offset);
      return Promise.resolve(result as ItemDTO[] | []);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item WHERE isDeleted = 0 ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(limit, offset);
      return Promise.resolve(results as ItemDTO[] | ItemDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByVendorID(
    id: string,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item WHERE vendorID = ? AND isDeleted = 0 ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(id, limit, offset);
      return Promise.resolve(results as ItemDTO[] | ItemDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  update(item: ItemDTO): Promise<boolean> {
    try {
      if (!item.id) throw new Error("Tidak ada id untuk update item");

      const statement = this.sqliteDb.prepare(
        `UPDATE Item 
        SET itemId = ?, name = ?, price = ?, stockQty = ?, vendorID = ? 
        WHERE id = ? AND isDeleted = 0`
      );
      const results = statement.run(
        item.itemId,
        item.name,
        item.price,
        item.stockQty,
        item.vendorId,
        item.id
      );
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  delete(id: string): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        "UPDATE Item SET isDeleted = 1 WHERE id = ?"
      );
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
