import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";
import { IVendorService } from "./IVendorService";
import db from "@/database/db"; // Shared DB instance

export class SQLiteVendorService implements IVendorService {
  private sqliteDb: any;

  constructor(dbInstance: any = db) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(vendor: VendorDTO): Promise<string | null> {
    try {
      const statement = this.sqliteDb.prepare(
        `INSERT INTO Vendor (id, name, address, phone) VALUES (?, ?, ?, ?)`
      );
      const results = statement.run(
        vendor.id,
        vendor.name,
        vendor.address,
        vendor.phone
      );
      return Promise.resolve(results.lastInsertRowid as string | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getById(id: string): Promise<VendorDTO | null> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Vendor WHERE id = ?`
      );
      const results = statement.get(id);
      return Promise.resolve(results as VendorDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByName(
    name: string,
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Vendor WHERE name LIKE ? ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(name, limit, offset);
      return Promise.resolve(results as VendorDTO[] | VendorDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getAll(
    limit: number,
    offset: number,
    sort: QuerySortOrder
  ): Promise<VendorDTO[]> {
    try {
      const statement = this.sqliteDb.prepare(
        `SELECT * FROM Vendor ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(limit, offset);
      return Promise.resolve(results as VendorDTO[] | VendorDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  update(vendor: VendorDTO): Promise<string | null> {
    try {
      const statement = this.sqliteDb.prepare(
        `UPDATE Vendor SET name = ?, address = ?, phone = ? WHERE id = ?`
      );
      const results = statement.run(
        vendor.name,
        vendor.address,
        vendor.phone,
        vendor.id
      );
      return Promise.resolve(results.changes > 0 ? vendor.id : null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  delete(id: string): Promise<boolean> {
    try {
      const statement = this.sqliteDb.prepare(
        `DELETE FROM Vendor WHERE id = ?`
      );
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
