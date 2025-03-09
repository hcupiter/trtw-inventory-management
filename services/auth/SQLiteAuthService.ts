import db from "@/database/db";
import { UserEntity } from "@/models/entity/UserEntity";
import { IAuthService } from "./IAuthService";

export class SQLiteAuthService implements IAuthService {
  getCurrentUser(email: String): Promise<UserEntity | null> {
    const statement = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = statement.get(email);
    return user || null;
  }

  login(email: String, password: String): Promise<UserEntity | null> {
    const statement = db.prepare(
      "SELECT * FROM users WHERE email = ? AND password = ?"
    );
    const user = statement.get(email, password);
    return user || null;
  }
}
