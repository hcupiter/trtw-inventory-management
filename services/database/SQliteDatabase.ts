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
}
