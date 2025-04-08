import { IDatabase } from "./IDatabase";
import Database from "better-sqlite3";

export class SQLiteDatabase implements IDatabase {
  private db: any;

  constructor() {
    this.db = new Database("database.sqlite");
  }

  beginTransaction(): void {
    this.db.prepare("BEGIN TRANSACTION").run();
  }

  commit(): void {
    this.db.prepare("COMMIT").run();
  }

  rollback(): void {
    this.db.prepare("ROLLBACK").run();
  }

  getInstance(): any {
    return this.db;
  }

  resetDatabase(): Promise<boolean> {
    const deleteQuery = (tableName: string) => {
      this.db.prepare(`DELETE FROM ${tableName}`).run();
      this.db
        .prepare(`DELETE FROM sqlite_sequence WHERE name='${tableName}';`)
        .run();
    };

    try {
      deleteQuery(`TransactionItem`);
      deleteQuery(`TransactionData`);
      deleteQuery(`Item`);
      deleteQuery(`Vendor`);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
