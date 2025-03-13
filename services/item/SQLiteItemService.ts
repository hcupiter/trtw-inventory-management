import { ItemDTO } from "@/models/dto/ItemDTO";
import { IITemService } from "./IItemService";
import db from "@/database/db";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export class SQLiteItemService implements IITemService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(item: ItemDTO): Promise<string | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "INSERT INTO Item (id, name, price, stokQty, vendorID) VALUES (?, ?, ?, ?, ?)"
      );

      const results = statement.run(
        item.id,
        item.name,
        item.price,
        item.stokQty,
        item.vendorID
      );
      return Promise.resolve(results.lastInsertRowid as string | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByID(id: string): Promise<ItemDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        "SELECT * FROM Item WHERE id = ?"
      );
      const results = statement.get(id);
      return Promise.resolve(results as ItemDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByName(
    name: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item WHERE name LIKE ? ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const result = statement.all(`%${name}%`, limit, offset);
      return Promise.resolve(result as ItemDTO[] | ItemDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(limit, offset);
      return Promise.resolve(results as ItemDTO[] | ItemDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByVendorID(
    id: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder = QuerySortOrder.ASC
  ): Promise<ItemDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Item WHERE vendorID = ? ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(id, limit, offset);
      return Promise.resolve(results as ItemDTO[] | ItemDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  update(item: ItemDTO): Promise<string | null> {
    try {
      const statement = this.sqliteDb.prepare(
        `UPDATE Item SET name = ?, price = ?, stokQty = ?, vendorID = ? WHERE id = ?`
      );
      const results = statement.run(
        item.name,
        item.price,
        item.stokQty,
        item.vendorID,
        item.id
      );
      return Promise.resolve(results.changes > 0 ? item.id : null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  delete(id: string): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare("DELETE FROM Item WHERE id = ?");
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
