import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";
import { IVendorService } from "./IVendorService";
import { IDatabase } from "../database/IDatabase";
import { database } from "@/utils/appModule";
import { VendorTransactionReportDTO } from "@/models/dto/VendorTransactionReportDTO";

const defaultOffset = 0;
const defaultLimit = 1000;
const defaultSort = QuerySortOrder.ASC;

export class SQLiteVendorService implements IVendorService {
  private sqliteDb: IDatabase;

  constructor(dbInstance: IDatabase = database) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(vendor: VendorDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(
          `INSERT INTO Vendor (vendorId, name, address, phone, isDeleted) VALUES (?, ?, ?, ?, 0)`
        );
      const results = statement.run(
        vendor.vendorId,
        vendor.name,
        vendor.address,
        vendor.phone
      );
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getById(id: number): Promise<VendorDTO | null> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(`SELECT * FROM Vendor WHERE id = ?`);
      const results = statement.get(id);
      return Promise.resolve((results as VendorDTO) ?? null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByVendorId(vendorId: string): Promise<VendorDTO | null> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(`SELECT * FROM Vendor WHERE vendorId = ?`);
      const results = statement.get(vendorId);
      return Promise.resolve((results as VendorDTO) ?? null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getByNameOrId(
    query: string,
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<VendorDTO[]> {
    try {
      const statement = this.sqliteDb.getInstance().prepare(
        `SELECT * FROM Vendor 
        WHERE (vendorId LIKE ? OR name LIKE ?) AND isDeleted = 0
        ORDER BY name ${sort} LIMIT ? OFFSET ?`
      );
      const results = statement.all(`%${query}%`, `%${query}%`, limit, offset);
      return Promise.resolve(results as VendorDTO[] | VendorDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<VendorDTO[]> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(
          `SELECT * FROM Vendor WHERE isDeleted = 0 ORDER BY name ${sort} LIMIT ? OFFSET ?`
        );
      const results = statement.all(limit, offset);
      return Promise.resolve(results as VendorDTO[] | VendorDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getVendorTransactionReport(
    vendorId: number,
    from: string,
    to: string
  ): Promise<VendorTransactionReportDTO[]> {
    try {
      const statement = this.sqliteDb.getInstance().prepare(
        `SELECT td.id AS transactionId, td.date AS date, ti.id AS transactionItemId
          FROM TransactionData td 
          INNER JOIN TransactionItem ti ON td.id = ti.transactionId
          WHERE ti.vendorId = ? AND (td.date >= ? AND td.date <= ?) 
          AND td.isDeleted = 0 AND ti.isDeleted = 0`
      );
      const results = statement.all(vendorId, from, to);
      return Promise.resolve(results as VendorTransactionReportDTO[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  update(vendor: VendorDTO): Promise<boolean> {
    try {
      if (!vendor.id) throw new Error("Tidak ada id untuk update vendor");

      const statement = this.sqliteDb
        .getInstance()
        .prepare(
          `UPDATE Vendor SET vendorId = ?, name = ?, address = ?, phone = ? WHERE id = ? AND isDeleted = 0`
        );
      const results = statement.run(
        vendor.vendorId,
        vendor.name,
        vendor.address,
        vendor.phone,
        vendor.id
      );
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  delete(id: string): Promise<boolean> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(`UPDATE Vendor SET isDeleted = 1 WHERE id = ?`);
      const results = statement.run(id);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
