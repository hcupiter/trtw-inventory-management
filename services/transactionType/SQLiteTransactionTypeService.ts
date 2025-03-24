import { TransactionTypeDTO } from "@/models/dto/TransactionTypeDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";
import { ITransactionTypeService } from "./ITransactionTypeService";
import { IDatabase } from "../database/IDatabase";
import { database } from "@/utils/appModule";

const defaultOffset = 0;
const defaultLimit = 50;
const defaultSort = QuerySortOrder.ASC;

export class SQLiteTransactionTypeService implements ITransactionTypeService {
  private sqliteDb: IDatabase;

  constructor(dbInstance: IDatabase = database) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  save(type: TransactionTypeDTO): Promise<boolean> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(`INSERT INTO TransactionType (id, type) VALUES (?, ?)`);
      const results = statement.run(type.id, type.type);
      return Promise.resolve(results.changes > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(
    limit: number = defaultLimit,
    offset: number = defaultOffset,
    sort: QuerySortOrder = defaultSort
  ): Promise<TransactionTypeDTO[]> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(
          `SELECT * FROM TransactionType ORDER BY id ${sort} LIMIT ? OFFSET ? `
        );

      const results = statement.all(limit, offset);
      return Promise.resolve(results as TransactionTypeDTO[] | []);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getById(id: number): Promise<TransactionTypeDTO | null> {
    try {
      const statement = this.sqliteDb
        .getInstance()
        .prepare(`SELECT * FROM TransactionType WHERE id = ?`);

      const results = statement.get(id);
      return Promise.resolve(results as TransactionTypeDTO | null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
