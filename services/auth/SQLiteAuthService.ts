import { UserEntity } from "@/models/entity/UserEntity";
import { IAuthService } from "./IAuthService";
import { IDatabase } from "../database/IDatabase";
import { database } from "@/utils/appModule";

export class SQLiteAuthService implements IAuthService {
  private sqliteDb: IDatabase;

  constructor(dbInstance: IDatabase = database) {
    this.sqliteDb = dbInstance; // Use real DB if no test DB provided
  }

  createSessionToken(user: UserEntity): Promise<string> {
    return Promise.resolve(user.email);
  }

  getCurrentUser(email: string): Promise<UserEntity | null> {
    const statement = this.sqliteDb
      .getInstance()
      .prepare("SELECT * FROM users WHERE email = ?");
    const user = statement.get(email);
    return user || null;
  }

  login(email: string, password: string): Promise<UserEntity | null> {
    const statement = this.sqliteDb
      .getInstance()
      .prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    const user = statement.get(email, password);
    return user || null;
  }
}
